import { ReactNode } from "react";
import { DashboardSidebar } from "./components/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="container md:pt-12">{children}</main>
    </SidebarProvider>
  );
}
