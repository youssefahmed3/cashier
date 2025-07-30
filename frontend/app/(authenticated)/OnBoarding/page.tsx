"use client"
import { LandingProvider, useLanding } from "./components/landing-provider"
import { LandingFlow } from "./components/landing-flow"

function OnboardingContent() {
  const { currentStep } = useLanding()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <LandingFlow />
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <LandingProvider>
      <OnboardingContent />
    </LandingProvider>
  )
}
