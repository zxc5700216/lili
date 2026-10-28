import { RechargeView } from "@/components/recharge-view";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RechargePage() {
  const locale = await getLocale();
  const settings = await prisma.appSetting.findUnique({ where: { id: "default" } });
  return <RechargeView locale={locale} credits={settings?.credits ?? 0} />;
}
