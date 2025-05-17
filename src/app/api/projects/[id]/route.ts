import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../generated/prisma";
// GET a specific project
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();

  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// DELETE a project
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();

  try {
    const { id } = await params;

    const project = await prisma.project.delete({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // In a real app, you would delete from the database
    // Here we're just simulating the response

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
