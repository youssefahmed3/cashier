"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Trash2, Package } from "lucide-react"
import type { CartItem } from "../page"

interface BulkEntryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToCart: (items: CartItem[]) => void
}

interface BulkItem {
  id: string
  name: string
  price: number
  quantity: number
  barcode: string
  category: string
  taxRate: number
}

export function BulkEntry({ open, onOpenChange, onAddToCart }: BulkEntryProps) {
  const [items, setItems] = React.useState<BulkItem[]>([])
  const [currentItem, setCurrentItem] = React.useState<Partial<BulkItem>>({})

  // Sample products for quick selection
  const sampleProducts = [
    { id: "PRD001", name: "Basmati Rice", price: 45.99, barcode: "1234567890123", category: "Rice", taxRate: 0.14 },
    { id: "PRD002", name: "Olive Oil", price: 89.99, barcode: "1234567890124", category: "Oils", taxRate: 0.14 },
    { id: "PRD003", name: "White Sugar", price: 12.99, barcode: "1234567890125", category: "Sugar", taxRate: 0.14 },
    { id: "PRD004", name: "Wheat Flour", price: 8.99, barcode: "1234567890126", category: "Flour", taxRate: 0.14 },
    { id: "PRD005", name: "Cooking Oil", price: 25.99, barcode: "1234567890127", category: "Oils", taxRate: 0.14 },
    { id: "PRD006", name: "Table Salt", price: 3.99, barcode: "1234567890128", category: "Spices", taxRate: 0.14 },
  ]

  const addItem = () => {
    if (currentItem.name && currentItem.price && currentItem.quantity) {
      const newItem: BulkItem = {
        id: currentItem.id || `BULK_${Date.now()}`,
        name: currentItem.name,
        price: currentItem.price,
        quantity: currentItem.quantity,
        barcode: currentItem.barcode || "",
        category: currentItem.category || "General",
        taxRate: currentItem.taxRate || 0.14,
      }
      setItems([...items, newItem])
      setCurrentItem({})
    }
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(items.map(item => item.id === id ? { ...item, quantity } : item))
  }

  const selectSampleProduct = (product: any) => {
    setCurrentItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      barcode: product.barcode,
      category: product.category,
      taxRate: product.taxRate,
    })
  }

  const handleAddToCart = () => {
    const cartItems: CartItem[] = items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      barcode: item.barcode,
      category: item.category,
      taxRate: item.taxRate,
    }))
    onAddToCart(cartItems)
    setItems([])
    onOpenChange(false)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Rice": "bg-green-100 text-green-800",
      "Oils": "bg-yellow-100 text-yellow-800",
      "Sugar": "bg-blue-100 text-blue-800",
      "Flour": "bg-orange-100 text-orange-800",
      "Spices": "bg-red-100 text-red-800",
      "General": "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors["General"]
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Bulk Product Entry
          </DialogTitle>
          <DialogDescription>
            Add multiple products at once with quantities
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Add Items */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="item-name">Product Name</Label>
                    <Input
                      id="item-name"
                      value={currentItem.name || ""}
                      onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-price">Price</Label>
                    <Input
                      id="item-price"
                      type="number"
                      step="0.01"
                      value={currentItem.price || ""}
                      onChange={(e) => setCurrentItem({ ...currentItem, price: Number(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="item-quantity">Quantity</Label>
                    <Input
                      id="item-quantity"
                      type="number"
                      min="1"
                      value={currentItem.quantity || ""}
                      onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-category">Category</Label>
                    <Input
                      id="item-category"
                      value={currentItem.category || ""}
                      onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                      placeholder="Category"
                    />
                  </div>
                </div>
                                 <Button onClick={addItem} className="w-full" disabled={!currentItem.name || !currentItem.price || !currentItem.quantity}>
                   <Plus className="mr-2 h-4 w-4" />
                   Add Product
                 </Button>
              </CardContent>
            </Card>

            {/* Quick Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {sampleProducts.map((product) => (
                    <Button
                      key={product.id}
                      variant="outline"
                      className="justify-start"
                      onClick={() => selectSampleProduct(product)}
                    >
                      <div className="flex-1 text-left">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">EGP {product.price.toFixed(2)}</div>
                      </div>
                      <Badge variant="secondary" className={getCategoryColor(product.category)}>
                        {product.category}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Selected Items */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Selected Products ({totalItems} items)</CardTitle>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                                     <div className="text-center py-8 text-muted-foreground">
                     No products selected
                   </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                                                     <div className="text-sm text-muted-foreground">
                             EGP {item.price.toFixed(2)} × {item.quantity} = EGP {(item.price * item.quantity).toFixed(2)}
                           </div>
                          <Badge variant="secondary" className={`mt-1 ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </Badge>
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
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {items.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                                         <div className="flex justify-between text-lg font-bold">
                       <span>Total Value:</span>
                       <span>EGP {totalValue.toFixed(2)}</span>
                     </div>
                     <Button onClick={handleAddToCart} className="w-full" size="lg">
                       Add All Products to Cart
                     </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 