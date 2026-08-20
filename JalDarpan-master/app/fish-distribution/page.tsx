"use client"

import { useEffect, useState } from "react"
import { Anchor, Fish, MapPin, Radar, TrendingUp } from "lucide-react"
import { TopNavigation } from "@/components/top-navigation"
import { FishDistributionChart } from "@/components/charts/fish-distribution-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingScreen, MetricTile, PageIntro, SectionHeading } from "@/components/page-chrome"

interface FishData { species: string; abundance: number; region: string }

export default function FishDistributionPage() {
  const [fishData, setFishData] = useState<FishData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/fish-data").then((response) => response.json()).then((result) => {
      if (result.success) setFishData(result.data)
    }).catch((error) => console.error("Failed to fetch fish data:", error)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen label="Resolving fisheries observations" />

  const total = fishData.reduce((sum, fish) => sum + fish.abundance, 0)
  const topSpecies = [...fishData].sort((a, b) => b.abundance - a.abundance).slice(0, 4)
  const regionCounts = fishData.reduce((acc, fish) => ({ ...acc, [fish.region]: (acc[fish.region] || 0) + 1 }), {} as Record<string, number>)

  return (
    <div className="min-h-screen">
      <TopNavigation />
      <main className="page-shell">
        <PageIntro eyebrow="Fisheries intelligence" title="From catch records to sustainable decisions." description="Track species abundance, regional distribution and stock signals in one evidence-ready fisheries workspace." icon={Fish} accent="#6aa9ff" action={{ label: "Explore fishing zones", href: "/map" }} meta="Regional stock picture" />

        <section className="mt-7 grid gap-4 md:grid-cols-3">
          <MetricTile label="Observed abundance" value={total.toLocaleString("en-IN")} detail="Individuals represented in current survey data" icon={Fish} tone="aqua" />
          <MetricTile label="Species tracked" value={fishData.length} detail="Priority commercial and ecosystem indicator species" icon={Radar} tone="blue" />
          <MetricTile label="Marine regions" value={Object.keys(regionCounts).length} detail="Survey regions contributing active records" icon={MapPin} tone="amber" />
        </section>

        <section className="mt-12">
          <SectionHeading eyebrow="Distribution intelligence" title="Species abundance by region" detail="Current observation set" />
          <FishDistributionChart data={fishData} />
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-[#52e5d5]" /> Leading species</CardTitle><CardDescription>Ranked by observed abundance across the network</CardDescription></CardHeader>
            <CardContent className="space-y-3">{topSpecies.map((species, index) => {
              const width = Math.max(14, Math.round((species.abundance / (topSpecies[0]?.abundance || 1)) * 100))
              return <div key={species.species} className="rounded-xl border border-[#e1eae8] bg-[#f8fbfa] p-4"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#dff6f3] text-xs font-bold text-[#087f7b]">0{index + 1}</span><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><p className="truncate font-semibold text-[#153d46]">{species.species}</p><p className="font-mono text-sm text-[#627d82]">{species.abundance.toLocaleString("en-IN")}</p></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e8efee]"><div className="h-full rounded-full bg-gradient-to-r from-[#087f7b] to-[#4f83cc]" style={{ width: `${width}%` }} /></div><p className="mt-2 text-[10px] uppercase tracking-wider text-[#70878b]">{species.region}</p></div></div></div>
            })}</CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Anchor className="h-5 w-5 text-[#6aa9ff]" /> Regional coverage</CardTitle><CardDescription>Species representation by marine survey area</CardDescription></CardHeader>
            <CardContent className="space-y-2">{Object.entries(regionCounts).map(([region, count], index) => <div key={region} className="flex items-center justify-between rounded-xl border border-[#e1eae8] px-4 py-3"><div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: ["#087f7b", "#4f83cc", "#77a842", "#d29435"][index % 4] }} /><span className="text-sm font-medium text-[#153d46]">{region}</span></div><span className="rounded-lg bg-[#f1f6f5] px-2.5 py-1 font-mono text-xs text-[#6f878b]">{count} species</span></div>)}</CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
