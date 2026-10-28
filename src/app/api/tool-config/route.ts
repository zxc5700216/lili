import { NextResponse } from "next/server";
import { BUY_LINKS, PROVIDERS, type ProviderId } from "@/lib/tool-config/providers";
import { loadConfig, maskConfig, mergeProvider } from "@/lib/tool-config/store";

export async function GET() {
  return NextResponse.json({ providers: PROVIDERS, buy: BUY_LINKS, values: maskConfig(loadConfig()) });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const id = String(body.id || "") as ProviderId;
  if (!PROVIDERS.some((item) => item.id === id)) {
    return NextResponse.json({ ok: false, message: "未知工具" }, { status: 400 });
  }
  mergeProvider(id, body.fields ?? {});
  return NextResponse.json({ ok: true, values: maskConfig(loadConfig()) });
}
