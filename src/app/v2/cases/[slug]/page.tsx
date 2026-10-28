import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { RunWorkflow } from "@/components/run-workflow";
import { tagLabel } from "@/lib/labels";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { tx } from "@/lib/tx";

export const dynamic = "force-dynamic";

type Step = { n: number; zh: string; en: string; skill: string | null };

export default async function CaseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const row = await prisma.workflowTemplate.findUnique({ where: { slug } });
  if (!row) notFound();
  const steps = row.steps as Step[];
  const prompt = tx(locale, row.promptZh, row.promptEn);
  const fills = [...row.promptZh.matchAll(/【[^】]+】/g)].map((match) => match[0]);
  const skills = await prisma.skill.findMany({
    where: { slug: { in: steps.map((step) => (step.skill ? `duobaoyu-${step.skill}` : "")).filter(Boolean) } },
    select: { slug: true, nameZh: true, nameEn: true },
  });
  const skillName = new Map(skills.map((skill) => [skill.slug, tx(locale, skill.nameZh, skill.nameEn)]));

  return (
    <article className="mx-auto max-w-[860px]">
      <Link href="/v2/cases" className="text-sm text-muted">
        {tx(locale, "← 全部工作流模板", "← All workflow templates")}
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-ink px-3 py-1 text-xs text-white">{String(row.index).padStart(2, "0")}</span>
        <span className="rounded-full bg-chip px-3 py-1 text-xs">{tagLabel(locale, row.category)}</span>
      </div>
      <h1 className="mt-3 text-[28px] font-semibold tracking-tight">{tx(locale, row.titleZh, row.titleEn)}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5c564f]">{tx(locale, row.summaryZh, row.summaryEn)}</p>
      <div className="mt-4">
        <CopyButton locale={locale} text={prompt} />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">{tx(locale, "按这个顺序做", "Run steps")}</h2>
      <ol className="space-y-3">
        {steps.map((step) => {
          const skillSlug = step.skill ? `duobaoyu-${step.skill}` : "";
          return (
            <li key={step.n} className="card px-4 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-peach text-xs font-semibold text-orange">{step.n}</span>
                {step.skill ? (
                  <Link href={`/v2/skills/${skillSlug}`} className="rounded-full bg-chip px-2.5 py-0.5 text-xs font-medium hover:text-orange">
                    {skillName.get(skillSlug) || step.skill}
                  </Link>
                ) : (
                  <span className="text-xs text-muted">{tx(locale, "收尾", "Close")}</span>
                )}
              </div>
              <p className="mt-2 text-sm leading-6">{tx(locale, step.zh, step.en)}</p>
            </li>
          );
        })}
      </ol>

      {fills.length > 0 && (
        <>
          <h2 className="mb-2 mt-8 text-lg font-semibold">{tx(locale, "开始前要填的", "Fill these in first")}</h2>
          <ul className="flex flex-wrap gap-2">
            {fills.map((fill) => (
              <li key={fill} className="rounded-full bg-white px-3 py-1 text-sm">{fill}</li>
            ))}
          </ul>
        </>
      )}

      <h2 className="mb-2 mt-8 text-lg font-semibold">{tx(locale, "完整提示词", "Full prompt")}</h2>
      <pre className="whitespace-pre-wrap rounded-2xl border border-line bg-white p-5 text-sm leading-7">{prompt}</pre>

      <h2 className="mb-2 mt-8 text-lg font-semibold">{tx(locale, "在沙盒里跑", "Run it here")}</h2>
      <p className="mb-3 text-sm text-muted">
        {tx(
          locale,
          "用 NS店 / TK店 的模拟数据走完这些步骤。会改广告、货件或 Listing 的，只生成审批预览。",
          "Walks these steps on the NS and TK mock stores. Ads, shipment, and listing changes stop at an approval preview.",
        )}
      </p>
      <RunWorkflow slug={row.slug} locale={locale} />
    </article>
  );
}
