import { NextResponse } from "next/server";
import { getLocale } from "@/lib/locale";
import { runWorkflow } from "@/lib/sandbox/report";

export async function POST(request: Request) {
  const body = await request.json();
  const locale = await getLocale();
  const result = await runWorkflow(String(body.slug || ""), body.storeId, locale);
  return NextResponse.json(result.body, { status: result.status });
}
