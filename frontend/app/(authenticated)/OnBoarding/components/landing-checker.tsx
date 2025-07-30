"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Building2, CheckCircle, Loader2 } from "lucide-react"
import { useLanding } from "./landing-provider"

export function LandingChecker() {
  const { stepProgress, isLoading } = useLanding()
  const progress = stepProgress.checking

  const steps = [
    { id: 1, label: "Verifying account status", completed: progress >= 25 },
    { id: 2, label: "Checking subscription", completed: progress >= 50 },
    { id: 3, label: "Loading your preferences", completed: progress >= 75 },
    { id: 4, label: "Preparing dashboard", completed: progress >= 100 },
  ]

  return (
    <div className="h-full flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-sm shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 text-center space-y-5">
          <div className="flex justify-center">
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <Building2 className="size-5" />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-lg font-bold text-gray-800">SuperMarket Pro</h1>
            <p className="text-xs text-gray-600">Setting up your account...</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <Progress value={progress} className="h-1.5" />
            <p className="text-xs text-muted-foreground">{progress}% complete</p>
          </div>

          {/* Loading Steps */}
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      {isLoading && step.id === Math.ceil(progress / 25) && (
                        <Loader2 className="h-2.5 w-2.5 text-blue-500 animate-spin" />
                      )}
                    </div>
                  )}
                </div>
                <span className={`text-xs ${step.completed ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Skeleton Loader for Content */}
          {isLoading && (
            <div className="space-y-3 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-2.5 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-2.5 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p>Please wait while we verify your information</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
