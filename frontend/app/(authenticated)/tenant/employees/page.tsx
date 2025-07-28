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

/* Fake Data */
const data: BranchType[] = [
  {
    id: "1",
    branch_name: "Downtown HQ",
    location: "Cairo, Egypt",
    manager: "Hassan abdelshafy",
    employees: 45,
    revenue: 125000,
    status: "active",
  },
  {
    id: "2",
    branch_name: "Giza Center",
    location: "Giza, Egypt",
    manager: "Fatma Hassan",
    employees: 32,
    revenue: 89000,
    status: "active",
  },
  {
    id: "3",
    branch_name: "Alex North",
    location: "Alexandria, Egypt",
    manager: "Omar Khaled",
    employees: 20,
    revenue: 62000,
    status: "inactive",
  },
  {
    id: "4",
    branch_name: "Nasr City",
    location: "Cairo, Egypt",
    manager: "Mona Adel",
    employees: 28,
    revenue: 78000,
    status: "under_maintenance",
  },
  {
    id: "5",
    branch_name: "Heliopolis Hub",
    location: "Cairo, Egypt",
    manager: "Youssef Osman",
    employees: 40,
    revenue: 110000,
    status: "active",
  },
  {
    id: "6",
    branch_name: "Zamalek Point",
    location: "Cairo, Egypt",
    manager: "Salma Mahmoud",
    employees: 22,
    revenue: 54000,
    status: "inactive",
  },
  {
    id: "7",
    branch_name: "Maadi Office",
    location: "Cairo, Egypt",
    manager: "Hassan Tarek",
    employees: 38,
    revenue: 94000,
    status: "active",
  },
  {
    id: "8",
    branch_name: "6th October Zone",
    location: "Giza, Egypt",
    manager: "Noha Fathy",
    employees: 35,
    revenue: 87000,
    status: "active",
  },
  {
    id: "9",
    branch_name: "Port Said Terminal",
    location: "Port Said, Egypt",
    manager: "Karim Fawzy",
    employees: 19,
    revenue: 47000,
    status: "under_maintenance",
  },
  {
    id: "10",
    branch_name: "Tanta Base",
    location: "Tanta, Egypt",
    manager: "Laila Nabil",
    employees: 25,
    revenue: 61000,
    status: "inactive",
  },
];

const Page = () => {
  return (
    <div className="container-base">
      <header className="flex flex-col gap-6">
        {/* Welcome Message and the Title With a Button */}
        <div className="flex items-center justify-between">
          <section>
            <h1 className="text-2xl font-bold m">Employees</h1>
            <p className="text-muted-foreground">
              Manage your workforce across all branches
            </p>
          </section>
          <CustomButton title="Add New Employee" icon={<Plus />} />
        </div>
      </header>

      <main className="flex flex-col gap-6">
        {/* Branches Management */}
        <section>
          <Card className="w-full">
            <CardHeader className="flex flex-col">
              <CardTitle className="text-2xl font-bold">
                Employee Management
              </CardTitle>
              <p className="text-xs text-muted-foreground flex items-center">
                View and manage all employees across your supermarket chain.
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
