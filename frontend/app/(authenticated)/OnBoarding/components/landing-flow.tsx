"use client"
import { useLanding } from "./landing-provider"
import { LandingChecker } from "./landing-checker"
import { SubscriptionSelection } from "./subscription-selection"
import { PaymentSelection } from "./payment-selection"
import { CompanySetup } from "./company_setup"
import { LandingComplete } from "./landing-complete"

export function LandingFlow() {
  const { currentStep } = useLanding()

  switch (currentStep) {
    case "checking":
      return <LandingChecker />
    case "subscription":
      return <SubscriptionSelection />
    case "payment":
      return <PaymentSelection />
    case "setup":
      return <CompanySetup />
    case "complete":
      return <LandingComplete />
    default:
      return <LandingChecker />
  }
}
