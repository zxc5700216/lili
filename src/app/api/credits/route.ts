import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const yuan = Math.round(Number(body.yuan) || 0);
  if (yuan < 5) {
    return NextResponse.json({ ok: false, message: "Minimum is ¥5." }, { status: 400 });
  }
  const credits = yuan * 10;
  const stamp = new Date();
  const code = `ORD-${stamp.toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 12).toUpperCase()}`;
  await prisma.creditOrder.create({
    data: { id: randomUUID(), code, credits, amountCny: yuan, status: "credited", createdAt: stamp },
  });
  await prisma.appSetting.update({
    where: { id: "default" },
    data: { credits: { increment: credits }, toppedUp: true },
  });
  return NextResponse.json({ ok: true, credits, code });
}
