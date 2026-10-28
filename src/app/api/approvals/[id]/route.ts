import { NextResponse } from "next/server";
import { decideApproval } from "@/lib/sandbox/engine";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  const decision = body.decision === "rejected" ? "rejected" : "approved";
  const result = await decideApproval(id, decision);
  return NextResponse.json(result.body, { status: result.status });
}
