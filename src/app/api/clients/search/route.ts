import { NextRequest, NextResponse } from "next/server";
import { searchClients } from "@/lib/data";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ clients: [] });
  }

  const clients = await searchClients(q);
  return NextResponse.json({ clients });
}
