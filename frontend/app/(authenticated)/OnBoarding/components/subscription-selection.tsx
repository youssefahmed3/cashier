"use client"
import { useState } from "react"
import { useLanding } from "./landing-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Store, Zap, Crown, ArrowRight, Building2, Star } from "lucide-react"

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "1,500",
    period: "per month",
    description: "Perfect for small supermarkets getting started",
    icon: Store,
    features: [
      "Up to 2 store locations",
      "Basic inventory management",
      "Point of sale system",
      "Basic reporting",
      "Email support",
      "5GB storage",
      "Standard security",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: "3,000",
    period: "per month",
    description: "Ideal for growing supermarket chains",
    icon: Zap,
    features: [
      "Up to 10 store locations",
      "Advanced inventory management",
      "Multi-location POS system",
      "Advanced analytics & reporting",
      "Priority email & phone support",
      "50GB storage",
      "Enhanced security features",
      "Staff management tools",
      "Customer loyalty programs",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "7,500",
    period: "per month",
    description: "For large supermarket enterprises",
    icon: Crown,
    features: [
      "Unlimited store locations",
      "Enterprise inventory management",
      "Advanced POS with integrations",
      "Custom reporting & analytics",
      "24/7 dedicated support",
      "Unlimited storage",
      "Enterprise-grade security",
      "Advanced staff management",
      "Custom integrations",
      "API access",
      "White-label options",
    ],
    popular: false,
  },
]

export function SubscriptionSelection() {
  const { selectedPlan, setSelectedPlan, setCurrentStep } = useLanding()
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleContinue = async () => {
    if (!selectedPlan) return
    setCurrentStep("payment")
  }

  return (
    <div className="h-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-y-auto">
      <div className="w-full max-w-5xl">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <Building2 className="size-5" />
            </div>
          </div>
          <h1 className="text-lg font-bold mb-1 text-gray-800">
            Choose Your Plan
          </h1>
          <p className="text-xs text-gray-600 max-w-lg mx-auto">
            Select the perfect plan for your supermarket business needs.
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="grid lg:grid-cols-3 gap-4">
          {subscriptionPlans.map((plan) => {
            const Icon = plan.icon
            const isSelected = selectedPlan === plan.id
            const isHovered = hoveredPlan === plan.id

            return (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all duration-300 transform flex flex-col h-full ${
                  isSelected
                    ? "ring-2 ring-blue-500 shadow-xl scale-105 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                    : isHovered
                      ? "shadow-lg scale-102 bg-white"
                      : "shadow-md hover:shadow-lg bg-white"
                } ${plan.popular ? "border-2 border-blue-500" : "border border-gray-200"}`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 text-xs font-semibold shadow-md">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-3 pt-6">
                  <div className="flex justify-center mb-3">
                    <div
                      className={`p-3 rounded-lg shadow-md transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white scale-110"
                          : plan.popular
                            ? "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600"
                            : "bg-gradient-to-br from-gray-100 to-slate-100 text-gray-600"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold mb-1 text-gray-800">{plan.name}</CardTitle>
                  <CardDescription className="text-xs mb-3 text-gray-600 leading-relaxed">{plan.description}</CardDescription>
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-gray-800">{plan.price}</span>
                    <span className="text-gray-500 ml-1 text-sm">EGP</span>
                    <span className="text-gray-500 ml-1 text-sm">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 px-4 pb-4 flex flex-col h-full">
                  <ul className="space-y-2 mb-4 flex-grow">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 mr-2 mt-0.5">
                          <Check className="w-3 h-3 text-green-500" />
                        </div>
                        <span className="text-xs leading-relaxed text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full h-10 text-sm font-semibold transition-all duration-300 rounded-lg hover:transform hover:scale-105 ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transform scale-105"
                        : plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md"
                    }`}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {isSelected ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>Selected</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Select Plan</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center mt-6">
          <Button
            onClick={handleContinue}
            disabled={!selectedPlan}
            className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue with {selectedPlan ? subscriptionPlans.find(p => p.id === selectedPlan)?.name : 'Plan'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
