"use client";

import { BranchType, EmployeeType } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columnEmployees: ColumnDef<EmployeeType>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center w-full">Branch ID</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-full">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "branch_name",
    header: () => <div className="text-center w-full">Branch Name</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-full">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "location",
    header: () => <div className="text-center w-full">Location</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-full">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "manager",
    header: () => <div className="text-center w-full">Manager</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-full">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "revenue",
    header: () => <div className="text-center w-full">Revenue</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("revenue"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-center font-medium w-full">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center w-full">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as BranchType["status"];

      const statusColorMap: Record<BranchType["status"], string> = {
        active: "bg-green-500 text-white",
        inactive: "bg-red-500 text-white",
        under_maintenance: "bg-yellow-500 text-black",
      };

      const formatStatus = (status: string) =>
        status
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      return (
        <div className="text-center w-full">
          <Badge className={statusColorMap[status]}>
            {formatStatus(status)}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center w-full">Actions</div>,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="flex justify-center w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy Branch ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];