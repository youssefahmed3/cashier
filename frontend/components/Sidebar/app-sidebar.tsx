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
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types/types";

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
      title: "Products",
      url: "/tenant/products",
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
  const { user } = useAuth();

  if (!user) return null; // Or a skeleton/loading UI

  const filteredNavItems = data.navMain.filter((item) =>
    item.role.some((r) => user?.roles.includes(r))
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          role={user?.roles?.[0] ?? "admin"} // fallback to a safe default
          branches={fetchedMockedUser.branches}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
