import { NewProjectForm } from "../components/new-project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
        <p className="text-muted-foreground">
          Create a new project to start logging events
        </p>
      </div>

      <NewProjectForm />
    </div>
  );
}
