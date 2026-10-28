import { RechargeView } from "@/components/recharge-view";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RechargePage() {
  const locale = await getLocale();
  const [settings, orders] = await Promise.all([
    prisma.appSetting.findUnique({ where: { id: "default" } }),
    prisma.creditOrder.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <RechargeView
      locale={locale}
      credits={settings?.credits ?? 0}
      orders={orders.map((order) => ({
        id: order.id,
        code: order.code,
        credits: order.credits,
        amountCny: order.amountCny,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      }))}
    />
  );
}
