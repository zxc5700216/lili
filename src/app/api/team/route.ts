import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  if (body.action === "invite") {
    const email = String(body.email || "").slice(0, 120);
    await prisma.teamMember.create({
      data: {
        id: randomUUID(),
        name: email.split("@")[0] || "colleague",
        email,
        role: "member",
        status: "invited",
        lastSeen: "Invited",
      },
    });
  }
  if (body.action === "rename") {
    await prisma.teamMember.update({
      where: { id: String(body.id) },
      data: { name: String(body.name || "").slice(0, 80) },
    });
  }
  return NextResponse.json({ ok: true });
}
