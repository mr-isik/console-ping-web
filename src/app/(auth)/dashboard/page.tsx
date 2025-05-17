import { Suspense } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import RecentLogsList from "./components/recent-logs-list";
import ProjectsList from "./components/projects-list";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/dashboard/projects/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
            <CardDescription>
              View your most recent logs across all projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p>Loading recent logs...</p>}>
              <RecentLogsList />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>Manage and monitor your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p>Loading projects...</p>}>
              <ProjectsList />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
