import { ToolConfigView } from "@/components/tool-config-view";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function ToolConfigPage() {
  const locale = await getLocale();
  return <ToolConfigView locale={locale} />;
}
