import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      name: "Console Ping API",
      version: "1.0.0",
    },
    { status: 200 }
  );
}
