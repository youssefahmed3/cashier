"use client"
import { useLanding, LandingStep } from "./landing-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Circle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface OnboardingStep {
  id: LandingStep
  label: string
  description: string
}

const onboardingSteps: OnboardingStep[] = [
  { id: "checking", label: "Account Check", description: "Verifying your account" },
  { id: "subscription", label: "Choose Plan", description: "Select your subscription" },
  { id: "payment", label: "Payment", description: "Complete payment setup" },
  { id: "setup", label: "Company Setup", description: "Configure your business" },
  { id: "complete", label: "Complete", description: "You're all set!" },
]

export function OnboardingProgress() {
  const { currentStep, canGoBack, goBack, stepProgress } = useLanding()

  const currentStepIndex = onboardingSteps.findIndex(step => step.id === currentStep)
  const overallProgress = ((currentStepIndex + 1) / onboardingSteps.length) * 100

  const handleGoBack = () => {
    goBack()
  }

  return (
    <div className="w-full bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-gray-200/50 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {canGoBack && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-white/50 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Go Back?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to go back? Your progress on this step will be saved.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleGoBack}>Go Back</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Step {currentStepIndex + 1} of {onboardingSteps.length}</p>
            <p className="text-xl font-semibold text-gray-800">{onboardingSteps[currentStepIndex]?.label}</p>
          </div>
        </div>

        {/* Enhanced Progress Bar with Diagonal Stripes */}
        <div className="relative">
          {/* Background Track */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${overallProgress}%` }}
            >
              {/* Diagonal Stripes */}
              <div className="absolute inset-0 opacity-20">
                <div className="h-full w-full" style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 4px,
                    rgba(255,255,255,0.3) 4px,
                    rgba(255,255,255,0.3) 8px
                  )`
                }}></div>
              </div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {onboardingSteps.map((step, index) => {
              const isCompleted = index < currentStepIndex
              const isCurrent = index === currentStepIndex
              const isUpcoming = index > currentStepIndex

              return (
                <div key={step.id} className="flex flex-col items-center space-y-3">
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 shadow-lg ${
                    isCompleted 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-500 text-white' 
                      : isCurrent 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 text-white ring-4 ring-green-100' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <span className="text-lg font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="text-center max-w-24">
                    <p className={`text-sm font-semibold transition-colors duration-300 ${
                      isCompleted 
                        ? 'text-blue-600' 
                        : isCurrent 
                          ? 'text-green-600' 
                          : 'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500 hidden lg:block mt-1 leading-tight">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function OnboardingFooter() {
  const { currentStep, stepProgress } = useLanding()

  const currentStepIndex = onboardingSteps.findIndex(step => step.id === currentStep)
  const overallProgress = ((currentStepIndex + 1) / onboardingSteps.length) * 100

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 px-4 py-3 shadow-lg">
      <div className="max-w-4xl mx-auto">
        {/* Compact Progress Bar with Diagonal Stripes */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">Progress</span>
          <span className="text-xs text-gray-500">{Math.round(overallProgress)}% complete</span>
        </div>
        
        <div className="relative mb-3">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${overallProgress}%` }}
            >
              {/* Diagonal Stripes */}
              <div className="absolute inset-0 opacity-20">
                <div className="h-full w-full" style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 2px,
                    rgba(255,255,255,0.3) 2px,
                    rgba(255,255,255,0.3) 4px
                  )`
                }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Compact Step Indicators */}
        <div className="flex items-center justify-center space-x-4">
          {onboardingSteps.map((step, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex

            return (
              <div key={step.id} className="flex flex-col items-center space-y-1">
                <div className={`flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-300 shadow-sm ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-500 text-white' 
                    : isCurrent 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-2.5 w-2.5" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  isCompleted 
                    ? 'text-blue-600' 
                    : isCurrent 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 