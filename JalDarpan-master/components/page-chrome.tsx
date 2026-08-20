import type { LucideIcon } from "lucide-react"
import type { CSSProperties } from "react"
import { Activity, ArrowUpRight } from "lucide-react"
import Link from "next/link"

interface PageIntroProps {
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  accent?: string
  action?: { label: string; href: string }
  meta?: string
}

export function PageIntro({ eyebrow, title, description, icon: Icon, accent = "#52e5d5", action, meta }: PageIntroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-grid" />
      <div className="relative z-10 max-w-3xl">
        <div className="eyebrow"><Icon className="h-3.5 w-3.5" /> {eyebrow}</div>
        <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#062a36] md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#607b82] md:text-lg">{description}</p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          {action && (
            <Link href={action.href} className="primary-action">
              {action.label}<ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[#6c898e]">
            <span className="live-dot" /> {meta ?? "Live intelligence network"}
          </span>
        </div>
      </div>
      <div className="page-hero-orb" style={{ "--orb-accent": accent } as CSSProperties}>
        <div className="page-hero-orb-core"><Icon className="h-10 w-10" /></div>
      </div>
    </section>
  )
}

interface MetricTileProps {
  label: string
  value: string | number
  detail: string
  icon: LucideIcon
  tone?: "aqua" | "blue" | "lime" | "amber" | "coral"
}

export function MetricTile({ label, value, detail, icon: Icon, tone = "aqua" }: MetricTileProps) {
  return (
    <div className={`metric-tile metric-${tone}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="metric-icon"><Icon className="h-5 w-5" /></div>
        <Activity className="h-4 w-4 opacity-50" />
      </div>
      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#71878b]">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#062a36]">{value}</p>
      <p className="mt-2 text-xs leading-5 text-[#71878b]">{detail}</p>
    </div>
  )
}

export function SectionHeading({ eyebrow, title, detail }: { eyebrow: string; title: string; detail?: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="eyebrow-plain">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#062a36] md:text-3xl">{title}</h2>
      </div>
      {detail && <p className="text-xs uppercase tracking-[0.13em] text-[#758d91]">{detail}</p>}
    </div>
  )
}

export function LoadingScreen({ label = "Synchronising marine intelligence" }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#03131f]">
      <div className="text-center">
        <div className="sonar-loader mx-auto"><span /><span /><span /></div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#789baa]">{label}</p>
      </div>
    </div>
  )
}
