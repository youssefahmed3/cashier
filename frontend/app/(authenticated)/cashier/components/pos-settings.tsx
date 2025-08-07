"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Clock, Calculator, Save, Building2 } from "lucide-react"

export function POSSettings() {
  const [taxRate, setTaxRate] = React.useState("14")
  const [cashierName, setCashierName] = React.useState("Ahmed Hassan")
  const [shiftEndTime, setShiftEndTime] = React.useState("16:00")

  const handleSaveSettings = () => {
    // TODO: Implement save functionality
    console.log("Settings saved:", { taxRate, cashierName, shiftEndTime })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-primary rounded-xl shadow-lg">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                POS Settings
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Configure your point of sale system preferences
              </p>
            </div>
          </div>
          <Separator className="my-6" />
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cashier Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Cashier Information
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Current cashier details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cashier-name" className="text-sm font-medium text-gray-700">
                  Cashier Name
                </Label>
                <Input 
                  id="cashier-name" 
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  placeholder="Enter cashier name"
                  className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Building2 className="h-4 w-4" />
                <span>Register #001</span>
              </div>
            </CardContent>
          </Card>

          {/* Shift Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Shift Information
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Current shift details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shift-end" className="text-sm font-medium text-gray-700">
                  Shift End Time
                </Label>
                <Input 
                  id="shift-end" 
                  type="time"
                  value={shiftEndTime}
                  onChange={(e) => setShiftEndTime(e.target.value)}
                  className="h-12 text-base border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Shift ends at: {shiftEndTime}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tax Settings - Full Width */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calculator className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Tax & Currency Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure tax rates and currency preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tax-rate" className="text-sm font-medium text-gray-700">
                  Tax Rate (%)
                </Label>
                <Input
                  id="tax-rate"
                  type="number"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="14"
                  className="h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Currency
                </Label>
                <div className="h-12 flex items-center px-3 bg-gray-50 border border-gray-200 rounded-md">
                  <span className="text-base font-medium text-gray-900">
                    Egyptian Pound (EGP)
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calculator className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  Default tax rate: {taxRate}% applied to all transactions
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" size="lg" className="px-8 h-12">
            Reset to Default
          </Button>
          <Button 
            size="lg" 
            className="px-8 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            onClick={handleSaveSettings}
          >
            <Save className="h-5 w-5 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
