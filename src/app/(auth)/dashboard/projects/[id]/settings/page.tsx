import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectSettings from "../components/project-settings";

interface ProjectSettingsPageProps {
  params: {
    id: string;
  };
}

// Types based on Prisma schema
interface Project {
  id: string;
  name: string;
  apiKey: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default async function ProjectSettingsPage({
  params,
}: ProjectSettingsPageProps) {
  // TODO: Replace with actual API call to get project by ID
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/projects/${project.id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {project.name} / Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Edit project settings
            </p>
          </div>
        </div>
      </div>

      <ProjectSettings project={project} />
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
    },
    {
      id: "project-2",
      name: "Mobile App",
      apiKey: "api_key_67890",
      userId: "user-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      id: "project-3",
      name: "API Service",
      apiKey: "api_key_abcde",
      userId: "user-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  ];

  const project = mockProjects.find((p) => p.id === id);
  return project || null;
}
