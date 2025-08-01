"use client";

import { Category } from "@/types/types";
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

export const columnCategories: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center w-full">ID</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-full">{getValue() as number}</div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center w-full">Category Name</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-full">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center w-full">Description</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-full text-muted-foreground text-sm">
        {getValue() as string}
      </div>
    ),
  },
  {
    id: "productCount",
    header: () => <div className="text-center w-full">Products Count</div>,
    cell: ({ row }) => {
      const products = row.original.products;
      return (
        <div className="text-center w-full">
          {products?.length ?? 0}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center w-full">Actions</div>,
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex justify-center w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(category.id.toString())
                }
              >
                Copy Category ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>View Products</DropdownMenuItem>
              <DropdownMenuItem>Edit Category</DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900 focus:bg-red-100 dark:focus:bg-red-800"
              >
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
