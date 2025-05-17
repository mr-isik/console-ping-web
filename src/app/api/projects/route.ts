import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import { z } from "zod";
// GET all projects
export async function GET({
  params,
}: {
  request: Request;
  params: {
    page: number;
    limit: number;
  };
}) {
  const prisma = new PrismaClient();

  try {
    const { page = 1, limit = 10 } = params;
    const projects = await prisma.project.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

const projectSchema = z.object({
  name: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = projectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }
    const prisma = new PrismaClient();
    const newProject = await prisma.project.create({
      data: {
        name: result.data.name,
        apiKey: `api_key_${Math.random().toString(36).substring(2, 10)}`,
        userId: "user-1",
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create project",
      },
      { status: 500 }
    );
  }
}
