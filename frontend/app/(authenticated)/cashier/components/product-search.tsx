"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, Package } from "lucide-react"
import { searchProducts, productKeys } from "@/lib/api/products"
import type { CartItem } from "../page"

interface ProductSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToCart: (product: Omit<CartItem, "quantity">) => void
}

export function ProductSearch({ open, onOpenChange, onAddToCart }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = React.useState("")

  // Use React Query for product search
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: productKeys.search(searchTerm),
    queryFn: () => searchProducts(searchTerm),
    enabled: searchTerm.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const handleAddToCart = (product: any) => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      barcode: product.barcode,
      category: product.category,
      taxRate: product.taxRate,
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Rice": "bg-green-100 text-green-800",
      "Oils": "bg-yellow-100 text-yellow-800",
      "Sugar": "bg-blue-100 text-blue-800",
      "Flour": "bg-orange-100 text-orange-800",
      "Spices": "bg-red-100 text-red-800",
      "Beverages": "bg-purple-100 text-purple-800",
      "General": "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors["General"]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Product Search
          </DialogTitle>
          <DialogDescription>
            Search for products by name, barcode, or category
          </DialogDescription>
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

          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-600">
              Error occurred while searching for products
            </div>
          )}

          {!isLoading && !error && searchTerm.length > 0 && products.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found matching your search
            </div>
          )}

          {!isLoading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{product.name}</h3>
                            <p className="text-lg font-bold text-primary mt-1">
                              EGP {product.price.toFixed(2)}
                            </p>
                            {product.stock !== undefined && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Stock: {product.stock}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className={getCategoryColor(product.category)}>
                            {product.category}
                          </Badge>
                                                     <Button
                             size="sm"
                             onClick={() => handleAddToCart(product)}
                             className="flex-shrink-0"
                           >
                             <Plus className="h-4 w-4 mr-1" />
                             Add
                           </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && !error && searchTerm.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Start typing to search for products
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
