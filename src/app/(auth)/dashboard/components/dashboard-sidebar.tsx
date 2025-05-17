"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Projects",
    icon: LayoutDashboard,
    href: "/dashboard/projects",
    color: "text-violet-500",
  },
  {
    label: "Analytics",
    icon: BarChart,
    href: "/dashboard/analytics",
    color: "text-pink-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-orange-500",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[240px] flex-col border-r bg-background">
      <ScrollArea className="flex-1 px-3">
        <div className="flex h-14 items-center border-b px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <span className="text-xl font-bold">Console Ping</span>
          </Link>
        </div>
        <div className="space-y-2 py-4">
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
              <route.icon className={cn("mr-2 h-5 w-5", route.color)} />
              {route.label}
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto border-t p-3">
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
      </div>
    </div>
  );
}
