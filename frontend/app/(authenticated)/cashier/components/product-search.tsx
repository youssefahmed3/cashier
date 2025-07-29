"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import type { CartItem } from "../page"

interface ProductSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToCart: (product: Omit<CartItem, "quantity">) => void
}

// Sample products data
const products = [
  {
    id: "PRD001",
    name: "Organic Bananas",
    price: 2.99,
    barcode: "1234567890123",
    category: "Fruits",
    taxRate: 0.08,
    stock: 150,
  },
  {
    id: "PRD002",
    name: "Whole Milk 1L",
    price: 3.49,
    barcode: "2345678901234",
    category: "Dairy",
    taxRate: 0.08,
    stock: 25,
  },
  {
    id: "PRD003",
    name: "White Bread",
    price: 2.79,
    barcode: "4567890123456",
    category: "Bakery",
    taxRate: 0.08,
    stock: 45,
  },
  {
    id: "PRD004",
    name: "Ground Beef 1lb",
    price: 8.99,
    barcode: "3456789012345",
    category: "Meat",
    taxRate: 0.08,
    stock: 30,
  },
  {
    id: "PRD005",
    name: "Coca Cola 2L",
    price: 2.49,
    barcode: "5678901234567",
    category: "Beverages",
    taxRate: 0.08,
    stock: 60,
  },
]

export function ProductSearch({ open, onOpenChange, onAddToCart }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddToCart = (product: (typeof products)[0]) => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      barcode: product.barcode,
      category: product.category,
      taxRate: product.taxRate,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Product Search</DialogTitle>
          <DialogDescription>Search for products by name, barcode, or category</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No products found matching your search.</div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.barcode} • {product.category}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">${product.price.toFixed(2)}</Badge>
                      <Badge variant={product.stock > 10 ? "default" : "destructive"}>Stock: {product.stock}</Badge>
                    </div>
                  </div>
                  <Button onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
