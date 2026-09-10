import { NextRequest, NextResponse } from "next/server";
import { findVehicleByPlate } from "@/lib/data";

export async function GET(request: NextRequest) {
  const plate = request.nextUrl.searchParams.get("plate")?.trim();
  if (!plate) {
    return NextResponse.json({ vehicle: null });
  }

  const vehicle = await findVehicleByPlate(plate);
  return NextResponse.json({ vehicle });
}
