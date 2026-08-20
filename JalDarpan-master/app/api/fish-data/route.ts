import { NextResponse } from "next/server"
import { getFishData } from "@/lib/marine-data"

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: getFishData() })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch fish data" }, { status: 500 })
  }
}
