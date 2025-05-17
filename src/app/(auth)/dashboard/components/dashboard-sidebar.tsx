"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard, LogOut, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

const routes = [
  {
    label: "Logs",
    icon: Home,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: LayoutDashboard,
    href: "/dashboard/projects",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="floating">
      <SidebarHeader className="pl-2 ml-2">
        <Link href="/dashboard" className="text-lg font-bold">
          ConsolePing
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="space-y-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  pathname === route.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <route.icon className={cn("mr-2 h-4 w-4")} />
                {route.label}
              </Link>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start px-3 py-2 text-sm font-medium"
          asChild
        >
          <Link href="/auth/logout">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
