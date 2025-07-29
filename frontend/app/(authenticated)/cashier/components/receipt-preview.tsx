"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Printer, Mail, MessageSquare } from "lucide-react"
import type { CartItem, Customer } from "../page"

interface ReceiptPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: CartItem[]
  total: number
  customer: Customer | null
  onComplete: () => void
}

export function ReceiptPreview({ open, onOpenChange, cart, total, customer, onComplete }: ReceiptPreviewProps) {
  const transactionId = `TXN${Date.now().toString().slice(-6)}`
  const currentDate = new Date().toLocaleString()

  const subtotal = cart.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity
    const discountAmount = item.discount ? (itemTotal * item.discount) / 100 : 0
    return sum + (itemTotal - discountAmount)
  }, 0)

  const totalTax = cart.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity
    const discountAmount = item.discount ? (itemTotal * item.discount) / 100 : 0
    const taxableAmount = itemTotal - discountAmount
    return sum + taxableAmount * item.taxRate
  }, 0)

  const handlePrint = () => {
    window.print()
  }

  const handleEmail = () => {
    // In a real app, this would send the receipt via email
    console.log("Sending receipt via email to:", customer?.email)
    onComplete()
  }

  const handleSMS = () => {
    // In a real app, this would send the receipt via SMS
    console.log("Sending receipt via SMS to:", customer?.phone)
    onComplete()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Receipt Preview</DialogTitle>
          <DialogDescription>Review and send the receipt to the customer</DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="p-6 font-mono text-sm">
            {/* Store Header */}
            <div className="text-center mb-4">
              <div className="font-bold text-lg">SuperMarket Pro</div>
              <div>Downtown Branch</div>
              <div>123 Main St, Downtown</div>
              <div>Phone: (555) 123-4567</div>
            </div>

            <Separator className="my-4" />

            {/* Transaction Info */}
            <div className="mb-4">
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span>{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{currentDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier:</span>
                <span>Jane Doe</span>
              </div>
            </div>

            {/* Customer Info */}
            {customer && (
              <>
                <Separator className="my-4" />
                <div className="mb-4">
                  <div className="font-bold">Customer:</div>
                  <div>{customer.name}</div>
                  {customer.email && <div>{customer.email}</div>}
                  {customer.phone && <div>{customer.phone}</div>}
                  {customer.loyaltyPoints && <div>Loyalty Points: {customer.loyaltyPoints}</div>}
                </div>
              </>
            )}

            <Separator className="my-4" />

            {/* Items */}
            <div className="mb-4">
              {cart.map((item) => {
                const itemTotal = item.price * item.quantity
                const discountAmount = item.discount ? (itemTotal * item.discount) / 100 : 0
                const finalPrice = itemTotal - discountAmount

                return (
                  <div key={item.id} className="mb-2">
                    <div className="flex justify-between">
                      <span className="flex-1">{item.name}</span>
                      <span>${finalPrice.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-2">
                      {item.quantity} x ${item.price.toFixed(2)}
                      {item.discount && ` (${item.discount}% off)`}
                    </div>
                  </div>
                )
              })}
            </div>

            <Separator className="my-4" />

            {/* Totals */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${totalTax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-base">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Footer */}
            <div className="text-center text-xs">
              <div>Thank you for shopping with us!</div>
              <div>Return policy: 30 days with receipt</div>
              <div>Customer Service: (555) 123-4567</div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button onClick={handleEmail} variant="outline" disabled={!customer?.email}>
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button onClick={handleSMS} variant="outline" disabled={!customer?.phone}>
              <MessageSquare className="mr-2 h-4 w-4" />
              SMS
            </Button>
          </div>
          <Button onClick={onComplete} className="w-full">
            Complete Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
