import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  if (body.id && body.action === "sync") {
    await prisma.adsProfile.update({
      where: { id: body.id },
      data: { lastSyncedAt: new Date(), neverSynced: false, enabled: true },
    });
  } else if (body.id) {
    await prisma.adsProfile.update({
      where: { id: body.id },
      data: {
        enabled: Boolean(body.enabled),
        neverSynced: Boolean(body.neverSynced),
        ...(body.enabled ? { lastSyncedAt: new Date() } : {}),
      },
    });
  }
  if (body.action === "refresh") {
    await prisma.adsProfile.updateMany({
      where: { enabled: true },
      data: { lastSyncedAt: new Date() },
    });
  }
  if (body.action === "disconnect") {
    await prisma.adsProfile.updateMany({ data: { enabled: false, neverSynced: true } });
  }
  if (body.action === "another") {
    const store = await prisma.store.findFirst({ orderBy: { code: "asc" } });
    if (store) {
      const rows = [
        ["CA", "Canada"],
        ["MX", "Mexico"],
        ["US", "United States"],
      ];
      for (const [code, country] of rows) {
        const id = `extra-${store.id}-${code}`;
        const exists = await prisma.adsProfile.findUnique({ where: { id } });
        if (!exists) {
          await prisma.adsProfile.create({
            data: {
              id,
              storeId: store.id,
              name: `${store.name} ${code}`,
              country,
              countryCode: code,
              enabled: false,
              neverSynced: true,
            },
          });
        }
      }
    }
  }
  const enabled = await prisma.adsProfile.count({ where: { enabled: true } });
  await prisma.appSetting.update({ where: { id: "default" }, data: { adsAuthorized: enabled > 0 } });
  return NextResponse.json({ ok: true, id: randomUUID() });
}
