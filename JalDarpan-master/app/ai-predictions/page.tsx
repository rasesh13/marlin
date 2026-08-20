"use client"

import { BrainCircuit, Dna, Eye, FileCheck2, ScanSearch, ShieldCheck } from "lucide-react"
import { TopNavigation } from "@/components/top-navigation"
import { OtolithClassifier } from "@/components/ai/otolith-classifier"
import { DNASequencer } from "@/components/ai/dna-sequencer"
import { MetricTile, PageIntro, SectionHeading } from "@/components/page-chrome"

export default function AIPredictionsPage() {
  return (
    <div className="min-h-screen">
      <TopNavigation />
      <main className="page-shell">
        <PageIntro eyebrow="Marine AI laboratory" title="Turn biological evidence into identification." description="Two specialist AI workflows connect visual otolith morphology and DNA barcodes to transparent, confidence-scored species matches." icon={BrainCircuit} accent="#a986ff" action={{ label: "Review biodiversity", href: "/biodiversity" }} meta="Human-in-the-loop analysis" />

        <section className="mt-7 grid gap-4 md:grid-cols-3">
          <MetricTile label="Model confidence" value="94%" detail="Top otolith classification confidence in recent runs" icon={ScanSearch} tone="aqua" />
          <MetricTile label="Reference library" value="18.4K" detail="Marine species and validated genetic records" icon={Dna} tone="blue" />
          <MetricTile label="Explainability" value="Enabled" detail="Every result includes evidence, source and confidence" icon={ShieldCheck} tone="lime" />
        </section>

        <section className="mt-12">
          <SectionHeading eyebrow="Identification workbench" title="Choose an evidence pathway" detail="Image morphology · DNA barcode" />
          <div className="grid gap-5 lg:grid-cols-2"><OtolithClassifier /><DNASequencer /></div>
        </section>

        <section className="mt-12">
          <SectionHeading eyebrow="How it works" title="Research-grade, reviewable outputs" detail="Decision support — not a black box" />
          <div className="grid gap-4 md:grid-cols-3">
            {[{ icon: Eye, number: "01", title: "Capture evidence", text: "Upload a clear otolith image or paste a cleaned DNA barcode sequence." }, { icon: BrainCircuit, number: "02", title: "Model comparison", text: "MARLIN compares the evidence against curated marine reference libraries." }, { icon: FileCheck2, number: "03", title: "Review the match", text: "Inspect ranked results, confidence, taxonomic context and provenance before use." }].map((step) => <div key={step.number} className="content-surface p-6"><div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#efe9ff] text-[#7957c8]"><step.icon className="h-5 w-5" /></div><span className="font-mono text-xs text-[#748a8e]">{step.number}</span></div><h3 className="mt-6 text-lg font-semibold text-[#153d46]">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#6c8489]">{step.text}</p></div>)}
          </div>
        </section>
      </main>
    </div>
  )
}
