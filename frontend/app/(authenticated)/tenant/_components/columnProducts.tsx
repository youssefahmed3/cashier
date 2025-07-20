"use client";

import { BranchType, InventoryType, ProductType } from "@/app/types/types";
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

export const columnProducts: ColumnDef<ProductType>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center w-full">ID</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-full">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center w-full">Product Name</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-full">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center w-full">Price</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-full">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "barcode",
    header: () => <div className="text-center w-full">Barcode</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-full">{getValue() as string}%</div>
    ),
  },

  {
    accessorKey: "isActive",
    header: () => <div className="text-center w-full">Active</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-full">{getValue() as string}</div>
    ),
  },

  {
    accessorKey: "categoryId",
    header: () => <div className="text-center w-full">Category</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-full">{getValue() as string}</div>
    ),
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
