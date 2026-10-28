import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const next = String(form.get("next") || "/v2/start");
  const safe = next.startsWith("/v2") ? next : "/v2/start";
  const response = NextResponse.redirect(new URL(safe, request.url), 303);
  response.cookies.set("dby_session", "sandbox", { httpOnly: true, sameSite: "lax", path: "/" });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("dby_session", "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
