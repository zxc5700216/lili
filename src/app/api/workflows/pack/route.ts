import { NextResponse } from "next/server";
import { MissingConfigError } from "@/lib/tool-config/test-connection";
import { runWorkflowPack } from "@/lib/workflows/pack";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const slug = String(body.slug || "");
  const mode = body.mode === "live" ? "live" : "fixture";
  try {
    const result = await runWorkflowPack(slug, mode);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof MissingConfigError) {
      return NextResponse.json({ ok: false, missing: error.missing, message: error.message }, { status: 409 });
    }
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "失败" }, { status: 400 });
  }
}
