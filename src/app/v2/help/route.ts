import { NextResponse } from "next/server";
import { withBasePath } from "@/lib/base-path";

export async function GET(request: Request) {
  return NextResponse.redirect(new URL(withBasePath("/v2/start"), request.url));
}
