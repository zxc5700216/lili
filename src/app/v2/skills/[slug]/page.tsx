import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { tx } from "@/lib/tx";

export const dynamic = "force-dynamic";

export default async function SkillDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const row = await prisma.skill.findUnique({ where: { slug } });
  if (!row) notFound();
  const steps = (locale === "en" ? row.stepsEn : row.stepsZh) as string[];
  const tools = row.relatedTools as string[];
  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/v2/skills" className="text-sm text-muted">{tx(locale, "全部技能", "All skills")}</Link>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-orange">{row.category}{row.isNew ? " · New" : ""}</p>
      <h1 className="mt-1 text-2xl font-semibold">{tx(locale, row.nameZh, row.nameEn)}</h1>
      <p className="mt-2 text-sm text-muted">{row.slug}</p>
      <p className="mt-3 text-sm leading-6">{tx(locale, row.summaryZh, row.summaryEn)}</p>
      <div className="mt-4">
        <CopyButton locale={locale} text={tx(locale, row.promptZh, row.promptEn)} />
      </div>
      <ol className="mt-6 space-y-2 text-sm leading-6">
        {steps.map((step, i) => (
          <li key={step} className="card px-4 py-3"><span className="mr-2 font-semibold text-orange">{i + 1}</span>{step}</li>
        ))}
      </ol>
      <h2 className="mt-6 font-semibold">{tx(locale, "相关工具", "Related tools")}</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Link key={tool} href={`/v2/tools/${tool}`} className="rounded-full bg-white px-3 py-1 text-sm">{tool}</Link>
        ))}
      </div>
      <h2 className="mt-6 font-semibold">{tx(locale, "手册", "Notes")}</h2>
      <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm leading-6">{tx(locale, row.bodyZh, row.bodyEn)}</pre>
    </article>
  );
}
