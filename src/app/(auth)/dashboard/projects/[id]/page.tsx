"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clipboard,
  Settings,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { fetcher } from "@/lib/axios";

interface Project {
  id: string;
  name: string;
  apiKey: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    logs: number;
  };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const { data } = await fetcher.get(`/projects/${id}`);
        setProject(data);
        setError(null);
      } catch (err) {
        setError("Project not found");
        console.error("Error fetching project:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <AlertCircle className="h-8 w-8 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p className="text-muted-foreground mb-4">
          {error || "Project not found"}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const logCount = project._count?.logs || 0;
  const formattedCreatedDate = format(new Date(project.createdAt), "PPP");
  const timeAgo = formatDistanceToNow(new Date(project.createdAt), {
    addSuffix: true,
  });
  const lastUpdated = formatDistanceToNow(new Date(project.updatedAt), {
    addSuffix: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <Link href={`/dashboard/projects/${project.id}/settings`}>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Created {timeAgo} • Last updated {lastUpdated}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Logs</CardTitle>
            <CardDescription className="text-sm">
              Total logs for this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logCount}</div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href={`/dashboard/projects/${project.id}/logs`}>
              <Button variant="ghost" size="sm" className="gap-1">
                View logs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <CardDescription className="text-sm">
              When this project was created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedCreatedDate}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API Key</CardTitle>
            <CardDescription className="text-sm">
              Secure key for sending logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono truncate">••••••••••••••••</div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href={`/dashboard/projects/${project.id}/api-key`}>
              <Button variant="ghost" size="sm" className="gap-1">
                <Clipboard className="h-4 w-4" />
                Manage API Key
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
