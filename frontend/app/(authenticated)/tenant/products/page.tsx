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
  Tag,
  UsersRoundIcon,
} from "lucide-react";
import React from "react";
import { columnInventory } from "../_components/columnInventory";
import { columnProducts } from "../_components/columnProducts";

const Page = () => {
  return (
    <div className="container-base">
      <header className="flex flex-col gap-6">
        {/* Welcome Message and the Title With a Button */}
        <div className="flex items-center justify-between">
          <section>
            <h1 className="text-2xl font-bold m">Products</h1>
            <p className="text-muted-foreground">
              Manage your product catalog, pricing, and product information.
            </p>
          </section>
          <CustomButton title="Add New Product" icon={<Plus />} />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TenantStatsCard title="Total Products" value="5" icon={<Box />} />
          <TenantStatsCard title="Active Products" value="4" icon={<Tag />} />
          <TenantStatsCard title="Inactive Products" value="1" icon={<Tag />} />
          <TenantStatsCard
            title="Average Price"
            value="$4.15"
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
                Product Catalog
              </CardTitle>
              <p className="text-xs text-muted-foreground flex items-center">
                Manage your product catalog with pricing, categories, and
                product information.
              </p>
            </CardHeader>
            <CardContent>
              {/* Table */}
              <DataTable
                columns={columnProducts}
                data={[]}
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
