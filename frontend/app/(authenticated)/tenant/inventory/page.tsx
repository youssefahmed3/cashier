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
import { columnInventory } from "../_components/columnInventory";

const Page = () => {
  return (
    <div className="container-base">
      <header className="flex flex-col gap-6">
        {/* Welcome Message and the Title With a Button */}
        <div className="flex items-center justify-between">
          <section>
            <h1 className="text-2xl font-bold m">Inventory</h1>
            <p className="text-muted-foreground">
              Track stock levels, batches, and expiration dates across all
              branches.
            </p>
          </section>
          <CustomButton title="Add New Stock Entry" icon={<Plus />} />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TenantStatsCard title="Total Items" value="5" icon={<Box />} />
          <TenantStatsCard
            title="Low Stock Alerts"
            value="1"
            icon={<AlertTriangle />}
          />
          <TenantStatsCard
            title="Expiring Soon"
            value="3"
            icon={<LucideCalendarRange />}
          />
          <TenantStatsCard
            title="Total Value"
            value="$931.575"
            icon={<DollarSign />}
          />
        </div>
      </header>

      <main className="flex flex-col gap-6">
        {/* Branches Management */}
        <section>
          <Card className="w-full">
            <CardHeader className="flex flex-col">
              <CardTitle className="text-2xl font-bold">
                Inventory Management
              </CardTitle>
              <p className="text-xs text-muted-foreground flex items-center">
                Track and manage inventory across all branches with batch
                tracking and expiration monitoring
              </p>
            </CardHeader>
            <CardContent>
              {/* Table */}
              <DataTable
                columns={columnInventory}
                data={[]}
                filterBy="branch"
              />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Page;
