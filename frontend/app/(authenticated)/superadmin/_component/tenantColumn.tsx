"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Tenant } from "@/types/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";

export const tenantColumns: ColumnDef<Tenant>[] = [
  {
    accessorKey: "name",
    header: "Tenant Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "branches",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Branches
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const branches = row.getValue("branches") as
        | Tenant["branches"]
        | undefined;
      return <div className="text-center">{branches?.length ?? 0}</div>;
    },
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Active
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const active = row.getValue("is_active") as boolean;
      return (
        <Badge
          variant={active ? "default" : "destructive"}
          className="capitalize"
        >
          {active ? "Active" : "Suspended"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const created = row.getValue("created_at") as string;
      const date = new Date(created);
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const tenant = row.original;
      const [selectedUser, setSelectedUser] = useState<string>("");
      const { allUsers, allUsersIsLoading, suspendUserMutation } = useAuth();
      const { assignUserToTenantMutation } = useTenant();
      if (allUsersIsLoading) {
        return <div>Loading...</div>;
      }
      console.log("allUsers", allUsers);

      const AdminUsers = allUsers?.filter(
        (user) => Array.isArray(user.roles) && user.roles.includes("Admin")
      );

      const handleAssign = () => {
        if (!selectedUser) return;
        const userId = parseInt(selectedUser, 10);
        console.log(`Assigning user ${userId} to tenant ${tenant.id}`);
        assignUserToTenantMutation.mutate({
          tenantId: tenant.id,
          userId: userId,
        });
        setSelectedUser(""); // Reset after assign
      };

      return (
        <Dialog>
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
                onClick={() => navigator.clipboard.writeText(tenant.id)}
              >
                Copy tenant ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
{/*               <DropdownMenuItem className="text-red-600" onClick={() => {
                suspendUserMutation({userId: })
              }}>
                {tenant.is_active ? "Suspend" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuSeparator /> */}
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Assign User
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign User to Tenant</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Select
                value={selectedUser}
                onValueChange={(val) => setSelectedUser(val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {AdminUsers!.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.firstname} {user.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAssign} disabled={!selectedUser}>
                Assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
