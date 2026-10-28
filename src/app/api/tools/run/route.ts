import { NextResponse } from "next/server";
import { runTool } from "@/lib/sandbox/engine";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "");
  const input = (body.input ?? {}) as Record<string, unknown>;
  const result = await runTool(name, input, body.storeId);
  return NextResponse.json(result.body, { status: result.status });
}
