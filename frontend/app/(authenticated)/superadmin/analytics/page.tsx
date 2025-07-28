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
  Box,
  Building,
  ChartArea,
  ChartAreaIcon,
  ChartLine,
  DollarSign,
  DotSquare,
  Ellipsis,
  Plus,
  PlusIcon,
  Settings,
  TrendingUp,
  Triangle,
  TriangleAlert,
  User2,
  UsersRoundIcon,
} from "lucide-react";
import React from "react";
import { BranchType } from "@/types/types";

import { useQuery } from "@tanstack/react-query";

const Page = () => {
  return (
    <div className="container-base">
      <header className="flex flex-col gap-6">
        {/* Welcome Message and the Title With a Button */}
        <div className="flex items-center justify-between">
          <section>
            <h1 className="text-2xl font-bold m">System Wide Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive analytics and insights across all tenants and system
              performance.
            </p>
          </section>
          <CustomButton title="Export Report" icon={<ChartArea />} />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TenantStatsCard
            title="System Uptime"
            value="99.9%"
            icon={<ChartLine />}
          />
          <TenantStatsCard
            title="Total Transactions"
            value="2.4M"
            icon={<UsersRoundIcon />}
          />
          <TenantStatsCard
            title="Error Rate"
            value="0.1%"
            icon={<TriangleAlert />}
          />
          <TenantStatsCard
            title="System Alerts"
            value="3"
            icon={<TriangleAlert />}
          />
        </div>
      </header>

      <main className="flex flex-col gap-6">
        {/* Revenue Trends  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <section>
            <Card className="w-full">
              <CardHeader className="flex flex-col">
                <CardTitle className="text-2xl  font-bold">
                  Revenue Trends
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center">
                  Monthly recurring revenue across all tenants
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex justify-between items-center bg-black text-white p-2 rounded-sm">
                  <span>January 2024</span>{" "}
                  <span className="font-bold">$2.1M</span>
                </div>
                <div className="flex justify-between items-center bg-black text-white p-2 rounded-sm">
                  <span>January 2024</span>{" "}
                  <span className="font-bold">$2.1M</span>
                </div>
                <div className="flex justify-between items-center bg-black text-white p-2 rounded-sm">
                  <span>January 2024</span>{" "}
                  <span className="font-bold">$2.1M</span>
                </div>
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Revenue Chart Placeholder
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="w-full">
              <CardHeader className="flex flex-col">
                <CardTitle className="text-2xl  font-bold">
                  Tenant Growth
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center">
                  New tenant acquisitions over time
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex justify-between items-center bg-black text-white p-2 rounded-sm">
                  <span>Q1 2024</span>{" "}
                  <span className="font-bold">8 new tenants</span>
                </div>
                <div className="flex justify-between items-center bg-black text-white p-2 rounded-sm">
                  <span>Q2 2024</span>{" "}
                  <span className="font-bold">12 new tenants</span>
                </div>
                <div className="flex justify-between items-center bg-black text-white p-2 rounded-sm">
                  <span>Q3 2024</span>{" "}
                  <span className="font-bold">15 new tenants</span>
                </div>
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Growth Chart Placeholder{" "}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Page;
