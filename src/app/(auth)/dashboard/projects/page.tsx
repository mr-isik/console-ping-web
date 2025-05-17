import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

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

export default async function ProjectsPage() {
  // TODO: Replace with actual API call
  const projects = await getMockProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <Link href="/dashboard/projects/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={projects} />
    </div>
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
