"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Terminal,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/axios";

// Types based on Prisma schema
interface Log {
  id: string;
  message: string;
  level: string;
  meta: Record<string, unknown>;
  projectId: string;
  project: {
    name: string;
  };
  createdAt: Date;
}

export default function RecentLogsList() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, you would fetch from API
        // For now, we're using the mock function but in a client component
        const response = await fetcher("/logs"); // Update with the correct endpoint
        setLogs(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load logs. Please try again later.");
        console.error("Error fetching logs:", err);
        // Fallback to mock data in case of error for demo purposes
        setLogs(getMockRecentLogs());
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Loader2 className="h-6 w-6 text-primary animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading logs...</p>
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

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">No logs found</h3>
        <p className="text-sm text-muted-foreground">
          Logs will appear here when your applications start sending them
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {logs.map((log) => (
        <LogItem key={log.id} log={log} />
      ))}
      <Link
        href="/dashboard/logs"
        className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors mt-4"
      >
        View all logs →
      </Link>
    </div>
  );
}

function LogItem({ log }: { log: Log }) {
  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "debug":
        return <Terminal className="h-4 w-4 text-muted-foreground" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const getBadgeVariant = (
    level: string
  ): "destructive" | "secondary" | "outline" | "default" => {
    switch (level.toLowerCase()) {
      case "error":
        return "destructive";
      case "info":
        return "secondary";
      case "debug":
        return "outline";
      default:
        return "default";
    }
  };

  const getBadgeStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "warning":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "info":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "debug":
        return "bg-slate-500/10 text-slate-700 border-slate-500/20";
      default:
        return "bg-green-500/10 text-green-700 border-green-500/20";
    }
  };

  const timeAgo = formatDistanceToNow(new Date(log.createdAt), {
    addSuffix: true,
  });

  return (
    <Link href={`/dashboard/projects/${log.projectId}/logs`}>
      <Card className="overflow-hidden transition-all hover:bg-accent/50 hover:shadow-sm">
        <CardContent>
          <div className="flex items-start gap-3">
            <div className="mt-1">{getLevelIcon(log.level)}</div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2">
                <Badge
                  variant={getBadgeVariant(log.level)}
                  className={`${getBadgeStyle(
                    log.level
                  )} px-1.5 py-0 h-5 font-medium`}
                >
                  {log.level}
                </Badge>
                <Link
                  href={`/dashboard/projects/${log.projectId}`}
                  className="text-xs font-medium text-muted-foreground hover:text-primary"
                >
                  {log.project.name}
                </Link>
                <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                  {timeAgo}
                </span>
              </div>
              <p className="text-sm font-medium break-words line-clamp-2">
                {log.message}
              </p>
              {Object.keys(log.meta).length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {Object.entries(log.meta)
                    .slice(0, 3)
                    .map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                      >
                        <span className="font-medium">{key}:</span>{" "}
                        {String(value).substring(0, 20)}
                        {String(value).length > 20 ? "..." : ""}
                      </span>
                    ))}
                  {Object.keys(log.meta).length > 3 && (
                    <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      +{Object.keys(log.meta).length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Mock function - replace with actual API call
function getMockRecentLogs(): Log[] {
  // This is now a synchronous function since we're using it as a fallback
  return [
    {
      id: "1",
      message: "Application started successfully with all dependencies loaded",
      level: "info",
      meta: { service: "api", instance: "worker-1" },
      projectId: "project-1",
      project: { name: "Web Dashboard" },
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      message: "Database connection failed after multiple retries",
      level: "error",
      meta: { service: "db", error: "Connection timeout", retries: 3 },
      projectId: "project-2",
      project: { name: "Mobile App" },
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "3",
      message: "User authentication attempt from unknown IP address",
      level: "warning",
      meta: { userId: "user-123", ip: "192.168.1.1", attempts: 3 },
      projectId: "project-1",
      project: { name: "Web Dashboard" },
      createdAt: new Date(Date.now() - 1000 * 60 * 120),
    },
  ];
}
