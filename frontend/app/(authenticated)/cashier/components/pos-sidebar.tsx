"use client"

import type * as React from "react"
import { ShoppingCart, CreditCard, Users, History, Settings, Calculator } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface POSSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function POSSidebar({ activeTab, onTabChange, ...props }: POSSidebarProps) {
  const quickActions = [
    { id: "new-sale", label: "New Sale", icon: ShoppingCart },
    { id: "customer-lookup", label: "Customer Lookup", icon: Users },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "history", label: "Transaction History", icon: History },
    { id: "calculator", label: "Calculator", icon: Calculator },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="cursor-pointer">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-green-600 text-white">
                  <ShoppingCart className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SuperMarket POS</span>
                  <span className="truncate text-xs">Register #001</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.id}>
                  <SidebarMenuButton isActive={activeTab === action.id} onClick={() => onTabChange(action.id)}>
                    <action.icon />
                    <span>{action.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Shift Info</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-1 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Transactions:</span>
                <Badge variant="secondary">47</Badge>
              </div>
              <div className="flex justify-between text-xs">
                <span>Total Sales:</span>
                <Badge variant="default">$2,847</Badge>
              </div>
              <div className="flex justify-between text-xs">
                <span>Shift Start:</span>
                <span className="text-muted-foreground">8:00 AM</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Cashier" />
                <AvatarFallback className="rounded-lg bg-green-600 text-white">JD</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Jane Doe</span>
                <span className="truncate text-xs">Cashier</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
