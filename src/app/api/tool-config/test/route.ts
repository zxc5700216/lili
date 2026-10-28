import { NextResponse } from "next/server";
import { PROVIDERS, type ProviderId } from "@/lib/tool-config/providers";
import { testProvider } from "@/lib/tool-config/test-connection";

export async function POST(request: Request) {
  const body = await request.json();
  const id = String(body.id || "") as ProviderId;
  if (!PROVIDERS.some((item) => item.id === id)) {
    return NextResponse.json({ ok: false, message: "未知工具" }, { status: 400 });
  }
  const result = await testProvider(id);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
