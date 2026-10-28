import path from "node:path";
import { NextResponse } from "next/server";
import { runSelectionDoc } from "@/lib/selection-doc/run";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const keyword = String(body.keyword || "arrow bag quiver");
  const dir = path.join(process.cwd(), "artifacts", "selection-doc", keyword.replace(/\s+/g, "-"));
  const result = runSelectionDoc(
    {
      keyword,
      marketplace: "US",
      nicheChoice: body.nicheChoice,
      quantity: body.quantity,
      deliver: body.deliver !== false && Boolean(body.nicheChoice),
    },
    dir,
  );
  return NextResponse.json(result);
}
