import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const locale = body.locale === "zh" ? "zh" : "en";
  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set("dby_locale", locale, { path: "/", sameSite: "lax" });
  return response;
}
