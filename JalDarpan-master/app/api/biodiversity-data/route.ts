import { NextResponse } from "next/server"
import { getBiodiversityData } from "@/lib/marine-data"

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: getBiodiversityData() })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch biodiversity data" }, { status: 500 })
  }
}
