"use client"

import * as React from "react"
import { getTenantId } from "@/lib/api/auth"
import { getSubscriptionStatus } from "@/lib/api/tenant"

// TypeScript Interfaces
export type LandingStep = "checking" | "subscription" | "payment" | "setup" | "complete"

export interface CompanyData {
  name: string
  contactEmail: string
  businessType: string
  address: string
  phone: string
}

export interface PaymentData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  billingAddress: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular: boolean
}

export interface LandingContextType {
  currentStep: LandingStep
  setCurrentStep: (step: LandingStep) => void
  hasSubscription: boolean
  setHasSubscription: (has: boolean) => void
  tenantId?: string
  setTenantId: (id: string | undefined) => void
  selectedPlan: string | null
  setSelectedPlan: (plan: string | null) => void
  selectedPaymentMethod: string | null
  setSelectedPaymentMethod: (method: string | null) => void
  setupProgress: number
  setSetupProgress: (progress: number) => void
  companyData: CompanyData
  setCompanyData: (data: Partial<CompanyData>) => void
  paymentData: PaymentData
  setPaymentData: (data: Partial<PaymentData>) => void
  // Progress tracking
  stepProgress: Record<LandingStep, number>
  setStepProgress: (step: LandingStep, progress: number) => void
  // Back navigation
  canGoBack: boolean
  goBack: () => void
  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const LandingContext = React.createContext<LandingContextType | null>(null)

export function useLanding() {
  const context = React.useContext(LandingContext)
  if (!context) {
    throw new Error("useLanding must be used within LandingProvider")
  }
  return context
}

export function LandingProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = React.useState<LandingStep>("checking")
  const [hasSubscription, setHasSubscription] = React.useState(false)
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string | null>(null)
  const [setupProgress, setSetupProgress] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [tenantId, setTenantId] = React.useState<string | undefined>(undefined)
  
  const [companyData, setCompanyDataState] = React.useState<CompanyData>({
    name: "",
    contactEmail: "",
    businessType: "",
    address: "",
    phone: "",
  })
  
  const [paymentData, setPaymentDataState] = React.useState<PaymentData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  })

  const setCompanyData = React.useCallback((data: Partial<CompanyData>) => {
    setCompanyDataState(prev => ({ ...prev, ...data }))
  }, [])

  const setPaymentData = React.useCallback((data: Partial<PaymentData>) => {
    setPaymentDataState(prev => ({ ...prev, ...data }))
  }, [])

  // Step progress tracking
  const [stepProgress, setStepProgressState] = React.useState<Record<LandingStep, number>>({
    checking: 0,
    subscription: 0,
    payment: 0,
    setup: 0,
    complete: 0,
  })

  // Persist onboarding state to localStorage to survive refresh
  React.useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const serialized = JSON.stringify({
        currentStep,
        hasSubscription,
        selectedPlan,
        selectedPaymentMethod,
        companyData,
        paymentData,
        stepProgress,
        tenantId,
      })
      localStorage.setItem("onboarding-state", serialized)
    } catch {}
  }, [currentStep, hasSubscription, selectedPlan, selectedPaymentMethod, companyData, paymentData, stepProgress, tenantId])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const persisted = localStorage.getItem("onboarding-state")
      if (persisted) {
        const parsed = JSON.parse(persisted)
        if (parsed.currentStep) setCurrentStep(parsed.currentStep)
        if (typeof parsed.hasSubscription === "boolean") setHasSubscription(parsed.hasSubscription)
        if (parsed.selectedPlan) setSelectedPlan(parsed.selectedPlan)
        if (parsed.selectedPaymentMethod) setSelectedPaymentMethod(parsed.selectedPaymentMethod)
        if (parsed.companyData) setCompanyData(parsed.companyData)
        if (parsed.paymentData) setPaymentData(parsed.paymentData)
        if (parsed.stepProgress) setStepProgressState(parsed.stepProgress)
        if (parsed.tenantId) setTenantId(parsed.tenantId)
      }
    } catch {}

  }, [])

  // Step order for back navigation
  const stepOrder: LandingStep[] = ["checking", "subscription", "payment", "setup", "complete"]

  const setStepProgress = React.useCallback((step: LandingStep, progress: number) => {
    setStepProgressState(prev => ({ ...prev, [step]: progress }))
  }, [])

  const canGoBack = React.useMemo(() => {
    const currentIndex = stepOrder.indexOf(currentStep)
    return currentIndex > 0 && currentStep !== "checking"
  }, [currentStep])

  const goBack = React.useCallback(() => {
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      const previousStep = stepOrder[currentIndex - 1]
      setCurrentStep(previousStep)
    }
  }, [currentStep])

  // Check subscription status on mount using backend
  React.useEffect(() => {
    const checkSubscription = async () => {
      try {
        setIsLoading(true)
        setStepProgress("checking", 20)

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        if (!token) {
          setStepProgress("checking", 100)
          setIsLoading(false)
          setCurrentStep("subscription")
          return
        }

        // Get current user's tenant id
        const tenantInfo = await getTenantId(token)
        const id = tenantInfo?.tenantId || tenantInfo?.tenant_id || tenantInfo?.id
        if (id) setTenantId(id)
        setStepProgress("checking", 50)

        // Ask tenant-service for subscription status
        if (id) {
          const status = await getSubscriptionStatus(id, token)
          const isActive = Boolean(status?.is_active ?? status?.isActive ?? (status?.status === "ACTIVE"))
          setHasSubscription(isActive)
          setStepProgress("checking", 100)
          setCurrentStep(isActive ? "setup" : "subscription")
        } else {
          setStepProgress("checking", 100)
          setCurrentStep("subscription")
        }
      } catch (err) {
        // On failure, default to subscription selection to allow user to continue
        setStepProgress("checking", 100)
        setCurrentStep("subscription")
      } finally {
        setIsLoading(false)
      }
    }

    checkSubscription()
  }, [setStepProgress])

  const value: LandingContextType = {
    currentStep,
    setCurrentStep,
    hasSubscription,
    setHasSubscription,
    tenantId,
    setTenantId,
    selectedPlan,
    setSelectedPlan,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    setupProgress,
    setSetupProgress,
    companyData,
    setCompanyData,
    paymentData,
    setPaymentData,
    stepProgress,
    setStepProgress,
    canGoBack,
    goBack,
    isLoading,
    setIsLoading,
  }

  return <LandingContext.Provider value={value}>{children}</LandingContext.Provider>
}
