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
  ChartAreaIcon,
  DollarSign,
  DotSquare,
  Ellipsis,
  Plus,
  PlusIcon,
  Settings,
  TrendingUp,
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
            <h1 className="text-2xl font-bold m">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage all tenants, monitor system performance, and configure
              global settings.
            </p>
          </section>
          <CustomButton title="Add Tenant" icon={<Plus />} />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TenantStatsCard
            title="Total Tenants"
            value="5"
            icon={<Building />}
          />
          <TenantStatsCard
            title="Active Users"
            value="50"
            icon={<UsersRoundIcon />}
          />
          <TenantStatsCard title="System Revenue" value="100" icon={<Box />} />
          <TenantStatsCard
            title="System Alerts"
            value="3"
            icon={<TriangleAlert />}
          />
        </div>
      </header>

      <main className="flex flex-col gap-6">
        {/* Recent Activities & Quick Actions  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <section>
            <Card className="w-full">
              <CardHeader className="flex flex-col">
                <CardTitle className="text-2xl  font-bold">
                  Notifications
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center">
                  latest updates from your branches
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center bg-black text-white p-2 rounded-sm">
                  <div>Test Notifications 1</div>
                  <div className="flex items-center gap-4">
                    <span>Timestamp</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>
                          Notification Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Mark As Read</DropdownMenuItem>
                        <DropdownMenuItem>Mark As Unread</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="w-full">
              <CardHeader className="flex flex-col">
                <CardTitle className="text-2xl  font-bold">
                  Quick Actions
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center">
                  Common administrative tasks
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <CustomButton
                    title="Create New Tenant"
                    icon={<PlusIcon />}
                    className="w-full item-start"
                  />
                  <CustomButton
                    title="Generate System Report"
                    icon={<ChartAreaIcon />}
                    className="w-full item-start"
                  />
                  <CustomButton
                    title="System Configuration"
                    icon={<Settings />}
                    className="w-full item-start"
                  />
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
