import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const shop = String(body.shop || "").trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop)) {
    return NextResponse.json({ ok: false, message: "Use a your-store.myshopify.com domain." }, { status: 400 });
  }
  await prisma.appSetting.update({
    where: { id: "default" },
    data: { shopifyShop: shop, shopifyConnected: true },
  });
  return NextResponse.json({ ok: true, shop });
}

export async function DELETE() {
  await prisma.appSetting.update({
    where: { id: "default" },
    data: { shopifyShop: "", shopifyConnected: false },
  });
  return NextResponse.json({ ok: true });
}
