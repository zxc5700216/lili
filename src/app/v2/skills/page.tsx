import { SkillGrid } from "@/components/skill-grid";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const locale = await getLocale();
  const rows = await prisma.skill.findMany({ orderBy: [{ sort: "asc" }, { nameEn: "asc" }] });
  return (
    <SkillGrid
      locale={locale}
      items={rows.map((row) => ({
        slug: row.slug,
        nameZh: row.nameZh,
        nameEn: row.nameEn,
        category: row.category,
        summaryZh: row.summaryZh,
        summaryEn: row.summaryEn,
        promptZh: row.promptZh,
        promptEn: row.promptEn,
        stepsZh: row.stepsZh as string[],
        stepsEn: row.stepsEn as string[],
        tools: row.relatedTools as string[],
        featured: row.featured,
        isNew: row.isNew,
      }))}
    />
  );
}
