import { ToolLab } from "@/components/tool-lab";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const locale = await getLocale();
  const tools = await prisma.toolDef.findMany({ orderBy: { name: "asc" } });
  return (
    <ToolLab
      locale={locale}
      tools={tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        category: tool.category,
        readOnly: tool.readOnly,
      }))}
    />
  );
}
