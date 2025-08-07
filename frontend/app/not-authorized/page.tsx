"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, Home, Mail, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NotAuthorizedPage() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push("/")
  }

/*   const handleContactSupport = () => {
    // In a real app, this would open a support ticket or email
    window.location.href = "mailto:support@supermarketpro.com?subject=Access Request"
  }
 */
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg border-0">
        <CardContent className="p-8 text-center space-y-6">
          {/* Icon Section */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                <Shield className="w-10 h-10 text-red-600" />
              </div>
              <div className="absolute -top-1 -right-1">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
            <p className="text-lg text-muted-foreground">You don't have permission to access this page</p>
          </div>

          {/* Error Details */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-semibold text-red-800">Authorization Required</h2>
            </div>

            <div className="text-sm text-red-700 space-y-2">
              <p>
                <strong>This could be because:</strong>
              </p>
              <ul className="text-left space-y-1 list-disc list-inside">
                <li>Your account doesn't have the required permissions</li>
                <li>Your session may have expired</li>
                <li>You're trying to access a restricted area</li>
                <li>Your subscription plan doesn't include this feature</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleGoBack} variant="outline" className="flex items-center bg-transparent cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>

              <Button onClick={handleGoHome} className="flex items-center cursor-pointer">
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>

            <Button
              variant="ghost"
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>

          {/* Additional Help */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link href="/" className="text-blue-600 hover:underline">
                Visit help center
              </Link>{" "}
              or{" "}
              <Link href="/" className="text-blue-600 hover:underline">
                contact support
              </Link>
              .
            </p>
          </div>

          {/* Error Code */}
          <div className="text-xs text-muted-foreground">Error Code: 403</div>
        </CardContent>
      </Card>
    </div>
  )
}
