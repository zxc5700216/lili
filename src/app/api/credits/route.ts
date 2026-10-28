import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const credits = Math.max(0, Math.min(10000, Number(body.credits) || 0));
  await prisma.appSetting.update({
    where: { id: "default" },
    data: { credits: { increment: credits }, toppedUp: true },
  });
  return NextResponse.json({ ok: true, credits });
}
