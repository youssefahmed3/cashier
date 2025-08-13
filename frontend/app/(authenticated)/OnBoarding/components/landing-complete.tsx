"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanding } from "./landing-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Store, ArrowRight, Sparkles, AlertCircle, Mail, Clock, Phone } from "lucide-react"

const subscriptionPlans = {
  basic: { name: "Basic", price: "1,500 EGP" },
  professional: { name: "Professional", price: "3,000 EGP" },
  enterprise: { name: "Enterprise", price: "7,500 EGP" },
}

export function LandingComplete() {
  const { companyData, selectedPlan, selectedPaymentMethod } = useLanding()
  const [showGetStartedDialog, setShowGetStartedDialog] = useState(false)
  const router = useRouter()

  const currentPlan = selectedPlan ? subscriptionPlans[selectedPlan as keyof typeof subscriptionPlans] : null

  const handleGetStarted = () => {
    router.push("/tenant/dashboard")
  }

  const handleContactSupport = () => {
    window.open("mailto:support@supermarketpro.com", "_blank")
  }

  return (
    <>
      <div className="h-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-y-auto">
        <Card className="w-full max-w-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center space-y-5">
            <div className="flex justify-center">
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-lg font-bold text-green-600">Welcome Aboard!</h1>
              <p className="text-xs text-gray-600">Your SuperMarket Pro account setup is complete</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <Store className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-semibold">Account Summary</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-left">
                <div>
                  <p className="text-xs text-muted-foreground">Company Name</p>
                  <p className="text-sm font-medium">{companyData.name || "Your Supermarket"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Business Type</p>
                  <p className="text-sm font-medium capitalize">{companyData.businessType || "Supermarket"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Contact Email</p>
                  <p className="text-sm font-medium">{companyData.contactEmail || "admin@example.com"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Selected Plan</p>
                  <p className="text-sm font-medium">{currentPlan?.name || "Professional"}</p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Mail className="w-4 h-4 text-red-600" />
                <h2 className="text-sm font-semibold text-red-800">Important: Check Your Email</h2>
              </div>
              <p className="text-red-700 text-xs leading-relaxed">
                Please keep checking your email inbox (including spam/junk folders) for important updates about your
                account setup. Our team will contact you within <strong>24-48 hours</strong> with your login credentials
                and next steps.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">What's Next?</h3>
              <div className="grid gap-2 text-left">
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-xs">Account setup and verification by our team</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-xs">Email with login credentials and instructions</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-xs">Onboarding call to help you get started</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-xs">Access to your SuperMarket Pro dashboard</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Need Help?</h3>
              <div className="grid gap-2 text-left">
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-xs font-medium">Response Time</p>
                    <p className="text-xs text-gray-600">Within 24-48 hours</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-xs font-medium">Support Hotline</p>
                    <p className="text-xs text-gray-600">+201501711718</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleContactSupport}
                className="flex-1 h-9 text-xs"
              >
                <Mail className="w-3 h-3 mr-2" />
                Contact Support
              </Button>
              <Button
                onClick={handleGetStarted}
                className="flex-1 h-9 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Get Started
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Get Started Dialog */}
        <Dialog open={showGetStartedDialog} onOpenChange={setShowGetStartedDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Getting Started Guide</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-medium text-blue-800">Important Reminder</h3>
                </div>
                <p className="text-xs text-blue-700">
                  Please check your email for login credentials. Our team will contact you within 24-48 hours to help you get started.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Quick Start Checklist:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-xs">Check your email for login credentials</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-xs">Wait for onboarding call (24-48 hours)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-xs">Set up your store profile</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-xs">Configure your inventory</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
