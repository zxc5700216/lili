import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { tx } from "@/lib/tx";
import { WORKFLOWS } from "@/lib/workflows/pack";

export const dynamic = "force-dynamic";

export default async function WorkflowIndex() {
  const locale = await getLocale();
  return (
    <div className="mx-auto max-w-4xl">
      <p className="mb-4 text-sm leading-6 text-[#5c564f]">
        {tx(locale, "这是学习站的演示报告列表。卡片上的复制提示词仍在工作流模板页。没有密钥时报告用 fixture。真调用在每条报告里。", "These are the study-site reports. Copy prompt still lives on Workflow Templates. Without keys the report is a fixture. Live calls are on each report.")}
      </p>
      <div className="mb-4 flex gap-2 text-sm">
        <Link className="text-orange" href="/v2/cases">{tx(locale, "工作流模板", "Workflow Templates")}</Link>
        <Link className="text-orange" href="/v2/tool-config">{tx(locale, "工具配置", "Tool setup")}</Link>
      </div>
      <ul className="space-y-2">
        {WORKFLOWS.map((item, index) => (
          <li key={item.slug}>
            <Link href={`/v2/workflows/${item.slug}`} className="card flex items-center justify-between px-4 py-3 hover:border-orange">
              <span><span className="mr-2 text-xs text-orange">{String(index + 1).padStart(2, "0")}</span>{tx(locale, item.title, item.titleEn)}</span>
              <span className="text-sm text-muted">{item.slug}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
