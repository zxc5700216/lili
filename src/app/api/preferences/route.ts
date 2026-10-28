import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const locale = body.locale === "zh" ? "zh" : "en";
  await prisma.appSetting.update({ where: { id: "default" }, data: { locale } }).catch(() => null);
  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set("dby_locale", locale, { httpOnly: false, path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
  return response;
}
