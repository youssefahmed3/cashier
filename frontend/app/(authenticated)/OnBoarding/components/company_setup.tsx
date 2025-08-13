"use client"

import * as React from "react"
import { useLanding } from "./landing-provider"
import { updateTenant } from "@/lib/api/tenant"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Building2, Mail, Phone, MapPin, ArrowRight, CheckCircle } from "lucide-react"

export function CompanySetup() {
  const { companyData, setCompanyData, setupProgress, setSetupProgress, setCurrentStep, tenantId } = useLanding()

  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const steps = [
    {
      title: "Company Information",
      description: "Tell us about your business",
      fields: ["name", "businessType"],
    },
    {
      title: "Contact Details",
      description: "How can we reach you?",
      fields: ["contactEmail", "phone"],
    },
    {
      title: "Business Address",
      description: "Where is your business located?",
      fields: ["address"],
    },
  ]

  const businessTypes = [
    "Supermarket",
    "Grocery Store",
    "Convenience Store",
    "Hypermarket",
    "Specialty Food Store",
    "Organic Market",
    "Other",
  ]

  React.useEffect(() => {
    const progress = ((currentStepIndex + 1) / steps.length) * 100
    setSetupProgress(progress)
  }, [currentStepIndex, setSetupProgress])

  const handleInputChange = (field: keyof typeof companyData, value: string) => {
    setCompanyData({ [field]: value })
  }

  const isCurrentStepValid = () => {
    const currentStep = steps[currentStepIndex]
    return currentStep.fields.every((field) => {
      const value = companyData[field as keyof typeof companyData]
      return value && typeof value === 'string' && value.trim() !== ""
    })
  }

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) throw new Error("Not authenticated")

      if (tenantId) {
        await updateTenant(
          {
            name: companyData.name,
            is_active: true,
          },
          tenantId,
          token
        )
      }
      setCurrentStep("complete")
    } catch (error: any) {
      toast.error(error?.message || "Failed to complete setup")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinue = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      handleComplete()
    }
  }

  const currentStep = steps[currentStepIndex]

  return (
    <div className="h-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-y-auto">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <Building2 className="size-5" />
            </div>
          </div>
          <CardTitle className="text-lg font-bold mb-1 text-gray-800">
            Setup Your Account
          </CardTitle>
          <CardDescription className="text-xs text-gray-600">
            Let's get your SuperMarket Pro account ready
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {Math.round(setupProgress)}% Complete
              </span>
            </div>
            <div className="relative">
              <Progress value={setupProgress} className="h-1.5 bg-gray-100" />
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {currentStep.title}
              </h3>
              <p className="text-sm text-gray-600">
                {currentStep.description}
              </p>
            </div>

            {/* Step 1: Company Information */}
            {currentStepIndex === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                    Company Name *
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Enter your company name"
                      value={companyData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10 h-10 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType" className="text-sm font-medium text-gray-700">
                    Business Type *
                  </Label>
                  <Select value={companyData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grocery">Grocery Store</SelectItem>
                      <SelectItem value="supermarket">Supermarket</SelectItem>
                      <SelectItem value="convenience">Convenience Store</SelectItem>
                      <SelectItem value="organic">Organic Market</SelectItem>
                      <SelectItem value="specialty">Specialty Food Store</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {currentStepIndex === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                    Contact Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="admin@yourstore.com"
                      value={companyData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="pl-10 h-10 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+201501711718"
                      value={companyData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10 h-10 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Business Address */}
            {currentStepIndex === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Business Address *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      id="address"
                      placeholder="123 Main Street, City, State, ZIP Code"
                      value={companyData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-20 text-sm"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="text-sm font-semibold text-blue-900">Account Summary</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium">{companyData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{companyData.businessType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{companyData.contactEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{companyData.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="px-6 py-2 text-sm"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!isCurrentStepValid()}
            className="px-6 py-2 text-sm"
          >
            {currentStepIndex === steps.length - 1 ? (
              <>
                Complete Setup
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
