import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MARKET_IDS: Record<string, string> = {
  "United States": "ATVPDKIKX0DER",
  Canada: "A2EUQ1WTGCTBG2",
  Mexico: "A1AM78C64UM0Y8",
  "United Kingdom": "A1F83G8C2ARO7P",
  Germany: "A1PA6795UKMFR9",
  Japan: "A1VC38T7YXB528",
};

async function ensureAdsProfiles(storeId: string, storeName: string) {
  const rows: Array<[string, string]> = [
    ["CA", "Canada"],
    ["MX", "Mexico"],
    ["US", "United States"],
  ];
  for (const [code, country] of rows) {
    const id = `${storeId}-${code}`;
    const exists = await prisma.adsProfile.findUnique({ where: { id } });
    if (!exists) {
      await prisma.adsProfile.create({
        data: {
          id,
          storeId,
          name: `${storeName} ${code}`,
          country,
          countryCode: code,
          enabled: false,
          neverSynced: true,
        },
      });
    }
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  if (body.action === "disconnect") {
    await prisma.store.update({ where: { id: body.id }, data: { spConnected: false } });
  }
  if (body.action === "sync") {
    await prisma.store.update({ where: { id: body.id }, data: { lastSyncedAt: new Date(), spConnected: true } });
  }
  if (body.action === "connect") {
    const name = String(body.name || "Sandbox store").slice(0, 80);
    const marketplace = String(body.marketplace || "United States");
    const id = `store_${randomUUID().slice(0, 8)}`;
    await prisma.store.create({
      data: {
        id,
        name,
        code: name.slice(0, 2).toUpperCase(),
        marketplace,
        marketplaceId: MARKET_IDS[marketplace] ?? MARKET_IDS["United States"],
        region: "NA",
        currency: marketplace === "Japan" ? "JPY" : marketplace === "United Kingdom" ? "GBP" : marketplace === "Germany" ? "EUR" : "USD",
        sellerId: `A1${id.slice(-6).toUpperCase()}`,
        adsProfileId: `ap-${id}`,
        timezone: "America/Los_Angeles",
        spConnected: true,
        adsConnected: false,
        lastSyncedAt: new Date(),
      },
    });
    await ensureAdsProfiles(id, name);
  }
  const connected = await prisma.store.count({ where: { spConnected: true } });
  await prisma.appSetting.update({ where: { id: "default" }, data: { spAuthorized: connected > 0 } });
  return NextResponse.json({ ok: true });
}
