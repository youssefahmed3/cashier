"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Box,
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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  branches: [
    {
      name: "Branch 1",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Branch 2",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Branch 3",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/tenant/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Employees",
      url: "/tenant/employees",
      icon: Users,
      isActive: true,
    },
    {
      title: "Inventory",
      url: "/tenant/inventory",
      icon: Box,
      /* items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ], */
    },
    {
      title: "Products",
      url: "/tenant/products",
      icon: Box,
      isActive: true,
    },

    {
      title: "Settings",
      url: "/tenant/settings",
      icon: Settings,
      /* items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ], */
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher branches={data.branches} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
