import { NextResponse } from "next/server"
import { getOceanData } from "@/lib/marine-data"

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: getOceanData() })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch ocean data" }, { status: 500 })
  }
}
