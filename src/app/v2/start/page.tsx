import { GetStarted } from "@/components/get-started";
import { loadBundleSkills } from "@/lib/codex-bundle";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StartPage() {
  const locale = await getLocale();
  const [stores, profiles, connections, skills] = await Promise.all([
    prisma.store.findMany({ orderBy: { code: "asc" } }),
    prisma.adsProfile.findMany({ orderBy: { name: "asc" } }),
    prisma.aiConnection.findMany({ orderBy: { connectedAt: "asc" } }),
    loadBundleSkills(),
  ]);
  return (
    <GetStarted
      locale={locale}
      skillCount={skills.length}
      stores={stores.map((s) => ({
        id: s.id,
        name: s.name,
        sellerId: s.sellerId,
        marketplace: s.marketplace,
        marketplaceId: s.marketplaceId,
        spConnected: s.spConnected,
        lastSyncedAt: s.lastSyncedAt?.toISOString() ?? null,
      }))}
      profiles={profiles.map((p) => ({
        id: p.id,
        storeId: p.storeId,
        name: p.name,
        country: p.country,
        countryCode: p.countryCode,
        enabled: p.enabled,
        neverSynced: p.neverSynced,
        lastSyncedAt: p.lastSyncedAt?.toISOString() ?? null,
      }))}
      connections={connections.map((c) => ({
        id: c.id,
        name: c.name,
        client: c.client,
        allowMarketResearch: c.allowMarketResearch,
        allowAiExecute: c.allowAiExecute,
        connectedAt: c.connectedAt.toISOString(),
        lastUsedAt: c.lastUsedAt.toISOString(),
      }))}
    />
  );
}
