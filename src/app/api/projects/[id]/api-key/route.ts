import { NextResponse } from "next/server";

// Mock database - would be replaced with actual database calls
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

// Helper function to find a project by ID
function findProject(id: string) {
  return mockProjects.find((project) => project.id === id);
}

// GET the API key for a project
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const project = findProject(params.id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ apiKey: project.apiKey });
  } catch (error) {
    console.error("Error fetching API key:", error);
    return NextResponse.json(
      { error: "Failed to fetch API key" },
      { status: 500 }
    );
  }
}

// POST to regenerate a new API key
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = findProject(params.id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Generate a new API key
    const newApiKey = `api_key_${Math.random().toString(36).substring(2, 10)}`;

    // In a real app, you would save changes to the database
    project.apiKey = newApiKey;
    project.updatedAt = new Date();

    return NextResponse.json({ apiKey: newApiKey });
  } catch (error) {
    console.error("Error regenerating API key:", error);
    return NextResponse.json(
      { error: "Failed to regenerate API key" },
      { status: 500 }
    );
  }
}
