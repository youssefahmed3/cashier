"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DollarSign, CreditCard, Smartphone, CheckCircle } from "lucide-react"
import type { CartItem, Customer } from "../page"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: CartItem[]
  total: number
  paymentMethod: "cash" | "card"
  customer: Customer | null
  onPaymentComplete: () => void
}

export function PaymentDialog({
  open,
  onOpenChange,
  cart,
  total,
  paymentMethod,
  customer,
  onPaymentComplete,
}: PaymentDialogProps) {
  const [cashReceived, setCashReceived] = React.useState("")
  const [tipAmount, setTipAmount] = React.useState(0)
  const [processing, setProcessing] = React.useState(false)
  const [paymentComplete, setPaymentComplete] = React.useState(false)

  const totalWithTip = total + tipAmount
  const change = cashReceived ? Math.max(0, Number.parseFloat(cashReceived) - totalWithTip) : 0

  const handlePayment = async () => {
    setProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setProcessing(false)
    setPaymentComplete(true)

    // Auto-close after showing success
    setTimeout(() => {
      setPaymentComplete(false)
      setCashReceived("")
      onPaymentComplete()
    }, 2000)
  }

  const renderPaymentMethod = () => {
    if (paymentComplete) {
      return (
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h3>
          <p className="text-muted-foreground">Processing receipt...</p>
        </div>
      )
    }

    switch (paymentMethod) {
      case "cash":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cash Payment</h3>
              <p className="text-muted-foreground">Enter the amount received from customer</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cash-received" className="text-sm font-medium">Cash Received</Label>
                <Input
                  id="cash-received"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="text-2xl text-center font-bold h-12"
                />
              </div>

              {/* Tip Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Add Tip for Cashier</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((tip) => (
                    <Button
                      key={tip}
                      variant={tipAmount === tip ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTipAmount(tipAmount === tip ? 0 : tip)}
                      className="h-10"
                    >
                      EGP {tip}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Change Buttons */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Change</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 20, 50, 100, 200].map((change) => (
                    <Button 
                      key={change} 
                      variant="outline" 
                      onClick={() => setCashReceived((totalWithTip + change).toFixed(2))}
                      className="h-10"
                    >
                      EGP {change} Change
                    </Button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setCashReceived(totalWithTip.toFixed(2))}
                  className="w-full h-10"
                >
                  Exact Amount (No Change)
                </Button>
              </div>

              {cashReceived && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Subtotal:</span>
                        <span className="text-sm">EGP {total.toFixed(2)}</span>
                      </div>
                      {tipAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm">Tip:</span>
                          <span className="text-sm text-green-600 font-medium">EGP {tipAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium">
                        <span>Total with Tip:</span>
                        <span>EGP {totalWithTip.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cash Received:</span>
                        <span className="text-sm">EGP {Number.parseFloat(cashReceived).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Change:</span>
                        <span className={change < 0 ? "text-red-600" : "text-green-600"}>
                          EGP {change.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )

      case "card":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Card Payment</h3>
              <p className="text-muted-foreground">
                {processing ? "Processing payment..." : "Insert, tap, or swipe card"}
              </p>
            </div>

            {/* Tip Section for Card Payment */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Add Tip for Cashier</Label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((tip) => (
                  <Button
                    key={tip}
                    variant={tipAmount === tip ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTipAmount(tipAmount === tip ? 0 : tip)}
                    className="h-10"
                  >
                    EGP {tip}
                  </Button>
                ))}
              </div>
            </div>

            {tipAmount > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Subtotal:</span>
                      <span className="text-sm">EGP {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tip:</span>
                      <span className="text-sm text-blue-600 font-medium">EGP {tipAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total with Tip:</span>
                      <span>EGP {totalWithTip.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {processing && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        )


    }
  }

  const canProcessPayment = () => {
    if (paymentMethod === "cash") {
      return cashReceived && Number.parseFloat(cashReceived) >= totalWithTip
    }
    return true
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>Complete the transaction for EGP {totalWithTip.toFixed(2)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          {customer && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Customer</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm">
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-muted-foreground">{customer.loyaltyPoints} points available</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          {renderPaymentMethod()}

          {/* Action Buttons */}
          {!paymentComplete && (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={processing}>
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={!canProcessPayment() || processing} className="flex-1">
                {processing ? "Processing..." : "Complete Payment"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
