"use client"

import dynamic from "next/dynamic"
import { Activity, AlertTriangle, Map, MapPin, Radio, Satellite, ShieldCheck } from "lucide-react"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { MetricTile, PageIntro, SectionHeading } from "@/components/page-chrome"

const InteractiveMap = dynamic(() => import("@/components/interactive-map").then((mod) => ({ default: mod.InteractiveMap })), {
  ssr: false,
  loading: () => <Card className="h-[620px]"><CardContent className="flex h-full items-center justify-center"><div className="text-center"><div className="sonar-loader mx-auto"><span /><span /><span /></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#789baa]">Loading geospatial layers</p></div></CardContent></Card>,
})

export default function MapPage() {
  return (
    <div className="min-h-screen">
      <TopNavigation />
      <main className="page-shell">
        <PageIntro eyebrow="Geospatial command centre" title="One map. Every marine signal." description="Navigate observation stations, ecosystem alerts and regional conditions across India’s surrounding waters." icon={Map} accent="#6aa9ff" action={{ label: "View ocean telemetry", href: "/ocean-data" }} meta="Live station topology" />

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricTile label="Active stations" value="326" detail="Streaming observations across the network" icon={Radio} tone="lime" />
          <MetricTile label="Marine regions" value="42" detail="Coastal and offshore areas monitored" icon={MapPin} tone="blue" />
          <MetricTile label="Data feeds" value="12" detail="Integrated institutional data sources" icon={Satellite} tone="aqua" />
          <MetricTile label="Active alerts" value="03" detail="Two elevated · one under review" icon={AlertTriangle} tone="coral" />
        </section>

        <section className="mt-12">
          <SectionHeading eyebrow="Spatial intelligence" title="Marine monitoring network" detail="Select a station for live conditions" />
          <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#061e2c] p-2 shadow-[0_30px_90px_rgba(0,0,0,.28)]"><InteractiveMap /></div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[{ icon: Activity, title: "Operational picture", text: "Live environmental parameters and sensor health at every active station.", color: "#52e5d5" }, { icon: AlertTriangle, title: "Early warning layer", text: "HAB, thermal anomaly and pollution signals surfaced by location.", color: "#ff8d83" }, { icon: ShieldCheck, title: "Trusted provenance", text: "Institution, collection time and data quality travel with each observation.", color: "#b9ec71" }].map((item) => <div key={item.title} className="content-surface flex gap-4 p-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ color: item.color, backgroundColor: `${item.color}14` }}><item.icon className="h-5 w-5" /></div><div><h3 className="font-semibold text-white">{item.title}</h3><p className="mt-1 text-xs leading-5 text-[#789baa]">{item.text}</p></div></div>)}
        </section>
      </main>
    </div>
  )
}
