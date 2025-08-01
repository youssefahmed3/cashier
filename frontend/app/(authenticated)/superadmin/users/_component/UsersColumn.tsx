"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";
import { UserType, Role } from "@/types/types";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const assignSchema = z.object({
  role: z.string().min(1, "Role is required"),
  tenantId: z.string().min(1, "Tenant is required"),
});

export const userColumns: ColumnDef<UserType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "firstname",
    header: "First Name",
  },
  {
    accessorKey: "lastname",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "isSuspended",
    header: "Suspended?",
    cell: ({ row }) => (
      <span
        className={row.original.isSuspended ? "text-red-500" : "text-green-600"}
      >
        {row.original.isSuspended ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.original.roles ?? [];
      return (
        <div className="flex gap-2 flex-wrap">
          {roles.map((role) => (
            <span
              key={role}
              className="bg-muted px-2 py-1 rounded text-xs text-primary border border-border"
            >
              {role}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      const [open, setOpen] = useState(false);

      const {
        getAllRoles,
        getAllRolesIsLoading,
        assignRole,
        suspendUserMutation,
      } = useAuth();
      const { getAllTenantWithPagination, getAllTenantWithPaginationLoading } =
        useTenant();

      const form = useForm<z.infer<typeof assignSchema>>({
        resolver: zodResolver(assignSchema),
        defaultValues: {
          role: user.roles?.[0] || "",
          tenantId: "",
        },
      });

      const handleCopyId = () => {
        navigator.clipboard.writeText(user.id.toString());
        toast.success("User ID copied to clipboard");
      };

      const handleSuspendUser = () => {
        // TODO: Replace with real API call
        suspendUserMutation({ userId: user.id });
        toast.success(`User ${user.firstname} has been suspended`);
      };

      const onSubmit = (values: z.infer<typeof assignSchema>) => {
        const payload = {
          tenantId: values.tenantId,
          roleId: parseInt(values.role),
          userId: row.getValue("id") as number,
        };
        assignRole(payload);
        toast.success(
          `Assigned role "${values.role}" to ${user.firstname} for tenant ${values.tenantId}`
        );
        setOpen(false);
      };

      if (getAllRolesIsLoading || getAllTenantWithPaginationLoading) {
        return <div>Loading...</div>;
      }

      return (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              {/* Copy ID */}
              <DropdownMenuItem
                onClick={handleCopyId}
                className="cursor-pointer"
              >
                Copy ID
              </DropdownMenuItem>

              {/* Assign Role - Dialog Trigger */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer"
                  >
                    Assign Role
                  </DropdownMenuItem>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Role to {user.firstname}</DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      {/* Role Select */}
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Role</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getAllRoles?.map((role) => (
                                  <SelectItem
                                    key={role.id}
                                    value={role.id.toString()}
                                  >
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Tenant Select */}
                      <FormField
                        control={form.control}
                        name="tenantId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Tenant</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a tenant" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getAllTenantWithPagination?.content?.map(
                                  (tenant) => (
                                    <SelectItem
                                      key={tenant.id}
                                      value={tenant.id}
                                    >
                                      {tenant.name}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button type="submit">Assign</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Suspend User */}
              <DropdownMenuItem
                onClick={handleSuspendUser}
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900 focus:bg-red-100 dark:focus:bg-red-800 cursor-pointer"
              >
                Suspend User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
