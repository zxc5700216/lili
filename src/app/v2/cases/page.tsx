import Link from "next/link";
import { CaseGrid } from "@/components/case-grid";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { tx } from "@/lib/tx";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const locale = await getLocale();
  const rows = await prisma.workflowTemplate.findMany({ orderBy: { index: "asc" } });
  return (
    <div>
      <p className="mb-3 text-sm">
        <Link className="text-orange" href="/v2/workflows">{tx(locale, "12 条演示报告", "12 demo reports")}</Link>
        <span className="text-muted"> · </span>
        <Link className="text-orange" href="/v2/tool-config">{tx(locale, "工具配置", "Tool setup")}</Link>
      </p>
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
    </div>
  );
}
