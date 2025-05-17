import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

// Types based on Prisma schema
interface Log {
  id: string;
  message: string;
  level: string;
  meta: Record<string, any>;
  projectId: string;
  project: {
    name: string;
  };
  createdAt: Date;
}

export default async function RecentLogsList() {
  // TODO: Replace with actual API call
  const logs: Log[] = await getMockRecentLogs();

  if (logs.length === 0) {
    return (
      <div className="text-center text-muted-foreground">No logs found.</div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <LogItem key={log.id} log={log} />
      ))}
    </div>
  );
}

function LogItem({ log }: { log: Log }) {
  const getBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return "destructive";
      case "warning":
        return "warning";
      case "info":
        return "secondary";
      case "debug":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant={getBadgeVariant(log.level)}>{log.level}</Badge>
              <span className="text-xs text-muted-foreground">
                {log.project.name}
              </span>
            </div>
            <p className="break-words text-sm">{log.message}</p>
            {Object.keys(log.meta).length > 0 && (
              <div className="text-xs text-muted-foreground">
                {Object.entries(log.meta)
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <span key={key} className="mr-2">
                      {key}: {String(value)}
                    </span>
                  ))}
                {Object.keys(log.meta).length > 3 && "..."}
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock function - replace with actual API call
async function getMockRecentLogs(): Promise<Log[]> {
  // TODO: Replace with API call to get recent logs
  return [
    {
      id: "1",
      message: "Application started successfully",
      level: "info",
      meta: { service: "api", instance: "worker-1" },
      projectId: "project-1",
      project: { name: "Web Dashboard" },
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      message: "Database connection failed",
      level: "error",
      meta: { service: "db", error: "Connection timeout" },
      projectId: "project-2",
      project: { name: "Mobile App" },
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "3",
      message: "User authentication attempt",
      level: "warning",
      meta: { userId: "user-123", ip: "192.168.1.1", attempts: 3 },
      projectId: "project-1",
      project: { name: "Web Dashboard" },
      createdAt: new Date(Date.now() - 1000 * 60 * 120),
    },
  ];
}
