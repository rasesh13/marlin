"use client"

import { useState } from "react"
import { Activity, ArrowUpRight, Brain, Check, ChevronRight, Database, Droplets, Fish, Globe2, Leaf, MapPin, Radio, Search, ShieldCheck, Sparkles, Waves, Zap } from "lucide-react"

export function DataGlobe() {
  const [selected, setSelected] = useState("Arabian Sea")
  const [layers, setLayers] = useState({ observations: true, sensors: true, pfz: false })
  const points = [
    { x: 27, y: 45, label: "Mumbai coast" },
    { x: 38, y: 70, label: "Lakshadweep" },
    { x: 65, y: 50, label: "Chennai coast" },
    { x: 81, y: 38, label: "Andaman & Nicobar" },
  ]
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden border border-white/15 bg-[#08263c] p-3">
      <div className="absolute inset-3 border border-[#8dcfca]/15 bg-[#061f35]">
        <svg viewBox="0 0 100 80" className="h-full w-full" role="img" aria-label="Indian Ocean scientific map">
          <path d="M35 5 42 13 45 25 42 32 48 39 44 50 39 54 37 65 31 59 30 48 25 42 29 34 27 25Z" fill="#d7e5dc" stroke="#8dcfca" strokeWidth=".7" />
          <path d="M35 65 39 69 40 76 35 72Z" fill="#d7e5dc" stroke="#8dcfca" strokeWidth=".5" />
          <path d="M80 35 84 39 83 47 79 51 77 45Z" fill="#d7e5dc" stroke="#8dcfca" strokeWidth=".5" />
          <path d="M12 29 C28 34 42 40 58 47 S79 54 94 63" fill="none" stroke="#42b8c3" strokeWidth=".8" strokeDasharray="2 2" />
          <path d="M8 55 C24 48 40 52 56 58 S77 65 94 58" fill="none" stroke="#42b8c3" strokeWidth=".55" opacity=".7" />
          <path d="M4 10h92M4 28h92M4 46h92M4 64h92M22 4v72M44 4v72M66 4v72M88 4v72" stroke="#8dcfca" strokeWidth=".2" opacity=".22" />
          {layers.pfz && <path d="M8 44 C18 36 30 38 38 46 C29 52 17 53 8 44Z" fill="#f0b35a" opacity=".35" stroke="#f0b35a" strokeWidth=".5" />}
          <text x="8" y="19" fill="#8fb6c4" fontSize="3">ARABIAN SEA</text><text x="61" y="24" fill="#8fb6c4" fontSize="3">BAY OF BENGAL</text><text x="45" y="74" fill="#8fb6c4" fontSize="3">INDIAN OCEAN</text>
        </svg>
        {points.map((point) => <button key={point.label} type="button" aria-label={`Select ${point.label}`} onClick={() => setSelected(point.label)} className="absolute" style={{ left: `${point.x}%`, top: `${point.y}%` }}><span className={`block h-2.5 w-2.5 rounded-full border-2 border-[#d7f6f2] ${layers.observations ? "bg-[#13c8d8]" : "bg-[#567087]"}`} />{selected === point.label && <span className="absolute left-4 top-0 whitespace-nowrap text-[10px] text-[#d7f6f2]">{point.label}</span>}</button>)}
        <div className="absolute bottom-3 left-3 border-l-2 border-[#13c8d8] bg-[#062b49]/90 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#b8d7df]">{selected} · Demo Data</div>
      </div>
      <div className="absolute right-5 top-5 flex gap-1 text-[9px] uppercase tracking-wider"><button type="button" onClick={() => setLayers((current) => ({ ...current, observations: !current.observations }))} className={`border px-2 py-1 ${layers.observations ? "border-[#13c8d8] text-[#d7f6f2]" : "border-white/15 text-[#8fb6c4]"}`}>Observations</button><button type="button" onClick={() => setLayers((current) => ({ ...current, pfz: !current.pfz }))} className={`border px-2 py-1 ${layers.pfz ? "border-[#f0b35a] text-[#f0b35a]" : "border-white/15 text-[#8fb6c4]"}`}>PFZ</button></div>
    </div>
  )
}

export function LiveIntelligenceStrip() {
  const items = [["2.4M+", "observations"], ["18,420", "species records"], ["326", "active sensors"], ["42", "regions monitored"], ["12", "data sources"]]
  return <div className="grid grid-cols-2 divide-x divide-white/10 border-y border-white/10 bg-[#062b49]/70 py-4 backdrop-blur md:grid-cols-5">{items.map(([value, label]) => <div key={label} className="px-4 text-center first:text-left md:px-6"><p className="font-display text-xl font-semibold text-white">{value}</p><p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#8fb6c4]">{label}</p></div>)}<div className="col-span-2 mt-3 flex items-center justify-center gap-2 border-t border-white/10 px-4 pt-3 text-[10px] uppercase tracking-[0.12em] text-[#27d3c2] md:col-span-5"><span className="h-1.5 w-1.5 rounded-full bg-[#27d3c2]" /> Last synchronized 14:30 IST</div></div>
}

export function IntelligenceMetricCards() {
  const metrics = [
    { label: "Ocean condition", value: "28.2°C", detail: "Salinity 34.8 PSU · DO 6.2 mg/L", trend: "+0.8%", icon: Waves, color: "#13c8d8" },
    { label: "Biodiversity", value: "2,260", detail: "184 new observations · score 8.7", trend: "+12.4%", icon: Leaf, color: "#27d3c2" },
    { label: "Fisheries intelligence", value: "Stable", detail: "7 major species · PFZ overlap 64%", trend: "+4.1%", icon: Fish, color: "#6c9fe8" },
    { label: "Ecosystem risk", value: "Moderate", detail: "HAB signals · Arabian Sea focus", trend: "Watch", icon: Activity, color: "#f0b35a" },
  ]
  return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <div key={metric.label} className="group rounded-2xl border border-white/10 bg-[#092b43]/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-[#13c8d8]/40 hover:bg-[#0b3a5b]"><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${metric.color}18`, color: metric.color }}><metric.icon className="h-5 w-5" /></div><span className="text-xs font-medium" style={{ color: metric.color }}>{metric.trend}</span></div><p className="mt-5 text-xs uppercase tracking-[0.13em] text-[#8fb6c4]">{metric.label}</p><p className="mt-2 font-display text-3xl font-bold text-white">{metric.value}</p><p className="mt-2 text-xs leading-5 text-[#8fb6c4]">{metric.detail}</p><div className="mt-4 h-1 overflow-hidden rounded-full bg-[#0b3a5b]"><div className="h-full w-2/3 rounded-full" style={{ backgroundColor: metric.color }} /></div></div>)}</div>
}

export function MarineAIAndHealth() {
  const [query, setQuery] = useState("")
  const [submitted, setSubmitted] = useState("")
  const [sst, setSst] = useState(58)
  const [catchTrend, setCatchTrend] = useState(64)
  const [biodiversity, setBiodiversity] = useState(78)
  const score = Math.round(sst * 0.3 + catchTrend * 0.3 + biodiversity * 0.4)
  const ask = () => setSubmitted(query.trim() || "Which regions show increasing HAB risk?")
  return <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
    <section className="overflow-hidden rounded-2xl border border-[#13c8d8]/20 bg-[linear-gradient(135deg,#0b3a5b,#062b49)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] md:p-8"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#13c8d8]"><Brain className="h-4 w-4" /> MARLIN Intelligence</div><h2 className="mt-3 font-display text-2xl font-semibold text-white">Ask questions across India&apos;s marine data.</h2><p className="mt-2 text-sm text-[#8fb6c4]">Grounded answers with sources, confidence, and transparent data lineage.</p></div><Sparkles className="h-6 w-6 text-[#27d3c2]" /></div><div className="mt-6 flex overflow-hidden rounded-xl border border-white/10 bg-[#041827]/50"><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && ask()} placeholder="Ask MARLIN anything about the ocean..." className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-[#628b9c]" /><button onClick={ask} className="flex items-center gap-2 bg-[#13c8d8] px-4 text-sm font-semibold text-[#041827] transition hover:bg-[#27d3c2]"><Search className="h-4 w-4" /> Ask</button></div><div className="mt-4 flex flex-wrap gap-2">{["Which regions show increasing HAB risk?", "Compare Lakshadweep and Andaman", "What changed this month?"] .map((item) => <button key={item} onClick={() => { setQuery(item); setSubmitted(item) }} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#8fb6c4] transition hover:border-[#13c8d8]/40 hover:text-[#eaf7fa]">{item}</button>)}</div>{submitted && <div className="mt-6 border-t border-white/10 pt-5"><div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-[#27d3c2]"><Check className="h-4 w-4" /> Grounded response</div><p className="mt-3 text-sm leading-6 text-[#eaf7fa]">Signals indicate elevated HAB probability in the Arabian Sea corridor, driven by rising SST and chlorophyll-a across the latest 7-day observation window.</p><div className="mt-4 grid gap-2 text-xs text-[#8fb6c4] sm:grid-cols-3"><span>Confidence <b className="text-white">87%</b></span><span>Sources <b className="text-white">12 records</b></span><span>Model <b className="text-white">HAB-v2.4</b></span></div></div>}</section>
    <section className="rounded-2xl border border-white/10 bg-[#092b43] p-6 md:p-8"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.16em] text-[#8fb6c4]">Signature metric</p><h2 className="mt-2 font-display text-2xl font-semibold text-white">Blue Health Index</h2></div><ShieldCheck className="h-6 w-6 text-[#27d3c2]" /></div><div className="relative mx-auto mt-6 flex h-40 w-40 items-center justify-center rounded-full" style={{ background: `conic-gradient(#27d3c2 ${score}%, #103f5d 0)` }}><div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#092b43]"><span className="font-display text-4xl font-bold text-white">{score}</span><span className="text-xs uppercase tracking-wider text-[#27d3c2]">Good</span></div></div><div className="mt-6 space-y-3">{[["SST", sst, setSst], ["Catch trend", catchTrend, setCatchTrend], ["Biodiversity", biodiversity, setBiodiversity]].map(([label, value, setter]) => <label key={label as string} className="block text-xs text-[#8fb6c4]"> <span className="mb-1 flex justify-between"><span>{label as string}</span><span className="text-white">{value as number}</span></span><input type="range" min="0" max="100" value={value as number} onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))} className="w-full accent-[#13c8d8]" /></label>)}</div></section>
  </div>
}

export function EarlyWarningAndProvenance() {
  const warnings = [{ title: "HAB risk", value: "Moderate", region: "Arabian Sea", signal: "SST ↑ · Chlorophyll-a ↑", color: "#f0b35a" }, { title: "Pathogen risk", value: "Low", region: "Bay of Bengal", signal: "DO stable · Nutrients normal", color: "#27d3c2" }, { title: "Pollution risk", value: "Elevated", region: "Mumbai shelf", signal: "Litter reports ↑ · Currents east", color: "#e66f61" }]
  return <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]"><section><div className="mb-4 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.16em] text-[#13c8d8]">Predictive monitoring</p><h2 className="mt-2 font-display text-2xl font-semibold text-white">Marine Early Warning</h2></div><span className="text-xs text-[#8fb6c4]">Updated 14:30 IST</span></div><div className="grid gap-3 md:grid-cols-3">{warnings.map((warning) => <div key={warning.title} className="rounded-2xl border border-white/10 bg-[#092b43] p-5"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-[0.12em] text-[#8fb6c4]">{warning.title}</span><span className="h-2 w-2 rounded-full" style={{ backgroundColor: warning.color }} /></div><p className="mt-5 font-display text-2xl font-semibold" style={{ color: warning.color }}>{warning.value}</p><p className="mt-1 text-sm text-white">{warning.region}</p><p className="mt-5 text-xs leading-5 text-[#8fb6c4]">{warning.signal}</p><div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] uppercase tracking-wider text-[#8fb6c4]"><span>Confidence</span><span className="text-white">82%</span></div></div>)}</div></section><section className="rounded-2xl border border-white/10 bg-[#062b49] p-6"><div className="flex items-center gap-2 text-[#13c8d8]"><Database className="h-4 w-4" /><p className="text-xs uppercase tracking-[0.14em]">Trust layer</p></div><h2 className="mt-3 font-display text-xl font-semibold text-white">Every insight has a source.</h2><div className="mt-5 space-y-2">{[["Source", "INCOIS"], ["Ingestion", "Ocean reading"], ["Processing", "HAB model"], ["Insight", "Risk prediction"]].map(([label, value], index) => <div key={label} className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b3a5b] text-xs text-[#13c8d8]">{index + 1}</span><div><p className="text-[10px] uppercase tracking-wider text-[#628b9c]">{label}</p><p className="text-sm text-white">{value}</p></div>{index < 3 && <ChevronRight className="ml-auto h-4 w-4 text-[#628b9c]" />}</div>)}</div><div className="mt-5 flex items-center gap-2 text-xs text-[#8fb6c4]"><ShieldCheck className="h-4 w-4 text-[#27d3c2]" /> Model version HAB-v2.4 · 87% confidence</div></section></div>
}
