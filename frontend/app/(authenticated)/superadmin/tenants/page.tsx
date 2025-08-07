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
import CreateTenantModal from "@/components/modals/CreateTenantModal";
import { useCatalog } from "@/hooks/useCatalog";

const Page = () => {
  const { activeTenantsQuery } = useTenant();
  const { getAllTenantWithPaginationLoading, getAllTenantWithPagination } =
    useTenant();
  const { products, productsLoading } = useCatalog();
  if (getAllTenantWithPaginationLoading || productsLoading) {
    return <div>Loading...</div>;
  }

  console.log("activeTenants", activeTenantsQuery);

  console.log("All Tenants", getAllTenantWithPagination!.content);

  // console.log(tenantWithBranchesQuery());
  return (
    <div className="container-base">
      <header className="flex flex-col gap-6">
        {/* Welcome Message and the Title With a Button */}
        <div className="flex items-center justify-between">
          <section>
            <h1 className="text-2xl font-bold m">Tenants Management</h1>
            <p className="text-muted-foreground">
              Manage all tenant accounts, subscriptions, and configurations.
            </p>
          </section>
          <CreateTenantModal />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
          <TenantStatsCard title="Total Items" value={(products?.length ?? 0).toString()} icon={<Box />} />
          <TenantStatsCard
            title="Total Tenants"
            value={(getAllTenantWithPagination?.content?.length ?? 0).toString()}
            icon={<AlertTriangle />}
          />
          <TenantStatsCard
            title="Active Tenants"
            value={(activeTenantsQuery.data?.length ?? 0).toString()}
            icon={<LucideCalendarRange />}
          />
          <TenantStatsCard
            title="Total Revenue"
            value="$1.9M"
            icon={<DollarSign />}
          />
          <TenantStatsCard
            title="Total Employees"
            value="1,745"
            icon={<UsersRoundIcon />}
          />
        </div>
      </header>

      <main className="flex flex-col gap-6">
        {/* Branches Management */}
        <section>
          <Card className="w-full">
            <CardHeader className="flex flex-col">
              <CardTitle className="text-2xl font-bold">All Tenants</CardTitle>
              <p className="text-xs text-muted-foreground flex items-center">
                Manage tenant accounts, subscriptions, and access permissions
              </p>
            </CardHeader>
            <CardContent>
              {/* Table */}
              <DataTable
                columns={tenantColumns}
                data={getAllTenantWithPagination!.content}
                filterBy="name"
              />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Page;
