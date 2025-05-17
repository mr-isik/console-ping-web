import { NextResponse } from "next/server";

// Mock logs data - would be replaced with actual database calls
const mockLogs = {
  "project-1": [
    {
      id: "log-1",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      level: "info",
      message: "User logged in",
      metadata: { userId: "user-123", ip: "192.168.1.1" },
      projectId: "project-1",
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      level: "error",
      message: "Failed to connect to database",
      metadata: { error: "Connection timeout" },
      projectId: "project-1",
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      level: "warn",
      message: "High memory usage detected",
      metadata: { memoryUsage: "85%" },
      projectId: "project-1",
    },
    {
      id: "log-4",
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      level: "info",
      message: "Application started",
      metadata: { version: "1.0.0" },
      projectId: "project-1",
    },
  ],
  "project-2": [
    {
      id: "log-5",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      level: "error",
      message: "API request failed",
      metadata: { endpoint: "/api/users", status: 500 },
      projectId: "project-2",
    },
    {
      id: "log-6",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      level: "info",
      message: "User registered",
      metadata: { userId: "user-456", email: "user@example.com" },
      projectId: "project-2",
    },
  ],
  "project-3": [
    {
      id: "log-7",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      level: "warn",
      message: "Rate limit approaching",
      metadata: { limit: "100/min", current: "85/min" },
      projectId: "project-3",
    },
  ],
};

// Helper function to get logs for a project
function getProjectLogs(projectId: string) {
  return mockLogs[projectId as keyof typeof mockLogs] || [];
}

// GET logs for a project
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const level = url.searchParams.get("level");
    const page = parseInt(url.searchParams.get("page") || "1");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    let logs = getProjectLogs(params.id);

    // Filter by level if specified
    if (level) {
      logs = logs.filter((log) => log.level === level);
    }

    // Sort by timestamp (newest first)
    logs = logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedLogs = logs.slice(startIndex, endIndex);

    return NextResponse.json({
      logs: paginatedLogs,
      pagination: {
        total: logs.length,
        page,
        limit,
        pages: Math.ceil(logs.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

// POST to create a new log entry (for internal use/testing only)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validation
    if (!body.message) {
      return NextResponse.json(
        { error: "Log message is required" },
        { status: 400 }
      );
    }

    // Create a new log entry
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      level: body.level || "info",
      message: body.message,
      metadata: body.metadata || {},
      projectId: params.id,
    };

    // In a real app, you would save this to the database
    // For our mock data, we'll add it to the array if it exists
    if (mockLogs[params.id as keyof typeof mockLogs]) {
      (mockLogs[params.id as keyof typeof mockLogs] as any).push(newLog);
    } else {
      (mockLogs as any)[params.id] = [newLog];
    }

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error("Error creating log:", error);
    return NextResponse.json(
      { error: "Failed to create log" },
      { status: 500 }
    );
  }
}
