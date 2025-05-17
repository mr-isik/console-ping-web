import { notFound } from "next/navigation";
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
import { Clipboard, Settings, ArrowRight } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

// Types based on Prisma schema
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

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  // TODO: Replace with actual API call to get project by ID
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
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
        <p className="text-muted-foreground">Project ID: {project.id}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Log Status</CardTitle>
            <CardDescription>Total log count and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{logCount}</div>
            <p className="text-xs text-muted-foreground">total logs</p>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Link
              href={`/dashboard/projects/${project.id}/logs`}
              className="w-full"
            >
              <Button variant="outline" className="w-full justify-between">
                View logs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">API Key</CardTitle>
            <CardDescription>API key for your project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="break-all rounded-md bg-muted font-mono text-sm p-2">
              {project.apiKey.substring(0, 12)}...
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Link
              href={`/dashboard/projects/${project.id}/api-key`}
              className="w-full"
            >
              <Button variant="outline" className="w-full justify-between">
                Manage API key
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Project Information</CardTitle>
            <CardDescription>Basic project details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Created on
                </span>
                <span className="text-sm">{formattedCreatedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Last updated
                </span>
                <span className="text-sm">{lastUpdated}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="text-xs text-muted-foreground w-full text-center">
              Created {timeAgo}
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Logs</CardTitle>
              <Link href={`/dashboard/projects/${project.id}/logs`}>
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Placeholder for recent logs - you could add a subset of logs here */}
              <p className="text-sm text-muted-foreground">
                Recent logs will be displayed here
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Quick Links</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Link href={`/dashboard/projects/${project.id}/logs`}>
                <Button variant="outline" className="w-full justify-start">
                  <Clipboard className="mr-2 h-4 w-4" />
                  Log Viewer
                </Button>
              </Link>
              <Link href={`/dashboard/projects/${project.id}/api-key`}>
                <Button variant="outline" className="w-full justify-start">
                  <Clipboard className="mr-2 h-4 w-4" />
                  API Key
                </Button>
              </Link>
              <Link href={`/dashboard/projects/${project.id}/settings`}>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Project Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Mock function - replace with actual API call
async function getProjectById(id: string): Promise<Project | null> {
  // TODO: Replace with API call to get project by ID

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockProjects = [
    {
      id: "project-1",
      name: "Web Dashboard",
      apiKey: "api_key_12345",
      userId: "user-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60),
      _count: {
        logs: 128,
      },
    },
    {
      id: "project-2",
      name: "Mobile App",
      apiKey: "api_key_67890",
      userId: "user-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      _count: {
        logs: 76,
      },
    },
    {
      id: "project-3",
      name: "API Service",
      apiKey: "api_key_abcde",
      userId: "user-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30),
      _count: {
        logs: 43,
      },
    },
  ];

  const project = mockProjects.find((p) => p.id === id);
  return project || null;
}
