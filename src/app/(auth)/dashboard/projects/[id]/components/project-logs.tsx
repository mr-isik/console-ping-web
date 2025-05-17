"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import {
  Filter,
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Download,
} from "lucide-react";

// Types based on Prisma schema
interface Log {
  id: string;
  message: string;
  level: string;
  meta: Record<string, any>;
  projectId: string;
  createdAt: Date;
}

interface ProjectLogsProps {
  projectId: string;
}

export default function ProjectLogs({ projectId }: ProjectLogsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Get the current page from the URL or default to 1
  const currentPage = Number(searchParams.get("page") || "1");

  // TODO: Replace with actual API call to get logs with pagination and filters
  const { logs, totalPages } = useMockLogs(
    projectId,
    currentPage,
    searchQuery,
    selectedLevel
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query and reset to page 1
    // TODO: Implement with real API
    console.log("Searching for:", searchQuery);
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level === "all" ? null : level);
    // TODO: Update URL with level filter and reset to page 1
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedLevel(null);
    // TODO: Update URL to remove all filters
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-8 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-9 w-9 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </form>
          <Select
            value={selectedLevel || "all"}
            onValueChange={handleLevelChange}
          >
            <SelectTrigger className="w-[120px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="All Levels" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || selectedLevel) && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Options</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Log Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Logs (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Logs (JSON)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">No logs found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || selectedLevel
                ? "Try changing your search or filter criteria"
                : "Start sending logs to see them here"}
            </p>
          </div>
        ) : (
          logs.map((log) => <LogItem key={log.id} log={log} />)
        )}
      </div>

      {logs.length > 0 && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${Math.max(1, currentPage - 1)}`}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              // Only show a subset of pages if there are many
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href={`?page=${page}`}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <PaginationItem key={page}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                href={`?page=${Math.min(totalPages, currentPage + 1)}`}
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

function LogItem({ log }: { log: Log }) {
  const [isExpanded, setIsExpanded] = useState(false);

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
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={getBadgeVariant(log.level) as any}>
                  {log.level}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="break-words text-sm">{log.message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
              <span className="sr-only">
                {isExpanded ? "Collapse" : "Expand"}
              </span>
            </Button>
          </div>

          {isExpanded && Object.keys(log.meta).length > 0 && (
            <div className="rounded-md bg-muted p-3">
              <pre className="text-xs overflow-auto">
                <code>{JSON.stringify(log.meta, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Mock function - replace with actual API call
function useMockLogs(
  projectId: string,
  page: number,
  searchQuery?: string,
  level?: string | null
): { logs: Log[]; totalPages: number } {
  // TODO: Replace with API call to get logs

  // Create some mock logs
  const mockLogs: Log[] = [
    {
      id: "log-1",
      message: "Application started successfully",
      level: "info",
      meta: { service: "api", instance: "worker-1" },
      projectId,
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "log-2",
      message: "Database connection failed",
      level: "error",
      meta: {
        service: "db",
        error: "Connection timeout",
        stack:
          "Error: Connection timeout\n  at Database.connect (/app/db.js:25:7)",
      },
      projectId,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "log-3",
      message: "User authentication attempt",
      level: "warning",
      meta: { userId: "user-123", ip: "192.168.1.1", attempts: 3 },
      projectId,
      createdAt: new Date(Date.now() - 1000 * 60 * 120),
    },
    {
      id: "log-4",
      message: "Image upload completed",
      level: "info",
      meta: { fileId: "img-456", size: "2.4MB", type: "image/jpeg" },
      projectId,
      createdAt: new Date(Date.now() - 1000 * 60 * 240),
    },
    {
      id: "log-5",
      message: "API rate limit reached",
      level: "warning",
      meta: {
        endpoint: "/api/users",
        client: "mobile-app",
        limit: 100,
        period: "1 minute",
      },
      projectId,
      createdAt: new Date(Date.now() - 1000 * 60 * 360),
    },
    {
      id: "log-6",
      message: "Debug output from service worker",
      level: "debug",
      meta: { cache: "miss", url: "/assets/main.js", size: 245889 },
      projectId,
      createdAt: new Date(Date.now() - 1000 * 60 * 480),
    },
  ];

  // Apply filters
  let filteredLogs = [...mockLogs];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredLogs = filteredLogs.filter(
      (log) =>
        log.message.toLowerCase().includes(query) ||
        JSON.stringify(log.meta).toLowerCase().includes(query)
    );
  }

  if (level) {
    filteredLogs = filteredLogs.filter(
      (log) => log.level.toLowerCase() === level.toLowerCase()
    );
  }

  // Calculate pagination
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const safePageNumber = Math.min(Math.max(1, page), totalPages);

  // Get the logs for the current page
  const paginatedLogs = filteredLogs.slice(
    (safePageNumber - 1) * pageSize,
    safePageNumber * pageSize
  );

  return { logs: paginatedLogs, totalPages };
}
