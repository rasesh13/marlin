"use client"

import { useEffect, useState } from "react"
import { Activity, Droplets, Leaf, Thermometer, Waves } from "lucide-react"
import { TopNavigation } from "@/components/top-navigation"
import { OceanParametersChart } from "@/components/charts/ocean-parameters-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingScreen, MetricTile, PageIntro, SectionHeading } from "@/components/page-chrome"

interface OceanData { date: string; temperature: number; salinity: number; chlorophyll: number }

export default function OceanDataPage() {
  const [oceanData, setOceanData] = useState<OceanData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/ocean-data").then((response) => response.json()).then((result) => {
      if (result.success) setOceanData(result.data)
    }).catch((error) => console.error("Failed to fetch ocean data:", error)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen label="Synchronising ocean sensors" />

  const latest = oceanData[oceanData.length - 1]
  const average = (key: keyof Pick<OceanData, "temperature" | "salinity" | "chlorophyll">) => oceanData.length ? oceanData.reduce((sum, row) => sum + row[key], 0) / oceanData.length : 0

  return (
    <div className="min-h-screen">
      <TopNavigation />
      <main className="page-shell">
        <PageIntro eyebrow="Ocean observation system" title="See the ocean change, signal by signal." description="A continuous operating picture of temperature, salinity and primary productivity across India’s marine observation network." icon={Waves} action={{ label: "Open geospatial map", href: "/map" }} meta="30-day observation window" />

        <section className="mt-7 grid gap-4 md:grid-cols-3">
          <MetricTile label="Sea surface temperature" value={`${latest?.temperature ?? "—"}°C`} detail={`30-day mean ${average("temperature").toFixed(1)}°C · updated today`} icon={Thermometer} tone="coral" />
          <MetricTile label="Salinity" value={`${latest?.salinity ?? "—"} PSU`} detail={`Network mean ${average("salinity").toFixed(1)} PSU · normal band`} icon={Droplets} tone="blue" />
          <MetricTile label="Chlorophyll-a" value={`${latest?.chlorophyll ?? "—"} mg/m³`} detail={`30-day mean ${average("chlorophyll").toFixed(2)} mg/m³ · stable`} icon={Leaf} tone="lime" />
        </section>

        <section className="mt-12">
          <SectionHeading eyebrow="Sensor telemetry" title="Environmental signal trends" detail="Temperature · Salinity · Chlorophyll" />
          <OceanParametersChart data={oceanData} />
        </section>

        <section className="mt-12">
          <SectionHeading eyebrow="Validated observations" title="Recent network measurements" detail={`${oceanData.length} records loaded`} />
          <Card className="data-table">
            <CardHeader className="border-b border-white/[0.07]">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52e5d5]/10 text-[#52e5d5]"><Activity className="h-5 w-5" /></div><div><CardTitle>Observation log</CardTitle><CardDescription>Latest calibrated readings from connected monitoring stations</CardDescription></div></div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead><tr><th className="px-6 py-4 text-left">Date</th><th className="px-6 py-4 text-left">Temperature</th><th className="px-6 py-4 text-left">Salinity</th><th className="px-6 py-4 text-left">Chlorophyll-a</th><th className="px-6 py-4 text-left">Quality</th></tr></thead>
                  <tbody>{oceanData.slice(-10).reverse().map((data, index) => <tr key={`${data.date}-${index}`} className="border-t border-white/[0.06]"><td className="px-6 py-4 font-medium text-white">{new Date(data.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td><td className="px-6 py-4 text-[#a5c1cb]">{data.temperature} °C</td><td className="px-6 py-4 text-[#a5c1cb]">{data.salinity} PSU</td><td className="px-6 py-4 text-[#a5c1cb]">{data.chlorophyll} mg/m³</td><td className="px-6 py-4"><span className="inline-flex items-center gap-2 rounded-full bg-[#79f2a4]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#79f2a4]"><span className="h-1.5 w-1.5 rounded-full bg-current" /> Verified</span></td></tr>)}</tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
