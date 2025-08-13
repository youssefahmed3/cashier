"use client"

import * as React from "react"
import { useLanding } from "./landing-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Building2, ArrowLeft, ArrowRight, Lock, Shield, CheckCircle, Calendar, User } from "lucide-react"
import { subscribeTenant } from "@/lib/api/tenant"
import { toast } from "sonner"

const subscriptionPlans = {
  basic: { name: "Basic", price: "1,500 EGP", period: "per month" },
  professional: { name: "Professional", price: "3,000 EGP", period: "per month" },
  enterprise: { name: "Enterprise", price: "7,500 EGP", period: "per month" },
}

export function PaymentSelection() {
  const {
    selectedPlan,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    setCurrentStep,
    paymentData,
    setPaymentData,
    setHasSubscription,
    tenantId,
  } = useLanding()

  const [isProcessing, setIsProcessing] = React.useState(false)

  const currentPlan = selectedPlan ? subscriptionPlans[selectedPlan as keyof typeof subscriptionPlans] : null

  const handleBack = () => {
    setCurrentStep("subscription")
  }

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method)
  }

  const handleInputChange = (field: string, value: string) => {
    setPaymentData({ ...paymentData, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPaymentMethod) return

    setIsProcessing(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) throw new Error("Not authenticated")

      // Best-effort mapping: use selectedPlan string as numeric id if possible
      const planId = selectedPlan && !isNaN(Number(selectedPlan)) ? Number(selectedPlan) : undefined
      // Use tenant id from provider
      const result = await subscribeTenant(tenantId || "", token, planId)
      if (result?.is_active || result?.isActive || result?.status === "ACTIVE") {
        setHasSubscription(true)
        setCurrentStep("setup")
      } else {
        toast.error("Subscription not activated. Please try again.")
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to process subscription")
    } finally {
      setIsProcessing(false)
    }
  }

  const paymentMethods = [
    {
      id: "credit-card",
      name: "Credit/Debit Card",
      description: "Pay securely with your credit or debit card",
      icon: CreditCard,
      popular: true,
    },
    {
      id: "bank-transfer",
      name: "Bank Transfer",
      description: "Direct bank transfer (ACH)",
      icon: Building2,
      popular: false,
    },
  ]

  return (
    <div className="h-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-y-auto">
      <div className="w-full max-w-4xl">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <Building2 className="size-5" />
            </div>
          </div>
          <h1 className="text-lg font-bold mb-1 text-gray-800">
            Complete Your Payment
          </h1>
          <p className="text-xs text-gray-600 max-w-lg mx-auto">
            Secure payment processing powered by industry-leading encryption.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Payment Form */}
          <div className="space-y-4">
            {/* Payment Method Selection */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-800 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                  Payment Method
                </CardTitle>
                <CardDescription className="text-xs text-gray-600">
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  const isSelected = selectedPaymentMethod === method.id

                  return (
                    <div
                      key={method.id}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-800">{method.name}</h3>
                            {method.popular && (
                              <Badge className="text-xs bg-blue-100 text-blue-700">Popular</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{method.description}</p>
                        </div>
                        {isSelected && <CheckCircle className="w-4 h-4 text-blue-600" />}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Payment Details Form */}
            {selectedPaymentMethod === "credit-card" && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-gray-800 flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-green-600" />
                    Card Details
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-600">
                    Your payment information is encrypted and secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-xs font-medium text-gray-700">
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate" className="text-xs font-medium text-gray-700">
                        Expiry Date
                      </Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-xs font-medium text-gray-700">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardholderName" className="text-xs font-medium text-gray-700">
                      Cardholder Name
                    </Label>
                    <Input
                      id="cardholderName"
                      type="text"
                      placeholder="John Doe"
                      value={paymentData.cardholderName}
                      onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing Address */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-800 flex items-center">
                  <User className="w-4 h-4 mr-2 text-purple-600" />
                  Billing Address
                </CardTitle>
                <CardDescription className="text-xs text-gray-600">
                  Address for billing purposes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billingAddress" className="text-xs font-medium text-gray-700">
                    Street Address
                  </Label>
                  <Input
                    id="billingAddress"
                    type="text"
                    placeholder="123 Main Street"
                    value={paymentData.billingAddress}
                    onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs font-medium text-gray-700">
                      City
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="New York"
                      value={paymentData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-xs font-medium text-gray-700">
                      State
                    </Label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="NY"
                      value={paymentData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-xs font-medium text-gray-700">
                      ZIP Code
                    </Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="10001"
                      value={paymentData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-xs font-medium text-gray-700">
                      Country
                    </Label>
                    <Select value={paymentData.country} onValueChange={(value) => handleInputChange("country", value)}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-800 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                  Order Summary
                </CardTitle>
                <CardDescription className="text-xs text-gray-600">
                  Review your subscription details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentPlan && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">{currentPlan.name} Plan</h3>
                        <p className="text-xs text-gray-600">Monthly subscription</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">{currentPlan.price}</p>
                        <p className="text-xs text-gray-600">{currentPlan.period}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{currentPlan.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">0.00 EGP</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Setup Fee</span>
                        <span className="font-medium">0.00 EGP</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-800">Total</span>
                      <span className="text-xl font-bold text-blue-600">{currentPlan.price}</span>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-blue-800">Secure Payment</p>
                          <p className="text-xs text-blue-600 mt-1">
                            Your payment is protected by bank-level security and encryption.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-10 text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedPaymentMethod || isProcessing}
                className="flex-1 h-10 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
