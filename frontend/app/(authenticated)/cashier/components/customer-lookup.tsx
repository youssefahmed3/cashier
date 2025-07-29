"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, User, Plus } from "lucide-react"
import type { Customer } from "../page"

interface CustomerLookupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectCustomer: (customer: Customer) => void
}

// Sample customers data
const customers: Customer[] = [
  {
    id: "CUST001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    loyaltyPoints: 1250,
    membershipLevel: "gold",
  },
  {
    id: "CUST002",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 234-5678",
    loyaltyPoints: 850,
    membershipLevel: "silver",
  },
  {
    id: "CUST003",
    name: "Mike Wilson",
    email: "mike.wilson@email.com",
    phone: "+1 (555) 345-6789",
    loyaltyPoints: 320,
    membershipLevel: "bronze",
  },
  {
    id: "CUST004",
    name: "Lisa Brown",
    email: "lisa.brown@email.com",
    phone: "+1 (555) 456-7890",
    loyaltyPoints: 2100,
    membershipLevel: "gold",
  },
]

export function CustomerLookup({ open, onOpenChange, onSelectCustomer }: CustomerLookupProps) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm),
  )

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer)
    onOpenChange(false)
    setSearchTerm("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Customer Lookup</DialogTitle>
          <DialogDescription>Search for existing customers or add a new one</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex justify-end">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add New Customer
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No customers found matching your search.</div>
            ) : (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.email} • {customer.phone}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={
                            customer.membershipLevel === "gold"
                              ? "default"
                              : customer.membershipLevel === "silver"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {customer.membershipLevel}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{customer.loyaltyPoints} points</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => handleSelectCustomer(customer)}>Select</Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
