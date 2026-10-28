import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [tools, skills, workflows, stores] = await Promise.all([
    prisma.toolDef.count(),
    prisma.skill.count(),
    prisma.workflowTemplate.count(),
    prisma.store.count(),
  ]);
  return NextResponse.json({ ok: true, tools, skills, workflows, stores });
}
