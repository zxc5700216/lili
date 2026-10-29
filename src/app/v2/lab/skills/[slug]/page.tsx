import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { tagLabel } from "@/lib/labels";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { tx } from "@/lib/tx";

export const dynamic = "force-dynamic";

type Step = { skill: string | null };

export default async function SkillDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const short = slug.replace(/^(?:duobaoyu-|lili-)/, "");
  const row =
    (await prisma.skill.findUnique({ where: { slug: short } })) ||
    (await prisma.skill.findUnique({ where: { slug } }));
  if (!row) notFound();
  const steps = (locale === "en" ? row.stepsEn : row.stepsZh) as string[];
  const toolNames = row.relatedTools as string[];
  const [tools, workflows] = await Promise.all([
    prisma.toolDef.findMany({ where: { name: { in: toolNames } } }),
    prisma.workflowTemplate.findMany({ orderBy: { index: "asc" } }),
  ]);
  const toolByName = new Map(tools.map((tool) => [tool.name, tool]));
  const usedBy = workflows.filter((workflow) =>
    (workflow.steps as Step[]).some((step) => step.skill === row.slug || step.skill === short),
  );

  return (
    <article className="mx-auto max-w-[860px]">
      <p className="mb-3 rounded-xl bg-[#fff4ee] px-3 py-2 text-xs text-[#9a5b3c]">{tx(locale, "沙盒笔记。正式产品在技能网格里展开，没有单独页面。", "Sandbox notes. The live product expands the skill on the grid and has no separate page.")}</p>
      <Link href="/v2/skills" className="text-sm text-muted">{tx(locale, "← 全部技能", "← All skills")}</Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-chip px-3 py-1 text-xs">{tagLabel(locale, row.category)}</span>
        {row.featured && <span className="rounded-full bg-ink px-3 py-1 text-xs text-white">{tagLabel(locale, "featured")}</span>}
        {row.isNew && <span className="text-xs font-medium text-orange">{tx(locale, "新", "New")}</span>}
      </div>
      <h1 className="mt-3 text-[28px] font-semibold tracking-tight">{tx(locale, row.nameZh, row.nameEn)}</h1>
      <p className="mt-1 text-sm text-muted">{short}</p>
      <p className="mt-3 max-w-2xl text-sm leading-6">{tx(locale, row.summaryZh, row.summaryEn)}</p>
      <div className="mt-4">
        <CopyButton locale={locale} text={tx(locale, row.promptZh, row.promptEn)} />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">{tx(locale, "步骤", "Steps")}</h2>
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={step} className="card flex gap-3 px-4 py-3 text-sm leading-6">
            <span className="font-semibold text-orange">{index + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <h2 className="mb-3 mt-8 text-lg font-semibold">{tx(locale, "用在这些工作流里", "Used in these workflows")}</h2>
      {usedBy.length === 0 ? (
        <p className="text-sm leading-6 text-muted">
          {tx(locale, "上传的 12 条工作流没有把这个技能写成必经步骤。它可以单独复制提示词使用。", "None of the 12 workflow templates name this skill as a required step. You can still copy its prompt on its own.")}
        </p>
      ) : (
        <ul className="space-y-2">
          {usedBy.map((workflow) => {
            const hit = (workflow.steps as { zh: string; en: string; skill: string | null }[]).find((step) => step.skill === short);
            return (
              <li key={workflow.slug}>
                <Link href={`/v2/cases/${workflow.slug}`} className="card block px-4 py-3 hover:border-orange">
                  <span className="text-xs text-orange">{String(workflow.index).padStart(2, "0")} · {tagLabel(locale, workflow.category)}</span>
                  <span className="mt-1 block font-medium">{tx(locale, workflow.titleZh, workflow.titleEn)}</span>
                  {hit && <span className="mt-1 block text-sm leading-6 text-[#5c564f]">{tx(locale, hit.zh, hit.en)}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mb-3 mt-8 text-lg font-semibold">{tx(locale, "相关工具", "Related tools")}</h2>
      <ul className="space-y-2">
        {toolNames.map((name) => {
          const tool = toolByName.get(name);
          const write = tool ? !tool.readOnly : false;
          const docs = tool?.docs?.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("#") && !line.startsWith("```")).slice(0, 2).join(" ") ?? "";
          return (
            <li key={name}>
              <Link href={`/v2/tools/${name}`} className="card block px-4 py-3 hover:border-orange">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${write ? "bg-peach text-orange" : "bg-emerald-50 text-emerald-700"}`}>
                    {write ? tx(locale, "写入 · 需审批", "write · approval") : tx(locale, "只读", "read")}
                  </span>
                </span>
                <span className="mt-1 block text-sm leading-6 text-[#5c564f]">
                  {tool?.description || tx(locale, "清单里没有这条工具说明。", "No description in the tool list.")}
                </span>
                {docs && <span className="mt-1 block text-xs leading-5 text-muted">{docs.slice(0, 360)}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      <h2 className="mb-2 mt-8 text-lg font-semibold">{tx(locale, "提示词", "Prompt")}</h2>
      <pre className="whitespace-pre-wrap rounded-2xl border border-line bg-white p-5 text-sm leading-7">{tx(locale, row.promptZh, row.promptEn)}</pre>
    </article>
  );
}
