import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runTool } from "@/lib/sandbox/engine";
import { isSellfoxConfigured } from "@/lib/sellfox/db";

export async function GET() {
  const tools = await prisma.toolDef.findMany({ orderBy: { name: "asc" } });
  const sellfox = isSellfoxConfigured();
  return NextResponse.json({
    sandbox: !sellfox,
    source: sellfox ? "sellfox" : "sandbox",
    message: sellfox
      ? "StudyLab MCP reads Sellfox tables from amazon_bulk_ad when mapped tools are called. Not listingapp.duobaoyu.ai."
      : "Local study MCP. Not listingapp.duobaoyu.ai.",
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const id = body.id ?? null;
  if (body.method === "initialize") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: { protocolVersion: "2025-06-18", serverInfo: { name: "lili", version: "0.1.0" }, capabilities: { tools: {} } },
    });
  }
  if (body.method === "tools/list") {
    const tools = await prisma.toolDef.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        tools: tools.map((tool) => ({ name: tool.name, description: tool.description, inputSchema: tool.inputSchema })),
      },
    });
  }
  if (body.method === "tools/call") {
    const name = String(body.params?.name || "");
    const args = (body.params?.arguments ?? {}) as Record<string, unknown>;
    const result = await runTool(name, args, null);
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: { content: [{ type: "text", text: JSON.stringify(result.body) }], isError: result.status >= 400 },
    });
  }
  return NextResponse.json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
}
