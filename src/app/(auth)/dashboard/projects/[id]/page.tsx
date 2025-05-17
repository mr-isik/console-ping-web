import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectSettings from "./components/project-settings";
import ProjectLogs from "./components/project-logs";
import ProjectApiKey from "./components/project-api-key";

interface ProjectDetailPageProps {
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

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  // TODO: Replace with actual API call to get project by ID
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="text-muted-foreground">Project ID: {project.id}</p>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="api-key">API Key</TabsTrigger>
        </TabsList>
        <TabsContent value="logs" className="space-y-4">
          <Suspense fallback={<p>Loading logs...</p>}>
            <ProjectLogs projectId={project.id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <ProjectSettings project={project} />
        </TabsContent>
        <TabsContent value="api-key" className="space-y-4">
          <ProjectApiKey project={project} />
        </TabsContent>
      </Tabs>
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
