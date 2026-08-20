"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, BrainCircuit, Database, Fish, Globe2, Leaf, MapPin, Radio, ShieldCheck, Sparkles, Waves } from "lucide-react"
import { TopNavigation } from "@/components/top-navigation"
import { OceanParametersChart } from "@/components/charts/ocean-parameters-chart"
import { FishDistributionChart } from "@/components/charts/fish-distribution-chart"
import { RealTimeAlerts } from "@/components/real-time-alerts"
import { PredictiveAnalytics } from "@/components/predictive-analytics"
import { DataGlobe, MarineAIAndHealth } from "@/components/marine-intelligence-sections"
import { LoadingScreen, SectionHeading } from "@/components/page-chrome"

interface OceanData { date: string; temperature: number; salinity: number; chlorophyll: number }
interface FishData { species: string; abundance: number; region: string }

const domains = [
  { title: "Ocean state", eyebrow: "Observe", text: "Temperature, salinity, oxygen and chlorophyll in one continuous picture.", href: "/ocean-data", icon: Waves, color: "#007f83", tint: "#dff6f3" },
  { title: "Fisheries", eyebrow: "Understand", text: "Species distribution, stock signals and potential fishing-zone context.", href: "/fish-distribution", icon: Fish, color: "#2f66b6", tint: "#e7efff" },
  { title: "Biodiversity", eyebrow: "Protect", text: "Species records, ecosystem composition and molecular intelligence.", href: "/biodiversity", icon: Leaf, color: "#4f7a31", tint: "#edf7e5" },
]

export default function DashboardPage() {
  const [oceanData, setOceanData] = useState<OceanData[]>([])
  const [fishData, setFishData] = useState<FishData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetch("/api/ocean-data"), fetch("/api/fish-data")])
      .then(async ([ocean, fish]) => Promise.all([ocean.json(), fish.json()]))
      .then(([oceanResult, fishResult]) => {
        if (oceanResult.success) setOceanData(oceanResult.data)
        if (fishResult.success) setFishData(fishResult.data)
      })
      .catch((error) => console.error("Failed to fetch marine data:", error))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen label="Connecting to the marine network" />

  return (
    <div className="min-h-screen">
      <TopNavigation />
      <main>
        <section className="relative isolate min-h-[690px] overflow-hidden bg-[#031b2a] text-white lg:min-h-[720px]">
          <Image src="/marine-intelligence-hero.png" alt="Satellite view of India and the Indian Ocean with marine data signals" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,18,31,.96)_0%,rgba(1,21,35,.84)_34%,rgba(1,24,39,.25)_68%,rgba(1,21,35,.18)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(1,18,30,.72)_100%)]" />
          <div className="relative mx-auto flex min-h-[690px] max-w-[1480px] flex-col justify-between px-5 py-16 sm:px-8 lg:min-h-[720px] lg:px-12 lg:py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b7fff3] backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-[#7effc2] shadow-[0_0_10px_#7effc2]" /> India&apos;s marine intelligence network</div>
              <h1 className="mt-7 max-w-xl text-balance text-[3.4rem] font-semibold leading-[.93] tracking-[-0.065em] sm:text-7xl lg:text-[5.5rem]">The ocean is speaking.</h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#c3d9e0]">MARLIN turns millions of scattered ocean, fisheries and biodiversity records into one clear, trusted decision layer.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/map" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#65ead9] px-6 text-sm font-bold text-[#03212c] shadow-[0_14px_40px_rgba(83,231,214,.2)] transition hover:-translate-y-0.5 hover:bg-[#8bf4e7]">Explore the living map <ArrowUpRight className="h-4 w-4" /></Link>
                <Link href="/ai-predictions" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"><Sparkles className="h-4 w-4 text-[#9cefe6]" /> Ask MARLIN</Link>
              </div>
            </div>

            <div className="mt-14 grid max-w-4xl grid-cols-2 overflow-hidden rounded-2xl border border-white/15 bg-[#021826]/65 backdrop-blur-xl md:grid-cols-4">
              {[["28.2°C", "Sea surface"], ["326", "Active sensors"], ["18,420", "Species records"], ["3", "Elevated alerts"]].map(([value, label], index) => <div key={label} className="border-white/10 p-4 even:border-l md:border-l md:first:border-l-0 lg:p-5"><div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${index === 3 ? "bg-[#ff9b87]" : "bg-[#6bf0dc]"}`} /><p className="text-xl font-semibold tracking-[-0.03em] md:text-2xl">{value}</p></div><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#8caab4]">{label}</p></div>)}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1480px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <section>
            <div className="max-w-3xl"><p className="eyebrow-plain">One source of marine truth</p><h2 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-[-0.045em] text-[#062a36] md:text-6xl">From raw observations to decisions that matter.</h2></div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {domains.map((domain) => <Link key={domain.title} href={domain.href} className="group relative overflow-hidden rounded-[1.75rem] border border-[#d9e6e5] bg-white p-7 shadow-[0_18px_60px_rgba(25,61,70,.07)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(25,61,70,.12)]"><div className="absolute -right-12 -top-12 h-36 w-36 rounded-full" style={{ background: domain.tint }} /><div className="relative"><div className="flex items-start justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: domain.tint, color: domain.color }}><domain.icon className="h-6 w-6" /></div><ArrowUpRight className="h-5 w-5 text-[#9eb3b6] transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#062a36]" /></div><p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: domain.color }}>{domain.eyebrow}</p><h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#062a36]">{domain.title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-[#647f85]">{domain.text}</p></div></Link>)}
            </div>
          </section>

          <section className="mt-24">
            <SectionHeading eyebrow="Current operating picture" title="What is happening in the water now" detail="Updated 14:30 IST" />
            <div className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
              <div className="relative overflow-hidden rounded-[2rem] bg-[#041f30] p-3 shadow-[0_28px_80px_rgba(7,37,48,.18)] sm:p-5"><DataGlobe /><div className="mt-3 grid grid-cols-3 divide-x divide-white/10 rounded-xl bg-white/[0.045] py-3 text-center"><div><p className="text-lg font-semibold text-white">42</p><p className="text-[9px] uppercase tracking-wider text-[#789aa7]">Regions</p></div><div><p className="text-lg font-semibold text-white">12</p><p className="text-[9px] uppercase tracking-wider text-[#789aa7]">Sources</p></div><div><p className="text-lg font-semibold text-[#70eedc]">Live</p><p className="text-[9px] uppercase tracking-wider text-[#789aa7]">Network</p></div></div></div>
              <div className="grid gap-5">
                <div className="rounded-[2rem] border border-[#ffd9d1] bg-[#fff5f1] p-6"><div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffe3dc] text-[#d14f3d]"><Radio className="h-5 w-5" /></div><span className="rounded-full bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#d14f3d]">High priority</span></div><p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d14f3d]">Arabian Sea</p><h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#3f2825]">Thermal anomaly detected</h3><p className="mt-3 text-sm leading-6 text-[#81645e]">Surface temperature is 1.8°C above the 30-day regional baseline.</p><Link href="/#alerts" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#9d3e31]">Review the signal <ArrowRight className="h-4 w-4" /></Link></div>
                <div className="rounded-[2rem] border border-[#d9e6e5] bg-white p-6 shadow-[0_18px_55px_rgba(25,61,70,.06)]"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-[#168b7d]" /><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#168b7d]">Trusted intelligence</p></div><h3 className="mt-5 text-xl font-semibold text-[#062a36]">Every insight keeps its source.</h3><div className="mt-5 space-y-3 text-sm">{[[Database,"INCOIS observation"],[BrainCircuit,"HAB model v2.4"],[Globe2,"Arabian Sea · 14:30 IST"]].map(([Icon,label]) => { const I = Icon as typeof Database; return <div key={label as string} className="flex items-center gap-3 rounded-xl bg-[#f1f7f6] px-3 py-2.5 text-[#526e75]"><I className="h-4 w-4 text-[#168b7d]" />{label as string}</div> })}</div></div>
              </div>
            </div>
          </section>

          <section className="mt-24 rounded-[2.25rem] bg-[#031f2e] p-4 shadow-[0_35px_100px_rgba(4,38,50,.2)] sm:p-7 lg:p-9"><MarineAIAndHealth /></section>

          <section id="alerts" className="mt-24">
            <SectionHeading eyebrow="Early warning" title="Signals that need attention" detail="Evidence-ranked" />
            <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><RealTimeAlerts /><PredictiveAnalytics /></div>
          </section>

          <section className="mt-24">
            <SectionHeading eyebrow="Network telemetry" title="Explore the evidence behind the picture" detail="30-day view" />
            <div className="grid gap-5 xl:grid-cols-2"><OceanParametersChart data={oceanData} /><FishDistributionChart data={fishData} /></div>
          </section>

          <section className="mt-24 overflow-hidden rounded-[2rem] bg-[#0a625f] px-7 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14 lg:py-12"><div><div className="flex items-center gap-2 text-[#abfff1]"><MapPin className="h-4 w-4" /><p className="text-[10px] font-bold uppercase tracking-[0.18em]">The complete operating picture</p></div><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.04em] md:text-4xl">See every observation in its geographic context.</h2></div><Link href="/map" className="mt-6 inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#075552] transition hover:-translate-y-0.5 lg:mt-0">Open map explorer <ArrowUpRight className="h-4 w-4" /></Link></section>
        </div>
      </main>
    </div>
  )
}
