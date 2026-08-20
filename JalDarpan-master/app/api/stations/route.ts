import { NextResponse } from "next/server"
import { getStations } from "@/lib/marine-data"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: getStations(),
    meta: { source: "MARLIN monitoring network", updatedAt: new Date().toISOString() },
  })
}