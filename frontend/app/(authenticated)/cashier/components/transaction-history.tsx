"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye, RefreshCw, X, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction } from "../page"
import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query"
import { getPaymentsByBranch, type PaymentDto, refundPayment } from "@/lib/api/payments"
import { getOrderById, type OrderDto } from "@/lib/api/orders"
import { useShift } from "@/hooks/useShift"
import { DateRange } from "react-day-picker"
import { useAuth } from "@/hooks/useAuth"
import { useBranch } from "@/hooks/useBranch"

// Will load from backend payments API; fallback to empty
const transactionData: Transaction[] = []

const baseColumns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Transaction ID",
    cell: ({ row }) => <div className="font-mono text-sm font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "time",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.original.date
      const time = row.getValue("time") as string
      return (
        <div className="text-sm">
          <div className="font-medium">{time}</div>
          <div className="text-muted-foreground">{new Date(date).toLocaleDateString()}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original.customer
      return customer ? (
        <div>
          <div className="font-medium">{customer.name}</div>
          <Badge variant="outline" className="text-xs">
            {customer.membershipLevel}
          </Badge>
        </div>
      ) : (
        <span className="text-muted-foreground">Walk-in</span>
      )
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.getValue("items") as Transaction["items"]
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      return (
        <div className="text-sm">
          <div className="font-medium">{totalItems} items</div>
          <div className="text-muted-foreground">{items.length} products</div>
        </div>
      )
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("total"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string
      return (
        <Badge variant="outline" className="capitalize">
          {method}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={status === "completed" ? "default" : status === "refunded" ? "secondary" : "destructive"}
          className="capitalize"
        >
          {status}
        </Badge>
      )
    },
  },
]

export function TransactionHistory() {
  const { user } = useAuth()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [paymentFilter, setPaymentFilter] = React.useState<string>("all")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  const { tenantId } = useAuth()
  const { tenantBranchesQuery } = useBranch()
  const { data: branches } = tenantBranchesQuery(tenantId?.tenantId ?? "")
  const branchId = React.useMemo(() => (branches && branches[0]?.id ? Number(branches[0].id) : undefined), [branches])

  const { data: payments = [], isLoading } = useQuery<PaymentDto[]>({
    queryKey: ["payments", branchId, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: () => getPaymentsByBranch(
      branchId!,
      dateRange?.from ? dateRange.from.toISOString() : undefined,
      dateRange?.to ? dateRange.to.toISOString() : undefined
    ),
    enabled: !!branchId,
    staleTime: 60_000,
  })

  // Map payment id and load orders for details
  const paymentById = React.useMemo(() => {
    const map = new Map<string, PaymentDto>()
    for (const p of payments) map.set(String(p.id), p)
    return map
  }, [payments])

  const ordersQueries = useQueries({
    queries: (payments || []).map((p) => ({
      queryKey: ["order", p.orderId],
      queryFn: () => getOrderById(p.orderId),
      enabled: !!p.orderId,
      staleTime: 60_000,
    })),
  })
  const orderMap = React.useMemo(() => {
    const map = new Map<number, OrderDto>()
    ordersQueries.forEach((q) => {
      if (q.data) map.set(q.data.orderId, q.data)
    })
    return map
  }, [ordersQueries])

  // Shift for refund
  const { activeShiftQuery } = useShift(branchId, user?.id)
  const shiftId = activeShiftQuery.data?.id ? Number(activeShiftQuery.data.id) : undefined

  // Dialog state
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [refundOpen, setRefundOpen] = React.useState(false)
  const [activePayment, setActivePayment] = React.useState<PaymentDto | null>(null)
  const [refundReason, setRefundReason] = React.useState("")
  const [refundQty, setRefundQty] = React.useState<Record<string, number>>({})
  const qc = useQueryClient()

  const mappedTransactions: Transaction[] = React.useMemo(() => {
    return (payments || []).map((p) => ({
      id: String(p.id),
      date: new Date(p.createdAt).toISOString().slice(0, 10),
      time: new Date(p.createdAt).toTimeString().slice(0, 8),
      items: (orderMap.get(p.orderId)?.items || []).map((it) => ({
        id: String(it.productId),
        name: it.name,
        price: Number(it.unitPrice),
        quantity: Number(it.quantity),
        barcode: "",
        category: "General",
        taxRate: 0,
      })),
      total: Number(p.amount),
      paymentMethod: (p.method?.toLowerCase() as any) ?? "cash",
      cashier: "",
      status: (p.status?.toLowerCase() as any) ?? "completed",
    }))
  }, [payments, orderMap])

  const filteredData = React.useMemo(() => {
    return mappedTransactions.filter((transaction) => {
      const statusMatch = statusFilter === "all" || transaction.status === statusFilter
      const paymentMatch = paymentFilter === "all" || transaction.paymentMethod === paymentFilter
      return statusMatch && paymentMatch
    })
  }, [statusFilter, paymentFilter, mappedTransactions])

  // Build columns with action menu
  const columns = React.useMemo<ColumnDef<Transaction>[]>(() => {
    const actions: ColumnDef<Transaction> = {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const transaction = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(transaction.id)}>
                Copy transaction ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                const p = paymentById.get(transaction.id) || null
                setActivePayment(p)
                setDetailsOpen(true)
              }}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {transaction.status === "completed" && (
                <DropdownMenuItem className="text-red-600" onClick={() => {
                  const p = paymentById.get(transaction.id) || null
                  setActivePayment(p)
                  setRefundQty({})
                  setRefundReason("")
                  setRefundOpen(true)
                }}>
                  <X className="mr-2 h-4 w-4" />
                  Process Refund
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    }
    return [...baseColumns, actions]
  }, [paymentById])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Calculate summary statistics
  const totalTransactions = filteredData.length
  const completedTransactions = filteredData.filter((t) => t.status === "completed").length
  const totalRevenue = filteredData.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.total, 0)
  const refundedTransactions = filteredData.filter((t) => t.status === "refunded").length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-muted-foreground">View and manage all transactions for today's shift</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Today's shift</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTransactions}</div>
            <p className="text-xs text-muted-foreground">Successful transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From completed sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{refundedTransactions}</div>
            <p className="text-xs text-muted-foreground">Refunded transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Complete list of transactions processed during this shift</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 py-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("id")?.setFilterValue(event.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="voided">Voided</SelectItem>
              </SelectContent>
            </Select>
            {/* Date range (basic inputs to avoid calendar dep) */}
            <div className="flex items-center gap-2">
              <Input type="date" value={dateRange?.from ? dateRange.from.toISOString().slice(0,10) : ""} onChange={(e) => setDateRange({ from: e.target.value ? new Date(e.target.value) : undefined, to: dateRange?.to })} />
              <Input type="date" value={dateRange?.to ? dateRange.to.toISOString().slice(0,10) : ""} onChange={(e) => setDateRange({ from: dateRange?.from, to: e.target.value ? new Date(e.target.value) : undefined })} />
            </div>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto bg-transparent">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
              selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {activePayment && (
            <div className="space-y-3">
              <div className="text-sm">Payment ID: {activePayment.id} • Order ID: {activePayment.orderId}</div>
              <div className="text-sm">Amount: {activePayment.amount}</div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(orderMap.get(activePayment.orderId)?.items || []).map((it) => (
                      <TableRow key={it.id}>
                        <TableCell>{it.name}</TableCell>
                        <TableCell>{String(it.quantity)}</TableCell>
                        <TableCell>{String(it.unitPrice)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
          </DialogHeader>
          {activePayment && (
            <div className="space-y-3">
              <div className="grid gap-2">
                <Label>Reason</Label>
                <Input value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="Optional reason" />
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Max Qty</TableHead>
                      <TableHead>Refund Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(orderMap.get(activePayment.orderId)?.items || []).map((it) => (
                      <TableRow key={it.id}>
                        <TableCell>{it.name}</TableCell>
                        <TableCell>{String(it.quantity)}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            max={Number(it.quantity)}
                            value={refundQty[String(it.id!)] ?? 0}
                            onChange={(e) => setRefundQty({ ...refundQty, [String(it.id!)]: Number(e.target.value) })}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRefundOpen(false)}>Cancel</Button>
                <Button
                  onClick={async () => {
                    if (!branchId || !shiftId || !activePayment) return
                    const order = orderMap.get(activePayment.orderId)
                    if (!order) return
                    const items = (order.items || [])
                      .filter((it) => typeof it.id === 'number' && (refundQty[String(it.id)] ?? 0) > 0)
                      .map((it) => ({ orderItemId: Number(it.id), quantity: Number(refundQty[String(it.id)] ?? 0), productId: it.productId }))
                    if (items.length === 0) return
                    await refundPayment({
                      orderId: order.orderId,
                      branchId,
                      shiftId,
                      reason: refundReason || undefined,
                      items,
                    })
                    setRefundOpen(false)
                    setRefundQty({})
                    setRefundReason("")
                    qc.invalidateQueries({ queryKey: ["payments", branchId] })
                  }}
                >Submit Refund</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
