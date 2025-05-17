import { Suspense } from "react";
import Link from "next/link";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import RecentLogsList from "./components/recent-logs-list";
import ProjectsList from "./components/projects-list";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/dashboard/projects/new">
          <Button>
            <PlusCircle className="h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <CardTitle className="text-base">Recent Logs</CardTitle>
          <CardDescription className="text-xs mb-4">
            View your most recent logs across all projects
          </CardDescription>

          <Suspense
            fallback={
              <p className="text-center text-muted-foreground text-sm">
                Loading recent logs...
              </p>
            }
          >
            <RecentLogsList />
          </Suspense>
        </div>

        <div>
          <CardTitle className="text-base">Your Projects</CardTitle>
          <CardDescription className="text-xs mb-4">
            Manage and monitor your projects
          </CardDescription>
          <Suspense
            fallback={
              <p className="text-center text-muted-foreground text-sm">
                Loading projects...
              </p>
            }
          >
            <ProjectsList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
