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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction } from "../page"

// Sample transaction data
const transactionData: Transaction[] = [
  {
    id: "TXN001234",
    date: "2024-01-27",
    time: "14:32:15",
    items: [
      {
        id: "PRD001",
        name: "Organic Bananas",
        price: 2.99,
        quantity: 2,
        barcode: "1234567890123",
        category: "Fruits",
        taxRate: 0.08,
      },
      {
        id: "PRD002",
        name: "Whole Milk 1L",
        price: 3.49,
        quantity: 1,
        barcode: "2345678901234",
        category: "Dairy",
        taxRate: 0.08,
      },
    ],
    customer: { id: "CUST001", name: "John Smith", loyaltyPoints: 1250, membershipLevel: "gold" },
    total: 9.47,
    paymentMethod: "card",
    cashier: "Jane Doe",
    status: "completed",
  },
  {
    id: "TXN001235",
    date: "2024-01-27",
    time: "14:45:22",
    items: [
      {
        id: "PRD003",
        name: "White Bread",
        price: 2.79,
        quantity: 1,
        barcode: "4567890123456",
        category: "Bakery",
        taxRate: 0.08,
      },
    ],
    total: 3.01,
    paymentMethod: "cash",
    cashier: "Jane Doe",
    status: "completed",
  },
  {
    id: "TXN001236",
    date: "2024-01-27",
    time: "15:12:08",
    items: [
      {
        id: "PRD004",
        name: "Ground Beef 1lb",
        price: 8.99,
        quantity: 1,
        barcode: "3456789012345",
        category: "Meat",
        taxRate: 0.08,
      },
      {
        id: "PRD005",
        name: "Coca Cola 2L",
        price: 2.49,
        quantity: 2,
        barcode: "5678901234567",
        category: "Beverages",
        taxRate: 0.08,
      },
    ],
    customer: { id: "CUST002", name: "Sarah Johnson", loyaltyPoints: 850, membershipLevel: "silver" },
    total: 14.95,
    paymentMethod: "card",
    cashier: "Jane Doe",
    status: "completed",
  },
  {
    id: "TXN001237",
    date: "2024-01-27",
    time: "15:28:45",
    items: [
      {
        id: "PRD001",
        name: "Organic Bananas",
        price: 2.99,
        quantity: 3,
        barcode: "1234567890123",
        category: "Fruits",
        taxRate: 0.08,
      },
    ],
    total: 9.69,
    paymentMethod: "cash",
    cashier: "Jane Doe",
    status: "refunded",
  },
  {
    id: "TXN001238",
    date: "2024-01-27",
    time: "16:05:12",
    items: [
      {
        id: "QP001",
        name: "Plastic Bag",
        price: 0.1,
        quantity: 5,
        barcode: "BAG001",
        category: "Accessories",
        taxRate: 0.08,
      },
      {
        id: "QP002",
        name: "Gift Card $25",
        price: 25.0,
        quantity: 1,
        barcode: "GC025",
        category: "Gift Cards",
        taxRate: 0,
      },
    ],
    total: 25.54,
    paymentMethod: "card",
    cashier: "Jane Doe",
    status: "completed",
  },
]

export const transactionColumns: ColumnDef<Transaction>[] = [
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
  {
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
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reprint Receipt
            </DropdownMenuItem>
            {transaction.status === "completed" && (
              <DropdownMenuItem className="text-red-600">
                <X className="mr-2 h-4 w-4" />
                Process Refund
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function TransactionHistory() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [paymentFilter, setPaymentFilter] = React.useState<string>("all")

  const filteredData = React.useMemo(() => {
    return transactionData.filter((transaction) => {
      const statusMatch = statusFilter === "all" || transaction.status === statusFilter
      const paymentMatch = paymentFilter === "all" || transaction.paymentMethod === paymentFilter
      return statusMatch && paymentMatch
    })
  }, [statusFilter, paymentFilter])

  const table = useReactTable({
    data: filteredData,
    columns: transactionColumns,
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
                    <TableCell colSpan={transactionColumns.length} className="h-24 text-center">
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
    </div>
  )
}
