"use client"

import * as React from "react"
import { ShoppingCart, CreditCard, Users, History, Settings, Calculator, Play, Square, Clock } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/hooks/useAuth"
import { useBranch } from "@/hooks/useBranch"
import { useShift } from "@/hooks/useShift"

interface POSSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function POSSidebar({ activeTab, onTabChange, ...props }: POSSidebarProps) {
  const { user, tenantId } = useAuth() as any
  const { tenantBranchesQuery } = useBranch()
  const { data: branches = [] } = tenantBranchesQuery(tenantId?.tenantId ?? "")
  const [selectedBranch, setSelectedBranch] = React.useState<string | undefined>(undefined)
  React.useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('pos-branch-id') : null
    if (saved) setSelectedBranch(saved)
  }, [])
  React.useEffect(() => {
    if (!selectedBranch && branches.length > 0) setSelectedBranch(String(branches[0].id))
  }, [branches, selectedBranch])
  React.useEffect(() => {
    if (selectedBranch) localStorage.setItem('pos-branch-id', selectedBranch)
  }, [selectedBranch])

  const branchIdNum = selectedBranch ? Number(selectedBranch) : undefined
  const { activeShiftQuery, startShiftMutation, endShiftMutation } = useShift(branchIdNum, user?.id)
  const activeShift = activeShiftQuery.data
  const [startDialogOpen, setStartDialogOpen] = React.useState(false)
  const [endDialogOpen, setEndDialogOpen] = React.useState(false)
  const [startingCash, setStartingCash] = React.useState<string>("")
  const [endingCash, setEndingCash] = React.useState<string>("")

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
                  <span className="truncate font-semibold">Market-OS</span>
                  <span className="truncate text-xs">prototype</span>
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
          <SidebarGroupLabel>Branch</SidebarGroupLabel>
          <SidebarGroupContent>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b: any) => (
                  <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Shift</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-1 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Status:</span>
                <Badge variant={activeShift?.isActive ? "default" : "secondary"}>
                  {activeShift?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              {activeShift?.startTime && (
                <div className="flex justify-between"><span>Started:</span><span>{new Date(activeShift.startTime).toLocaleTimeString()}</span></div>
              )}
              <div className="flex gap-2 pt-2">
                {!activeShift?.isActive ? (
                  <Button size="sm" className="w-full" onClick={() => setStartDialogOpen(true)}>
                    <Play className="h-3 w-3 mr-1" /> Start Shift
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="w-full" onClick={() => setEndDialogOpen(true)}>
                    <Square className="h-3 w-3 mr-1" /> End Shift
                  </Button>
                )}
              </div>
            </div>
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

      {/* Start Shift Dialog */}
      <Dialog open={startDialogOpen} onOpenChange={setStartDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Shift</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input type="number" placeholder="Starting cash" value={startingCash} onChange={(e) => setStartingCash(e.target.value)} />
            <Button
              onClick={async () => {
                if (!branchIdNum || !user?.id) return
                await startShiftMutation.mutateAsync({ branchId: branchIdNum, userId: user.id, startingCash: Number(startingCash || 0) })
                setStartDialogOpen(false)
                setStartingCash("")
              }}
            >Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* End Shift Dialog */}
      <Dialog open={endDialogOpen} onOpenChange={setEndDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Shift</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input type="number" placeholder="Ending cash" value={endingCash} onChange={(e) => setEndingCash(e.target.value)} />
            <Button
              variant="outline"
              onClick={async () => {
                if (!activeShift?.id) return
                await endShiftMutation.mutateAsync({ shiftId: Number(activeShift.id), endingCash: Number(endingCash || 0) })
                setEndDialogOpen(false)
                setEndingCash("")
              }}
            >Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
