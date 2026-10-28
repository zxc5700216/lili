import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RunLiveButton } from "@/components/run-live-button";
import { getLocale } from "@/lib/locale";
import { tx } from "@/lib/tx";
import { WORKFLOWS, runWorkflowPack } from "@/lib/workflows/pack";

export const dynamic = "force-dynamic";

export default async function WorkflowResult({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const known = WORKFLOWS.find((item) => item.slug === slug);
  if (!known) notFound();
  await runWorkflowPack(slug, "fixture");
  const file = slug === "selection-doc"
    ? path.join(process.cwd(), "artifacts", "selection-doc", "arrow-bag-quiver", "flow-tree.md")
    : path.join(process.cwd(), "artifacts", "workflows", slug, "report.md");
  const html = slug === "selection-doc"
    ? "/artifacts-preview/selection"
    : null;
  const markdown = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  return (
    <article className="mx-auto max-w-4xl">
      <div className="mb-4 flex flex-wrap gap-3 text-sm">
        <Link className="text-orange" href="/v2/workflows">{tx(locale, "全部演示", "All demos")}</Link>
        <Link className="text-orange" href="/v2/cases">{tx(locale, "模板卡片", "Template cards")}</Link>
        <Link className="text-orange" href="/v2/tool-config">{tx(locale, "工具配置", "Tool setup")}</Link>
      </div>
      <h1 className="text-2xl font-semibold">{tx(locale, known.title, known.titleEn)}</h1>
      <p className="mt-2 text-sm text-muted">{tx(locale, "下面是 fixture 报告。填好密钥后可以真调，缺钥会直接说明，不会改写这份演示。", "This is the fixture report. After you save keys you can run live. A missing key is reported and does not replace this demo.")}</p>
      <RunLiveButton slug={slug} locale={locale} />
      {html && <p className="mt-3 text-sm"><a className="text-orange" href={`/api/workflows/selection-html`}>review.html</a></p>}
      <pre className="card mt-4 whitespace-pre-wrap p-4 text-sm leading-6">{markdown}</pre>
    </article>
  );
}
