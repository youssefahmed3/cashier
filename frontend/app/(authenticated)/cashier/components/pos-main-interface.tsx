"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Scan, Plus, Minus, Trash2, User, CreditCard, DollarSign, Receipt, ShoppingCart, Package } from "lucide-react"
import { ProductSearch } from "./product-search"
import { CustomerLookup } from "./customer-lookup"
import { PaymentDialog } from "./payment-dialog"
import { ReceiptPreview } from "./receipt-preview"
import { TransactionHistory } from "./transaction-history"
import { POSCalculator } from "./pos-calculator"
import { POSSettings } from "./pos-settings"
import { BulkEntry } from "./bulk-entry"
import type { CartItem, Customer } from "../page"

interface POSMainInterfaceProps {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  currentCustomer: Customer | null
  setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer | null>>
  paymentMethod: "cash" | "card"
  setPaymentMethod: React.Dispatch<React.SetStateAction<"cash" | "card">>
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

// Sample quick access products
const quickProducts = [
  { id: "QP001", name: "Plastic Bag", price: 0.5, barcode: "BAG001", category: "Accessories", taxRate: 0.14 },
  { id: "QP002", name: "Gift Card 100 EGP", price: 100.0, barcode: "GC100", category: "Gift Cards", taxRate: 0 },
  { id: "QP003", name: "Bottle Deposit", price: 0.25, barcode: "DEP001", category: "Deposits", taxRate: 0 },
  { id: "QP004", name: "Reusable Bag", price: 5.0, barcode: "RBAG001", category: "Accessories", taxRate: 0.14 },
]

export function POSMainInterface({
  cart,
  setCart,
  currentCustomer,
  setCurrentCustomer,
  paymentMethod,
  setPaymentMethod,
  activeTab,
  setActiveTab,
}: POSMainInterfaceProps) {
  const [barcodeInput, setBarcodeInput] = React.useState("")
  const [showProductSearch, setShowProductSearch] = React.useState(false)
  const [showCustomerLookup, setShowCustomerLookup] = React.useState(false)
  const [showPayment, setShowPayment] = React.useState(false)
  const [showReceipt, setShowReceipt] = React.useState(false)
  const [showBulkEntry, setShowBulkEntry] = React.useState(false)

  // Calculate totals
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

  const total = subtotal + totalTax

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Rice": "bg-green-100 text-green-800",
      "Oils": "bg-yellow-100 text-yellow-800",
      "Sugar": "bg-blue-100 text-blue-800",
      "Flour": "bg-orange-100 text-orange-800",
      "Spices": "bg-red-100 text-red-800",
      "Beverages": "bg-purple-100 text-purple-800",
      "Accessories": "bg-indigo-100 text-indigo-800",
      "Gift Cards": "bg-pink-100 text-pink-800",
      "Deposits": "bg-teal-100 text-teal-800",
      "General": "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors["General"]
  }

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const addBulkToCart = (items: CartItem[]) => {
    setCart((prevCart) => {
      const newCart = [...prevCart]
      items.forEach((item) => {
        const existingItem = newCart.find((cartItem) => cartItem.id === item.id)
        if (existingItem) {
          existingItem.quantity += item.quantity
        } else {
          newCart.push(item)
        }
      })
      return newCart
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
    setCurrentCustomer(null)
  }

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (barcodeInput.trim()) {
      // In a real app, you'd look up the product by barcode
      console.log("Looking up barcode:", barcodeInput)
      setBarcodeInput("")
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "customer-lookup":
        return (
          <CustomerLookup
            open={true}
            onOpenChange={() => setActiveTab("new-sale")}
            onSelectCustomer={setCurrentCustomer}
          />
        )
      case "history":
        return <TransactionHistory />
      case "calculator":
        return <POSCalculator />
      case "settings":
        return <POSSettings />
      case "payment":
        if (cart.length === 0) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Items in Cart</h3>
                <p className="text-muted-foreground mb-4">Add items to cart before processing payment</p>
                <Button onClick={() => setActiveTab("new-sale")}>Return to New Sale</Button>
              </div>
            </div>
          )
        }
        return (
          <PaymentDialog
            open={true}
            onOpenChange={() => setActiveTab("new-sale")}
            cart={cart}
            total={total}
            paymentMethod={paymentMethod}
            customer={currentCustomer}
            onPaymentComplete={() => {
              setActiveTab("new-sale")
              setShowReceipt(true)
            }}
          />
        )
      default:
        return renderNewSaleInterface()
    }
  }

  const renderNewSaleInterface = () => (
    <div className="flex h-screen bg-background flex-col lg:flex-row">
      {/* Left Panel - Product Search & Quick Actions */}
      <div className="w-full lg:w-1/3 p-4 border-r">
        <div className="space-y-4">
          {/* Barcode Scanner */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Scan className="mr-2 h-5 w-5" />
                Barcode Scanner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBarcodeSubmit} className="flex space-x-2">
                <Input
                  placeholder="Scan or enter barcode..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Product Search */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Product Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={() => setShowProductSearch(true)} className="w-full" variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Products
              </Button>
              <Button onClick={() => setShowBulkEntry(true)} className="w-full" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Bulk Entry
              </Button>
            </CardContent>
          </Card>

          {/* Quick Access Products */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {quickProducts.map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="h-16 text-xs flex flex-col bg-transparent"
                    onClick={() => addToCart(product)}
                  >
                    <span className="font-medium">{product.name}</span>
                    <span className="text-muted-foreground">ج.م {product.price.toFixed(2)}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentCustomer ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{currentCustomer.name}</span>
                    <Badge variant="secondary">{currentCustomer.membershipLevel}</Badge>
                  </div>
                  {currentCustomer.loyaltyPoints && (
                    <div className="text-sm text-muted-foreground">Points: {currentCustomer.loyaltyPoints}</div>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setCurrentCustomer(null)}>
                    Remove Customer
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setActiveTab("customer-lookup")} className="w-full" variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Panel - Cart & Checkout */}
      <div className="flex-1 p-4 w-full lg:w-2/3">
        <div className="h-full flex flex-col">
          {/* Cart Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <ShoppingCart className="mr-2 h-6 w-6" />
              Shopping Cart ({cart.length} items)
            </h2>
            <Button variant="outline" onClick={clearCart} disabled={cart.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </div>

          {/* Cart Items */}
          <Card className="flex-1 mb-4">
            <CardContent className="p-0">
              {cart.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Cart is empty</p>
                    <p className="text-sm">Scan barcode or search for products to add them</p>
                  </div>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center space-x-3 flex-1">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <div className="font-medium truncate">{item.name}</div>
                            <Badge variant="secondary" className={getCategoryColor(item.category)}>
                              {item.category}
                            </Badge>
                          </div>
                                                      <div className="text-sm text-muted-foreground">
                              EGP {item.price.toFixed(2)} each
                            {item.discount && (
                              <Badge variant="secondary" className="ml-2">
                                {item.discount}% off
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <div className="w-20 text-right font-medium">
                          EGP {(item.price * item.quantity * (1 - (item.discount || 0) / 100)).toFixed(2)}
                        </div>
                        <Button size="icon" variant="outline" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Totals */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>EGP {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>EGP {totalTax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>EGP {total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              size="lg"
              className="h-16"
              disabled={cart.length === 0}
              onClick={() => {
                setPaymentMethod("cash")
                setActiveTab("payment")
              }}
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Cash
            </Button>
            <Button
              size="lg"
              className="h-16"
              disabled={cart.length === 0}
              onClick={() => {
                setPaymentMethod("card")
                setActiveTab("payment")
              }}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen">
      {renderTabContent()}

      {/* Dialogs */}
      <ProductSearch open={showProductSearch} onOpenChange={setShowProductSearch} onAddToCart={addToCart} />

      <BulkEntry open={showBulkEntry} onOpenChange={setShowBulkEntry} onAddToCart={addBulkToCart} />

      <ReceiptPreview
        open={showReceipt}
        onOpenChange={setShowReceipt}
        cart={cart}
        total={total}
        customer={currentCustomer}
        onComplete={() => {
          setShowReceipt(false)
          clearCart()
        }}
      />
    </div>
  )
}
