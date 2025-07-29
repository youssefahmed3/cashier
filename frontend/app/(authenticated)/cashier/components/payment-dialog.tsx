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
  paymentMethod: "cash" | "card" | "digital"
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
  const [processing, setProcessing] = React.useState(false)
  const [paymentComplete, setPaymentComplete] = React.useState(false)

  const change = cashReceived ? Math.max(0, Number.parseFloat(cashReceived) - total) : 0

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
          <div className="space-y-4">
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Cash Payment</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cash-received">Cash Received</Label>
                <Input
                  id="cash-received"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="text-lg text-center"
                />
              </div>

              {cashReceived && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cash Received:</span>
                        <span>${Number.parseFloat(cashReceived).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Change:</span>
                        <span className={change < 0 ? "text-red-600" : "text-green-600"}>${change.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 20, 50, 100].map((amount) => (
                  <Button key={amount} variant="outline" onClick={() => setCashReceived((total + amount).toFixed(2))}>
                    +${amount}
                  </Button>
                ))}
                <Button variant="outline" onClick={() => setCashReceived(total.toFixed(2))}>
                  Exact
                </Button>
              </div>
            </div>
          </div>
        )

      case "card":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Card Payment</h3>
              <p className="text-muted-foreground">
                {processing ? "Processing payment..." : "Insert, tap, or swipe card"}
              </p>
            </div>

            {processing && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        )

      case "digital":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Smartphone className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold mb-2">Digital Payment</h3>
              <p className="text-muted-foreground">
                {processing ? "Processing payment..." : "Scan QR code or tap device"}
              </p>
            </div>

            {processing && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            )}
          </div>
        )
    }
  }

  const canProcessPayment = () => {
    if (paymentMethod === "cash") {
      return cashReceived && Number.parseFloat(cashReceived) >= total
    }
    return true
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>Complete the transaction for ${total.toFixed(2)}</DialogDescription>
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
