import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  const file = path.join(process.cwd(), "artifacts", "selection-doc", "arrow-bag-quiver", "review.html");
  if (!fs.existsSync(file)) return NextResponse.json({ ok: false }, { status: 404 });
  return new NextResponse(fs.readFileSync(file, "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } });
}
