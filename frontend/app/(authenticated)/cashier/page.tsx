"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { POSSidebar } from "./components/pos-sidebar"
import { POSMainInterface } from "./components/pos-main-interface"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function POSSystem() {
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [currentCustomer, setCurrentCustomer] = React.useState<Customer | null>(null)
  const [paymentMethod, setPaymentMethod] = React.useState<"cash" | "card">("cash")
  const [activeTab, setActiveTab] = React.useState("new-sale")

  // Create a new QueryClient instance
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <POSSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <SidebarInset>
          <POSMainInterface
            cart={cart}
            setCart={setCart}
            currentCustomer={currentCustomer}
            setCurrentCustomer={setCurrentCustomer}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  )
}

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  barcode: string
  category: string
  discount?: number
  taxRate: number
}

export type Customer = {
  id: string
  name: string
  email?: string
  phone?: string
  loyaltyPoints?: number
  membershipLevel?: "bronze" | "silver" | "gold"
}

export type Transaction = {
  id: string
  date: string
  time: string
  items: CartItem[]
  customer?: Customer
  total: number
  paymentMethod: "cash" | "card"
  cashier: string
  status: "completed" | "refunded" | "voided"
}
