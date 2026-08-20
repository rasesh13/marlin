"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TopNavigation } from "@/components/top-navigation"
import { OceanParametersChart } from "@/components/charts/ocean-parameters-chart"
import { FishDistributionChart } from "@/components/charts/fish-distribution-chart"
import { BiodiversityChart } from "@/components/charts/biodiversity-chart"
import { RealTimeAlerts } from "@/components/real-time-alerts"
import { PredictiveAnalytics } from "@/components/predictive-analytics"
import { QuickActions } from "@/components/quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Radio } from "lucide-react"
import { DataGlobe, EarlyWarningAndProvenance, IntelligenceMetricCards, LiveIntelligenceStrip, MarineAIAndHealth } from "@/components/marine-intelligence-sections"

interface OceanData {
  date: string
  temperature: number
  salinity: number
  chlorophyll: number
}

interface FishData {
  species: string
  abundance: number
  region: string
}

interface BiodiversityData {
  pelagic: number
  benthic: number
  crustaceans: number
  others: number
}

interface AIPrediction {
  id: number
  type: string
  species: string
  confidence: number
  timestamp: string
}

export default function DashboardPage() {
  const [oceanData, setOceanData] = useState<OceanData[]>([])
  const [fishData, setFishData] = useState<FishData[]>([])
  const [biodiversityData, setBiodiversityData] = useState<BiodiversityData | null>(null)
  const [aiPredictions, setAIPredictions] = useState<AIPrediction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oceanRes, fishRes, biodiversityRes, aiRes] = await Promise.all([
          fetch("/api/ocean-data"),
          fetch("/api/fish-data"),
          fetch("/api/biodiversity-data"),
          fetch("/api/ai-predictions"),
        ])

        const [oceanResult, fishResult, biodiversityResult, aiResult] = await Promise.all([
          oceanRes.json(),
          fishRes.json(),
          biodiversityRes.json(),
          aiRes.json(),
        ])

        if (oceanResult.success) setOceanData(oceanResult.data)
        if (fishResult.success) setFishData(fishResult.data)
        if (biodiversityResult.success) setBiodiversityData(biodiversityResult.data)
        if (aiResult.success) setAIPredictions(aiResult.data)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate stats from data
  const avgTemperature =
    oceanData.length > 0
      ? Math.round((oceanData.reduce((sum, d) => sum + d.temperature, 0) / oceanData.length) * 10) / 10
      : 21.3

  const avgSalinity =
    oceanData.length > 0
      ? Math.round((oceanData.reduce((sum, d) => sum + d.salinity, 0) / oceanData.length) * 10) / 10
      : 35.2

  const speciesCount = fishData.reduce((sum, d) => sum + d.abundance, 0) || 1247

  const biodiversityIndex = biodiversityData
    ? Math.round(
        ((biodiversityData.pelagic +
          biodiversityData.benthic +
          biodiversityData.crustaceans +
          biodiversityData.others) /
          50) *
          10,
      ) / 10
    : 8.7

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading marine data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      <main className="container mx-auto px-4 py-8 md:px-6">
        <div className="max-w-7xl mx-auto">
          <section className="relative overflow-hidden border border-white/10 bg-[#062b49] px-6 py-9 text-white md:px-10 md:py-11">
            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <div className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#13c8d8]">National marine data platform</div>
                <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl">Marine ecosystem intelligence, unified.</h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-[#b8d7df]">Integrated oceanographic, fisheries and biodiversity data for monitoring, analysis and evidence-based decision making.</p>
                <div className="mt-7 flex flex-wrap gap-3"><Link href="/map" className="inline-flex items-center gap-2 rounded-md bg-[#13c8d8] px-5 py-3 text-sm font-semibold text-[#041827] transition hover:bg-[#27d3c2]">Explore data <ArrowUpRight className="h-4 w-4" /></Link><Link href="/ai-predictions" className="inline-flex items-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#13c8d8] hover:bg-white/5"><Radio className="h-4 w-4 text-[#13c8d8]" /> Ask MARLIN</Link></div>
                <div className="mt-7 border-t border-white/10 pt-4"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#13c8d8]">Live ocean snapshot · Demo Data</p><div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4">{[["SST", "28.2°C"], ["Salinity", "34.8 PSU"], ["Dissolved O₂", "6.1 mg/L"], ["Biodiversity", "8.7"]].map(([label, value]) => <div key={label}><p className="text-[10px] uppercase tracking-wider text-[#8fb6c4]">{label}</p><p className="mt-1 text-sm font-semibold text-white">{value}</p></div>)}</div></div>
                <div className="mt-7 grid grid-cols-1 gap-3 text-[10px] uppercase tracking-[0.12em] text-[#8fb6c4] sm:grid-cols-3"><div><p>Region</p><p className="mt-1 normal-case tracking-normal text-[#d7f6f2]">India &amp; surrounding waters</p></div><div><p>Sources</p><p className="mt-1 normal-case tracking-normal text-[#d7f6f2]">CMLRE · INCOIS · IndOBIS</p></div><div><p>Last synchronized</p><p className="mt-1 normal-case tracking-normal text-[#d7f6f2]">20 Aug 2026 · 14:30 IST</p></div></div>
              </div>
              <div className="relative flex justify-center"><DataGlobe /></div>
            </div>
          </section>

          <LiveIntelligenceStrip />

          <div className="space-y-12 pt-10">
            <section><div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#13c8d8]">Platform domains</p><h2 className="mt-2 font-display text-2xl font-semibold text-white">Marine data, fisheries and biodiversity</h2></div><div className="grid gap-4 md:grid-cols-3">{[["Marine Data", "Oceanographic observations", "SST · Salinity · Dissolved oxygen · Chlorophyll"], ["Fisheries", "Catch & stock intelligence", "Species distribution · PFZ · Catch trends"], ["Biodiversity", "Marine life & molecular intelligence", "Species records · eDNA · Distribution"]].map(([title, subtitle, detail]) => <div key={title} className="border-l-2 border-[#13c8d8] bg-[#092b43] px-5 py-4"><h3 className="font-display text-lg font-semibold text-white">{title}</h3><p className="mt-1 text-sm text-[#b8d7df]">{subtitle}</p><p className="mt-3 text-xs leading-5 text-[#8fb6c4]">{detail}</p></div>)}</div></section>

            <section><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#13c8d8]">Geospatial observations</p><h2 className="mt-2 font-display text-2xl font-semibold text-white">Marine Intelligence Map</h2></div><span className="text-xs text-[#8fb6c4]">24H · 7D · 30D · 1Y</span></div><div className="grid gap-0 border border-white/10 bg-[#092b43] lg:grid-cols-[1.65fr_0.85fr]"><div className="min-h-[300px] p-4"><DataGlobe /></div><div className="border-t border-white/10 p-6 lg:border-l lg:border-t-0"><p className="text-xs uppercase tracking-[0.14em] text-[#8fb6c4]">Selected region</p><h3 className="mt-2 font-display text-2xl font-semibold text-white">Arabian Sea</h3><dl className="mt-6 grid grid-cols-2 gap-y-5 text-sm"><div><dt className="text-xs text-[#8fb6c4]">Temperature</dt><dd className="mt-1 font-semibold text-white">28.2°C</dd></div><div><dt className="text-xs text-[#8fb6c4]">Salinity</dt><dd className="mt-1 font-semibold text-white">34.8 PSU</dd></div><div><dt className="text-xs text-[#8fb6c4]">Biodiversity records</dt><dd className="mt-1 font-semibold text-white">4,820</dd></div><div><dt className="text-xs text-[#8fb6c4]">Risk</dt><dd className="mt-1 font-semibold text-[#27d3c2]">Low</dd></div></dl><p className="mt-6 border-t border-white/10 pt-4 text-xs text-[#8fb6c4]">Source: <span className="text-[#d7f6f2]">INCOIS / CMLRE</span><br />Timestamp: <span className="text-[#d7f6f2]">20 Aug 2026 · 14:30 IST</span></p><Link href="/map" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#13c8d8] hover:text-white">View region <ArrowUpRight className="h-4 w-4" /></Link></div></div></section>

            <section><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#13c8d8]">Ocean intelligence / current view</p><h2 className="mt-2 font-display text-2xl font-semibold text-white">Signals from the water</h2></div><span className="text-xs text-[#8fb6c4]">Live network baseline</span></div><IntelligenceMetricCards /></section>

            <MarineAIAndHealth />
            <EarlyWarningAndProvenance />

            {/* Top Priority Section - Alerts and Quick Actions */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <RealTimeAlerts />
              </div>
              <div className="lg:col-span-3">
                <QuickActions />
              </div>
            </div>

            {/* Main Analytics Section */}
            <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.9fr)]">
              <div className="min-w-0">
                <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
                  <OceanParametersChart data={oceanData} />
                  <FishDistributionChart data={fishData} />
                </div>
              </div>
              <div className="min-w-0">
                <PredictiveAnalytics />
              </div>
            </div>

            {/* Secondary Analytics */}
            <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
              {biodiversityData && <BiodiversityChart data={biodiversityData} />}

              {/* Recent AI Predictions Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent AI Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiPredictions.map((prediction) => (
                      <div
                        key={prediction.id}
                        className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {prediction.type === "otolith_classification"
                              ? "Otolith Classification"
                              : "DNA Sequence Match"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {prediction.species} - {Math.round(prediction.confidence * 100)}% confidence
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(prediction.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
