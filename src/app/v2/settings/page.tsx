import { SettingsView } from "@/components/settings-view";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const locale = await getLocale();
  const settings = await prisma.appSetting.findUnique({ where: { id: "default" } });
  return <SettingsView locale={locale} shop={settings?.shopifyShop ?? ""} connected={Boolean(settings?.shopifyConnected)} />;
}
