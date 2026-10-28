import { Shell } from "@/components/shell";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function V2Layout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const settings = await prisma.appSetting.findUnique({ where: { id: "default" } });
  return (
    <Shell locale={locale} email={settings?.email ?? "learner@sandbox.local"} credits={settings?.credits ?? 0}>
      {children}
    </Shell>
  );
}
