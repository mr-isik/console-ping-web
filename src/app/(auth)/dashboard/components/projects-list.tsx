import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

export default async function ProjectsList() {
  // TODO: Replace with actual API call
  const projects: Project[] = await getMockProjects();

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">No projects yet</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Get started by creating your first project
        </p>
        <Link href="/dashboard/projects/new">
          <Button>Create Project</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
      {projects.length > 0 && (
        <div className="text-center">
          <Link href="/dashboard/projects">
            <Button variant="link" className="gap-1">
              View all projects
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function ProjectItem({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden transition-all hover:bg-accent/50">
      <Link href={`/dashboard/projects/${project.id}`}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{project.name}</span>
                {project._count && (
                  <Badge variant="secondary" className="text-xs">
                    {project._count.logs} logs
                  </Badge>
                )}
              </div>
              <div className="flex text-xs text-muted-foreground">
                <span>
                  Created{" "}
                  {formatDistanceToNow(new Date(project.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <div>
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

// Mock function - replace with actual API call
async function getMockProjects(): Promise<Project[]> {
  // TODO: Replace with API call to get projects
  return [
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
}
