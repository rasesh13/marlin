import { NextResponse } from "next/server"
import { getAIPredictions } from "@/lib/marine-data"

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: getAIPredictions() })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch AI predictions" }, { status: 500 })
  }
}
