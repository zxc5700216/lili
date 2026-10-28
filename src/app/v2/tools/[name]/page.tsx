import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolRunner } from "@/components/tool-runner";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { tx } from "@/lib/tx";

export const dynamic = "force-dynamic";

export default async function ToolDetail({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const locale = await getLocale();
  const tool = await prisma.toolDef.findUnique({ where: { name } });
  if (!tool) notFound();
  const store = await prisma.store.findFirst({ orderBy: { code: "asc" } });
  const runs = await prisma.toolRun.findMany({ where: { toolName: name }, orderBy: { createdAt: "desc" }, take: 5 });
  return (
    <div>
      <Link href="/v2/tools" className="text-sm text-muted">{tx(locale, "全部工具", "All tools")}</Link>
      <h1 className="mt-2 text-xl font-semibold">{tool.name}</h1>
      <ToolRunner
        locale={locale}
        name={tool.name}
        description={tool.description}
        docs={tool.docs}
        schema={tool.inputSchema as { properties?: Record<string, { type?: string; description?: string }>; required?: string[] }}
        readOnly={tool.readOnly}
        storeId={store?.id ?? "store_ns"}
        profileId={store?.adsProfileId ?? ""}
      />
      <h2 className="mb-2 mt-6 font-semibold">{tx(locale, "最近调用", "Recent runs")}</h2>
      <ul className="space-y-2 text-sm">
        {runs.map((run) => (
          <li key={run.id} className="card px-3 py-2">{run.status} · {run.createdAt.toISOString()}</li>
        ))}
        {runs.length === 0 && <li className="text-muted">{tx(locale, "还没有调用。", "No runs yet.")}</li>}
      </ul>
    </div>
  );
}
