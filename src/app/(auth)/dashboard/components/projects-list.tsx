import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Clock, PlusCircle } from "lucide-react";
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
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
      {projects.length > 0 && (
        <Link
          href="/dashboard/projects"
          className="flex items-center justify-center rounded-lg border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
        >
          <Button variant="ghost" className="gap-1">
            View all projects
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}

function ProjectItem({ project }: { project: Project }) {
  // Format the creation time
  const timeAgo = formatDistanceToNow(new Date(project.createdAt), {
    addSuffix: true,
  });
  const logCount = project._count?.logs || 0;

  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <Card className="overflow-hidden transition-all hover:bg-accent/50 hover:shadow-sm">
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{timeAgo}</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs font-normal">
                {logCount} logs
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
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
