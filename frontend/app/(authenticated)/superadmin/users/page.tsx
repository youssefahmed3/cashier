"use client";

import CustomButton from "@/components/Button/Button";
import TenantStatsCard from "@/components/TenantStatsCard/TenantStatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Box,
  Building,
  DollarSign,
  Ellipsis,
  LucideCalendarRange,
  Plus,
  PlusIcon,
  UsersRoundIcon,
} from "lucide-react";
import React from "react";
import { tenantColumns } from "../_component/tenantColumn";
import { Tenant } from "@/types/types";
import { useTenant } from "@/hooks/useTenant";
import { useAuth } from "@/hooks/useAuth";
import { userColumns } from "./_component/UsersColumn";



const Page = () => {
  const {allUsers, allUsersIsLoading} = useAuth();

  if (allUsersIsLoading) {
    return <div>Loading...</div>;
  }

  console.log("allUsers", allUsers);
  
  // console.log(tenantWithBranchesQuery());
  return (
    <div className="container-base">
      <header className="flex flex-col gap-6">
        {/* Welcome Message and the Title With a Button */}
        <div className="flex items-center justify-between">
          <section>
            <h1 className="text-2xl font-bold m">Users Management</h1>
            <p className="text-muted-foreground">
              Manage all Users accounts, Permissions.
            </p>
          </section>
        </div>
      </header>

      <main className="flex flex-col gap-6">
        {/* Branches Management */}
        <section>
          <Card className="w-full">
            <CardHeader className="flex flex-col">
              <CardTitle className="text-2xl font-bold">All Users</CardTitle>
              <p className="text-xs text-muted-foreground flex items-center">
                Manage Users access permissions
              </p>
            </CardHeader>
            <CardContent>
              {/* Table */}
              <DataTable
                columns={userColumns}
                data={allUsers!}
                filterBy="firstname"
              />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Page;
