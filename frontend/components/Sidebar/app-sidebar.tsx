"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Box,
  Building2,
  ChartArea,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  PieChart,
  Settings,
  Settings2,
  SquareTerminal,
  User,
  Users,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types/types";
import { useAggregate } from "@/hooks/useAggregate";

type UserRole = "admin" | "superadmin"; // type fix

const fetchedMockedUser = {
  id: "1",
  name: "John Doe",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
  role: "admin" as UserRole,
  branches: [
    {
      id: "branch-1",
      name: "Branch 1",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
};

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/tenant/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      role: ["admin"] as Role[],
    },
    {
      title: "Employees",
      url: "/tenant/employees",
      icon: Users,
      isActive: true,
      role: ["admin"] as Role[],
    },
    {
      title: "Inventory",
      url: "/tenant/inventory",
      icon: Box,
      role: ["admin"] as Role[],
    },
    {
      title: "Catalog",
      url: "/tenant/catalog",
      icon: Box,
      isActive: true,
      role: ["admin"] as Role[],
    },
    {
      title: "Settings",
      url: "/tenant/settings",
      icon: Settings,
      role: ["admin"] as Role[],
    },
    {
      title: "Dashboard",
      url: "/superadmin/dashboard",
      icon: LayoutDashboard,
      role: ["superadmin"] as Role[],
    },
    {
      title: "Users",
      url: "/superadmin/users",
      icon: User,
      role: ["superadmin"] as Role[],
    },
    {
      title: "Tenants",
      url: "/superadmin/tenants",
      icon: Building2,
      role: ["superadmin"] as Role[],
    },
    {
      title: "System Wide Analytics",
      url: "/superadmin/analytics",
      icon: ChartArea,
      role: ["superadmin"] as Role[],
    },
    {
      title: "Settings",
      url: "/superadmin/settings",
      icon: Settings,
      role: ["superadmin"] as Role[],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { getFullUserData, isLoading } = useAggregate();

  if (isLoading || !getFullUserData?.user) {
    return null; // Or a <SkeletonSidebar /> component
  }

  const role = getFullUserData.user.roles?.[0] ?? "admin";

  const branches =
    getFullUserData?.tenant?.branches?.map((branch) => ({
      name: branch.name,
      logo: Building2, // Replace with dynamic icon if available
      plan: "Enterprise", // Add from backend if needed
    })) ?? [];

  const filteredNavItems = data.navMain.filter((item) =>
    item.role.some((r) => getFullUserData.user?.roles.includes(r))
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <p className="text-center font-bold">{getFullUserData?.tenant?.name}</p>
        <TeamSwitcher
          tenantName={getFullUserData?.tenant?.name ?? ""}
          role={role ?? "admin"}
          branches={
            branches.map((branch) => ({
              name: branch.name,
              logo: Building2, // Replace with branch.logo if you store icons
              plan: "Enterprise", // Add from backend later if needed
            })) ?? []
          }
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={getFullUserData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
