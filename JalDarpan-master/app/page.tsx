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
import { LoadingScreen } from "@/components/page-chrome"

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
    return <LoadingScreen label="Building the marine operating picture" />
  }

  return (
    <div className="min-h-screen">
      <TopNavigation />

      <main className="page-shell">
        <div>
          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#062b49] px-6 py-10 text-white shadow-[0_35px_100px_rgba(0,0,0,.32)] md:px-10 md:py-14 lg:px-14">
            <div className="page-hero-grid" />
            <div className="absolute -right-36 -top-36 h-[420px] w-[420px] rounded-full bg-[#52e5d5]/10 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <div className="eyebrow mb-6"><span className="live-dot" /> National marine intelligence platform</div>
                <h1 className="max-w-2xl text-balance text-5xl font-semibold leading-[.98] tracking-[-0.055em] md:text-7xl">India&apos;s ocean,<br /><span className="bg-gradient-to-r from-[#52e5d5] via-[#a7f4ea] to-[#6aa9ff] bg-clip-text text-transparent">made visible.</span></h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-[#9dbcca] md:text-lg">MARLIN unifies ocean observations, fisheries, biodiversity and AI into one trusted operating picture for faster, evidence-led decisions.</p>
                <div className="mt-8 flex flex-wrap gap-3"><Link href="/map" className="primary-action">Explore live map <ArrowUpRight className="h-4 w-4" /></Link><Link href="/ai-predictions" className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.035] px-5 text-sm font-semibold text-white transition hover:border-[#52e5d5]/35 hover:bg-white/[0.07]"><Radio className="h-4 w-4 text-[#52e5d5]" /> Open AI lab</Link></div>
                <div className="mt-7 border-t border-white/10 pt-4"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#13c8d8]">Live ocean snapshot · Demo Data</p><div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4">{[["SST", "28.2°C"], ["Salinity", "34.8 PSU"], ["Dissolved O₂", "6.1 mg/L"], ["Biodiversity", "8.7"]].map(([label, value]) => <div key={label}><p className="text-[10px] uppercase tracking-wider text-[#8fb6c4]">{label}</p><p className="mt-1 text-sm font-semibold text-white">{value}</p></div>)}</div></div>
                <div className="mt-7 grid grid-cols-1 gap-3 text-[10px] uppercase tracking-[0.12em] text-[#8fb6c4] sm:grid-cols-3"><div><p>Region</p><p className="mt-1 normal-case tracking-normal text-[#d7f6f2]">India &amp; surrounding waters</p></div><div><p>Sources</p><p className="mt-1 normal-case tracking-normal text-[#d7f6f2]">CMLRE · INCOIS · IndOBIS</p></div><div><p>Last synchronized</p><p className="mt-1 normal-case tracking-normal text-[#d7f6f2]">20 Aug 2026 · 14:30 IST</p></div></div>
              </div>
              <div className="relative flex justify-center"><DataGlobe /></div>
            </div>
          </section>

          <div className="relative -mt-1 overflow-hidden rounded-b-2xl border-x border-b border-white/[0.08]"><LiveIntelligenceStrip /></div>

          <div className="space-y-16 pt-14">
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
