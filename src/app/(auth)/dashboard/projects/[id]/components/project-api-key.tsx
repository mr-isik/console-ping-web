"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Types based on Prisma schema
interface Project {
  id: string;
  name: string;
  apiKey: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProjectApiKey({ project }: { project: Project }) {
  const router = useRouter();
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const toggleKeyVisibility = () => {
    setIsKeyVisible(!isKeyVisible);
  };

  async function handleRegenerateApiKey() {
    try {
      setIsRegenerating(true);

      // TODO: Replace with actual API call to regenerate API key
      console.log("Regenerating API key for project:", project.id);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.refresh();
      // TODO: Show success toast
    } catch (error) {
      console.error("Error regenerating API key:", error);
      // TODO: Show error toast
    } finally {
      setIsRegenerating(false);
    }
  }

  const displayKey = isKeyVisible ? project.apiKey : "•".repeat(24);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Key</CardTitle>
          <CardDescription>
            Your API key is used to authenticate your project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                readOnly
                value={displayKey}
                className="pr-20 font-mono text-sm"
              />
              <div className="absolute right-1 top-1 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={toggleKeyVisibility}
                >
                  {isKeyVisible ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                  <span className="sr-only">
                    {isKeyVisible ? "Hide API key" : "Show API key"}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    navigator.clipboard.writeText(project.apiKey);
                    // TODO: Show toast notification
                  }}
                >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy API key</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Regenerate API Key</h4>
            <p className="text-sm text-muted-foreground">
              If your API key has been compromised, you can generate a new one.
              All services using the current key will need to be updated.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="mt-2">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate API Key
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will generate a new API key for your project. The
                    current key will be invalidated immediately and any services
                    using it will stop working until updated with the new key.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isRegenerating}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleRegenerateApiKey();
                    }}
                    disabled={isRegenerating}
                  >
                    {isRegenerating && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Regenerate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
          <CardDescription>
            How to use your API key in your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Node.js</h4>
            <pre className="rounded-md bg-muted p-4 overflow-auto text-sm">
              <code>
                {`// Install the SDK
npm install console-ping

// Initialize in your app
import { ConsolePing } from 'console-ping';

const logger = new ConsolePing({
  apiKey: '${project.apiKey}'
});

// Log events
logger.info('User logged in', { userId: 'user123' });
logger.error('Payment failed', { orderId: 'order456', error: 'Insufficient funds' });`}
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
