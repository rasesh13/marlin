import { NextResponse } from "next/server"
import { getBiodiversityData, getFishData, getOceanData, getStations } from "@/lib/marine-data"

export async function GET() {
  const report = [
    "MARLIN MARINE MONITORING NETWORK REPORT",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Monitoring stations: ${getStations().length}`,
    `Active stations: ${getStations().filter((station) => station.status === "active").length}`,
    `Species records: ${getFishData().length}`,
    `Ocean readings: ${getOceanData().length}`,
    `Biodiversity index records: ${JSON.stringify(getBiodiversityData())}`,
  ].join("\n")

  return new NextResponse(report, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": "attachment; filename=marlin-network-report.txt",
    },
  })
}