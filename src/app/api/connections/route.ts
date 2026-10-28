import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const now = new Date();
  await prisma.aiConnection.create({
    data: {
      id: randomUUID(),
      name: String(body.name || "Connection").slice(0, 80),
      client: String(body.client || "codex"),
      allowMarketResearch: false,
      allowAiExecute: false,
      connectedAt: now,
      lastUsedAt: now,
    },
  });
  await prisma.appSetting.update({ where: { id: "default" }, data: { aiConnected: true } });
  return NextResponse.json({ ok: true });
}
