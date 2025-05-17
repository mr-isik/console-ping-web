"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronRight,
  Clock,
  PlusCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fetcher } from "@/lib/axios";
import { Project } from "../../../../../generated/prisma";

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const { data } = await fetcher("/projects");
        setProjects(data);
        setError(null);
      } catch (err) {
        setError("Failed to load projects. Please try again later.");
        console.error("Error fetching projects:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Loader2 className="h-6 w-6 text-primary animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <AlertCircle className="h-6 w-6 text-destructive mb-2" />
        <h3 className="mb-2 text-lg font-semibold">Error</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

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
      {projects.map((project: Project) => (
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
  /* @ts-expect-error logs is not typed */
  const logCount = project?.logs?.length || 0;

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
