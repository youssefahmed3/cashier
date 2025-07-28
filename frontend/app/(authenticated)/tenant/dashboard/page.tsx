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
  DollarSign,
  DotSquare,
  Ellipsis,
  Plus,
  PlusIcon,
  TrendingUp,
  User2,
  UsersRoundIcon,
} from "lucide-react";
import React from "react";
import { columnsBranches } from "../_components/columnBranches";
import { BranchType } from "@/types/types";

import { useQuery } from "@tanstack/react-query";

/* Fake Data */
const data: BranchType[] = [
  {
    id: "BR001",
    branch_name: "Main Branch",
    location: "Cairo",
    tax: "14",
    phone: "01000000001",
    slug: "a1b2c3",
    status: "active",
  },
  {
    id: "BR002",
    branch_name: "Downtown Branch",
    location: "Alexandria",
    tax: "14",
    phone: "01000000002",
    slug: "x9y8z7",
    status: "inactive",
  },
  {
    id: "BR003",
    branch_name: "East Branch",
    location: "Mansoura",
    tax: "10",
    phone: "01000000003",
    slug: "p0q1r2",
    status: "under_maintenance",
  },
  {
    id: "BR004",
    branch_name: "Giza Branch",
    location: "Giza",
    tax: "12",
    phone: "01000000004",
    slug: "f4g5h6",
    status: "active",
  },
  {
    id: "BR005",
    branch_name: "Nasr City Branch",
    location: "Cairo",
    tax: "14",
    phone: "01000000005",
    slug: "n7m8l9",
    status: "active",
  },
  {
    id: "BR006",
    branch_name: "Heliopolis Branch",
    location: "Cairo",
    tax: "13",
    phone: "01000000006",
    slug: "w3e2r1",
    status: "inactive",
  },
  {
    id: "BR007",
    branch_name: "Maadi Branch",
    location: "Cairo",
    tax: "14",
    phone: "01000000007",
    slug: "u8i9o0",
    status: "under_maintenance",
  },
  {
    id: "BR008",
    branch_name: "Tanta Branch",
    location: "Tanta",
    tax: "10",
    phone: "01000000008",
    slug: "s3d4f5",
    status: "active",
  },
  {
    id: "BR009",
    branch_name: "Zamalek Branch",
    location: "Cairo",
    tax: "15",
    phone: "01000000009",
    slug: "g6h7j8",
    status: "inactive",
  },
  {
    id: "BR010",
    branch_name: "6th October Branch",
    location: "6th October",
    tax: "12",
    phone: "01000000010",
    slug: "k9l0m1",
    status: "active",
  },
];



const Page = () => {


  return (
    <div className="container-base">
      <header className="flex flex-col gap-6">
        {/* Welcome Message and the Title With a Button */}
        <div className="flex items-center justify-between">
          <section>
            <h1 className="text-2xl font-bold m">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome Back! Here's What's happening with your supermarket Chain.
            </p>
          </section>
          <CustomButton title="Add Branch" icon={<Plus />} />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TenantStatsCard
            title="Total Branches"
            value="5"
            icon={<Building />}
          />
          <TenantStatsCard
            title="Total Employees"
            value="50"
            icon={<UsersRoundIcon />}
          />
          <TenantStatsCard title="Inventory Items" value="100" icon={<Box />} />
          <TenantStatsCard
            title="Monthly Revenue"
            value="125000"
            icon={<DollarSign />}
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
                  Common tasks and shortcuts
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <CustomButton
                    title="Add New Employee"
                    icon={<PlusIcon />}
                    className="w-full item-start"
                  />
                  <CustomButton
                    title="Update Inventory"
                    icon={<Box />}
                    className="w-full item-start"
                  />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Branches Management */}
        <section>
          <Card className="w-full">
            <CardHeader className="flex flex-col">
              <CardTitle className="text-2xl  font-bold">
                Branch Management
              </CardTitle>
              <p className="text-xs text-muted-foreground flex items-center">
                Manage All Your Branches from one place
              </p>
            </CardHeader>
            <CardContent>
              {/* Table */}
              <DataTable
                columns={columnsBranches}
                data={data}
                filterBy="branch_name"
              />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Page;
