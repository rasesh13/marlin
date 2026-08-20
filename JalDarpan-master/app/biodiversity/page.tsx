"use client"

import { useEffect, useState } from "react"
import { BarChart3, Bug, Dna, Leaf, ShieldCheck, Waves } from "lucide-react"
import { TopNavigation } from "@/components/top-navigation"
import { BiodiversityChart } from "@/components/charts/biodiversity-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingScreen, MetricTile, PageIntro, SectionHeading } from "@/components/page-chrome"

interface BiodiversityData { pelagic: number; benthic: number; crustaceans: number; others: number }

export default function BiodiversityPage() {
  const [data, setData] = useState<BiodiversityData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/biodiversity-data").then((response) => response.json()).then((result) => {
      if (result.success) setData(result.data)
    }).catch((error) => console.error("Failed to fetch biodiversity data:", error)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen label="Indexing biodiversity records" />
  if (!data) return <LoadingScreen label="Biodiversity network unavailable" />

  const total = data.pelagic + data.benthic + data.crustaceans + data.others
  const index = Math.min(10, Math.round((total / 50) * 10) / 10)
  const categories = [
    { name: "Pelagic", count: data.pelagic, icon: Waves, color: "#52e5d5", text: "Open-water species" },
    { name: "Benthic", count: data.benthic, icon: BarChart3, color: "#6aa9ff", text: "Seafloor communities" },
    { name: "Crustaceans", count: data.crustaceans, icon: Bug, color: "#b9ec71", text: "Crabs, shrimp and lobster" },
    { name: "Other taxa", count: data.others, icon: Leaf, color: "#ffc46b", text: "Flora and other organisms" },
  ]

  return (
    <div className="min-h-screen">
      <TopNavigation />
      <main className="page-shell">
        <PageIntro eyebrow="Biodiversity intelligence" title="Measure the living fabric of the ocean." description="Unify species records, ecosystem composition and molecular evidence to reveal change before it becomes loss." icon={Dna} accent="#b9ec71" action={{ label: "Open AI identification lab", href: "/ai-predictions" }} meta="IndOBIS-linked taxonomy" />

        <section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, idx) => <MetricTile key={category.name} label={category.name} value={category.count} detail={`${Math.round((category.count / total) * 100)}% of records · ${category.text}`} icon={category.icon} tone={( ["aqua", "blue", "lime", "amber"] as const)[idx]} />)}
        </section>

        <section className="mt-12">
          <SectionHeading eyebrow="Ecosystem composition" title="Biodiversity health picture" detail={`${total} validated species records`} />
          <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <BiodiversityChart data={data} />
            <Card className="relative">
              <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#79f2a4]" /> Blue biodiversity index</CardTitle><CardDescription>Composite ecosystem diversity and balance score</CardDescription></CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-2">
                  <div className="relative flex h-52 w-52 items-center justify-center rounded-full" style={{ background: `conic-gradient(#52e5d5 ${index * 10}%, rgba(255,255,255,.055) 0)` }}><div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-[#072535] shadow-[inset_0_0_30px_rgba(0,0,0,.3)]"><span className="text-6xl font-semibold tracking-[-0.07em] text-white">{index}</span><span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#79f2a4]">Excellent</span></div></div>
                  <div className="mt-7 grid w-full grid-cols-3 divide-x divide-white/[0.07] rounded-xl border border-white/[0.07] bg-white/[0.02] py-3 text-center"><div><p className="text-lg font-semibold text-white">{total}</p><p className="text-[9px] uppercase tracking-wider text-[#668c9b]">Species</p></div><div><p className="text-lg font-semibold text-white">4</p><p className="text-[9px] uppercase tracking-wider text-[#668c9b]">Guilds</p></div><div><p className="text-lg font-semibold text-[#79f2a4]">Stable</p><p className="text-[9px] uppercase tracking-wider text-[#668c9b]">Trend</p></div></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-12">
          <SectionHeading eyebrow="Taxonomic groups" title="What makes up this ecosystem" detail="Share of total observations" />
          <div className="grid gap-4 md:grid-cols-2">{categories.map((category) => { const share = Math.round((category.count / total) * 100); return <div key={category.name} className="content-surface p-5"><div className="flex items-center gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ color: category.color, backgroundColor: `${category.color}14` }}><category.icon className="h-5 w-5" /></div><div className="flex-1"><div className="flex items-end justify-between gap-4"><div><p className="font-semibold text-white">{category.name}</p><p className="text-xs text-[#6f94a4]">{category.text}</p></div><p className="font-mono text-sm text-[#a7c1ca]">{category.count} · {share}%</p></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full rounded-full" style={{ width: `${share}%`, backgroundColor: category.color }} /></div></div></div></div> })}</div>
        </section>
      </main>
    </div>
  )
}
