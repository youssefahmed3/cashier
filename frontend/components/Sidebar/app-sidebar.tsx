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
      role: "admin",
    },
    {
      title: "Employees",
      url: "/tenant/employees",
      icon: Users,
      isActive: true,
      role: "admin",
    },
    {
      title: "Inventory",
      url: "/tenant/inventory",
      icon: Box,
      role: "admin",
    },
    {
      title: "Products",
      url: "/tenant/products",
      icon: Box,
      isActive: true,
      role: "admin",
    },
    {
      title: "Settings",
      url: "/tenant/settings",
      icon: Settings,
      role: "admin",
    },
    {
      title: "Dashboard",
      url: "/superadmin/dashboard",
      icon: LayoutDashboard,
      role: "superadmin",
    },
    {
      title: "Tenants",
      url: "/superadmin/tenants",
      icon: Building2,
      role: "superadmin",
    },
    {
      title: "System Wide Analytics",
      url: "/superadmin/analytics",
      icon: ChartArea,
      role: "superadmin",
    },
    {
      title: "Settings",
      url: "/superadmin/settings",
      icon: Settings,
      role: "superadmin",
    },
  ],
};

const filteredNavItems = data.navMain.filter(
  (item) => item.role === fetchedMockedUser.role
);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          role={fetchedMockedUser.role}
          branches={fetchedMockedUser.branches}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={fetchedMockedUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
