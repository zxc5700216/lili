import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  await prisma.feedbackNote.create({
    data: {
      id: randomUUID(),
      kind: String(body.kind || "other"),
      body: String(body.body || "").slice(0, 4000),
      contact: String(body.contact || "").slice(0, 200),
    },
  });
  return NextResponse.json({ ok: true });
}
