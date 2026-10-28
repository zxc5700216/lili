import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  await prisma.aiConnection.update({
    where: { id },
    data: {
      ...(typeof body.allowMarketResearch === "boolean" ? { allowMarketResearch: body.allowMarketResearch } : {}),
      ...(typeof body.allowAiExecute === "boolean" ? { allowAiExecute: body.allowAiExecute } : {}),
      ...(body.name ? { name: String(body.name).slice(0, 80) } : {}),
      lastUsedAt: new Date(),
    },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await prisma.aiConnection.delete({ where: { id } });
  const left = await prisma.aiConnection.count();
  await prisma.appSetting.update({ where: { id: "default" }, data: { aiConnected: left > 0 } });
  return NextResponse.json({ ok: true });
}
