import { CaseGrid } from "@/components/case-grid";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const locale = await getLocale();
  const rows = await prisma.workflowTemplate.findMany({ orderBy: { index: "asc" } });
  return (
    <CaseGrid
      locale={locale}
      items={rows.map((row) => ({
        slug: row.slug,
        category: row.category,
        index: row.index,
        titleZh: row.titleZh,
        titleEn: row.titleEn,
        summaryZh: row.summaryZh,
        summaryEn: row.summaryEn,
        promptZh: row.promptZh,
        promptEn: row.promptEn,
      }))}
    />
  );
}
