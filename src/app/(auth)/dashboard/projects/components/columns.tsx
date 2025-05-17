"use client";

import { formatDistanceToNow } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ExternalLink, Copy, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Types based on Prisma schema
export interface Project {
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

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <Link
          href={`/dashboard/projects/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {row.getValue("name")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "apiKey",
    header: "API Key",
    cell: ({ row }) => {
      const apiKey = row.getValue("apiKey") as string;
      const masked = `${apiKey.substring(0, 4)}...${apiKey.substring(
        apiKey.length - 4
      )}`;

      return (
        <div className="flex items-center gap-2">
          <code className="rounded bg-muted px-2 py-1 text-xs">{masked}</code>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              navigator.clipboard.writeText(apiKey);
              // TODO: Show toast notification
            }}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy API key</span>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "_count.logs",
    header: "Logs",
    cell: ({ row }) => {
      const count = row.original._count?.logs || 0;
      return (
        <Badge variant="secondary" className="text-xs">
          {count} logs
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(date, { addSuffix: true })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/projects/${project.id}/logs`}
                className="flex items-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>View Logs</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(project.apiKey);
                // TODO: Show toast notification
              }}
              className="flex items-center"
            >
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy API Key</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
