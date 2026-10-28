import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { RunWorkflow } from "@/components/run-workflow";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { tx } from "@/lib/tx";

export const dynamic = "force-dynamic";

export default async function CaseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const row = await prisma.workflowTemplate.findUnique({ where: { slug } });
  if (!row) notFound();
  const steps = row.steps as { n: number; zh: string; en: string; skill: string | null }[];
  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/v2/cases" className="text-sm text-muted">{tx(locale, "全部模板", "All templates")}</Link>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-orange">{row.category} · {String(row.index).padStart(2, "0")}</p>
      <h1 className="mt-1 text-2xl font-semibold">{tx(locale, row.titleZh, row.titleEn)}</h1>
      <p className="mt-2 text-sm leading-6 text-[#5c564f]">{tx(locale, row.summaryZh, row.summaryEn)}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton locale={locale} text={tx(locale, row.promptZh, row.promptEn)} />
        <Link className="btn-ghost" href="/v2/tools">{tx(locale, "工具实验室", "Tool lab")}</Link>
      </div>
      <ol className="mt-6 space-y-3">
        {steps.map((step) => (
          <li key={step.n} className="card px-4 py-3 text-sm leading-6">
            <span className="mr-2 font-semibold text-orange">{step.n}</span>
            {tx(locale, step.zh, step.en)}
            {step.skill && (
              <div className="mt-1">
                <Link className="text-orange" href={`/v2/skills/duobaoyu-${step.skill}`}>{step.skill}</Link>
              </div>
            )}
          </li>
        ))}
      </ol>
      <h2 className="mt-6 font-semibold">{tx(locale, "完整提示词", "Full prompt")}</h2>
      <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm leading-6">{tx(locale, row.promptZh, row.promptEn)}</pre>
      <RunWorkflow slug={row.slug} locale={locale} />
    </article>
  );
}
