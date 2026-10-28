import { TeamView } from "@/components/team-view";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const locale = await getLocale();
  const members = await prisma.teamMember.findMany({ orderBy: { role: "asc" } });
  return <TeamView locale={locale} members={members} />;
}
