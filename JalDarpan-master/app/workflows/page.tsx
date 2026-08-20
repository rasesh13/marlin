"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Database,
  Fish,
  Globe,
  Graph,
  KeyRound,
  Languages,
  Map,
  MapPin,
  Radio,
  Route,
  ShieldCheck,
  Siren,
  SquareGanttChart,
  Upload,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react"
import { TopNavigation } from "@/components/top-navigation"
import { DataGlobe } from "@/components/marine-intelligence-sections"
import { PageIntro, SectionHeading } from "@/components/page-chrome"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type Persona = "scientist" | "policymaker" | "public" | "community" | "partner" | "admin"
type RouteMode = "Text-to-SQL" | "RAG" | "Agentic Planner"

interface CortexResponse {
  route: RouteMode
  answer: string
  confidence: number
  sql?: string
  cypher?: string
  citations: string[]
  trace: string[]
}

interface CorrectionRecord {
  id: number
  question: string
  answer: string
  status: "pending" | "accepted" | "rejected"
  flaggedBy: string
  flaggedAt: string
}

interface SamplingCell {
  cell: string
  recency: number
  density: number
  coverageGap: number
  predictionVariance: number
  score: number
}

interface AlertRecord {
  id: number
  kind: "HAB" | "Pathogen"
  zone: string
  severity: "Low" | "Moderate" | "High"
  updatedAt: string
}

interface CommunityReport {
  id: number
  species: string
  quantity: number
  location: string
  timestamp: string
  photoName: string
  suggestedSpecies: string
  language: string
  source: "community"
}

interface IngestionEvent {
  id: number
  topic: string
  status: "committed" | "error"
  detail: string
  at: string
}

interface AuditEntry {
  id: number
  at: string
  actor: string
  action: string
  prevHash: string
  hash: string
}

interface ModelVersion {
  name: string
  version: string
  validationScore: number
  active: boolean
}

function toShortHash(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return `h${Math.abs(hash).toString(16).padStart(8, "0")}`
}

function classifyRoute(question: string): RouteMode {
  const q = question.toLowerCase()
  const numericSignals = /count|average|avg|sum|mean|how many|top \d|percent|trend|last 30|monthly/.test(q)
  const unstructuredSignals = /report|note|memo|summary|narrative|document|observation log/.test(q)
  if (numericSignals && unstructuredSignals) return "Agentic Planner"
  if (numericSignals) return "Text-to-SQL"
  if (unstructuredSignals) return "RAG"
  return "Agentic Planner"
}

function buildCortexResponse(question: string): CortexResponse {
  const route = classifyRoute(question)
  if (route === "Text-to-SQL") {
    return {
      route,
      confidence: 89,
      answer:
        "Lakshadweep and central Arabian Sea stations show the strongest positive SST anomaly this month, with a moderate rise in HAB probability.",
      sql: "SELECT region, AVG(sst_anomaly) AS mean_anomaly, AVG(hab_probability) AS mean_hab FROM marine_observations WHERE observed_at >= CURRENT_DATE - INTERVAL '30 days' GROUP BY region ORDER BY mean_anomaly DESC LIMIT 5;",
      citations: [
        "INCOIS Ocean Grid 2026-08 snapshot",
        "PostGIS cell observations (30-day window)",
        "HAB risk feature table v2.4",
      ],
      trace: [
        "Intent parser identified numeric request",
        "Text-to-SQL generated Postgres query",
        "Result post-processor attached citations and confidence",
      ],
    }
  }

  if (route === "RAG") {
    return {
      route,
      confidence: 84,
      answer:
        "Field notes from the west coast indicate recurring algal bloom sightings near river mouths after heavy rainfall, with uncertainty about persistence beyond 72 hours.",
      citations: [
        "Survey notes: West Coast Cruise CW-17",
        "Regional biodiversity report Q2",
        "Operator memo: Bloom monitoring escalation",
      ],
      trace: [
        "Intent parser identified unstructured request",
        "Retriever pulled top-5 note chunks",
        "RAG synthesis generated grounded summary",
      ],
    }
  }

  return {
    route,
    confidence: 81,
    answer:
      "The planner combined SQL trends, note-based context, and model inference. Highest concern appears in two PFZ-adjacent cells where contamination risk and bloom variance both increased.",
    sql: "SELECT cell_id, recency_score, sampling_density, coverage_gap, pred_variance FROM pg_grid_scores WHERE region IN ('Arabian Sea','Lakshadweep') ORDER BY (0.25*recency_score + 0.25*sampling_density + 0.25*coverage_gap + 0.25*pred_variance) DESC LIMIT 6;",
    cypher:
      "MATCH (n:SurveyNote)-[:MENTIONS]->(z:Zone) WHERE z.name IN ['Arabian Sea','Lakshadweep'] RETURN z.name, collect(n.id)[0..3] AS note_refs;",
    citations: [
      "PostGIS grid scoring view",
      "Neo4j note-zone graph",
      "ML inference service: risk-model v3.1",
    ],
    trace: [
      "Planner split request into SQL + RAG + ML tasks",
      "Sub-agent A fetched numeric anomalies",
      "Sub-agent B retrieved notes and reports",
      "Sub-agent C scored predictive variance",
      "Fusion stage reconciled conflicts and ranked hotspots",
    ],
  }
}

function createSamplingRoute(): SamplingCell[] {
  const base: Omit<SamplingCell, "score">[] = [
    { cell: "AS-17", recency: 92, density: 66, coverageGap: 81, predictionVariance: 79 },
    { cell: "AS-21", recency: 85, density: 73, coverageGap: 77, predictionVariance: 88 },
    { cell: "LS-04", recency: 79, density: 62, coverageGap: 90, predictionVariance: 86 },
    { cell: "BB-11", recency: 67, density: 81, coverageGap: 58, predictionVariance: 61 },
    { cell: "AN-09", recency: 74, density: 57, coverageGap: 84, predictionVariance: 80 },
  ]

  return base
    .map((row) => {
      const score = Math.round((row.recency + row.density + row.coverageGap + row.predictionVariance) / 4)
      return { ...row, score }
    })
    .sort((a, b) => b.score - a.score)
}

const blueHealthReferences = {
  ocean: 75,
  fisheries: 70,
  biodiversity: 78,
}

const initialModels: ModelVersion[] = [
  { name: "hab-risk-model", version: "v3.1.0", validationScore: 0.89, active: true },
  { name: "hab-risk-model", version: "v3.0.4", validationScore: 0.86, active: false },
  { name: "species-cv", version: "v2.6.2", validationScore: 0.93, active: true },
]

export default function WorkflowPrototypePage() {
  const [persona, setPersona] = useState<Persona>("scientist")
  const [oidcRole, setOidcRole] = useState<Persona>("scientist")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [query, setQuery] = useState("Show latest HAB trend and summarize notable field notes for Lakshadweep")
  const [cortex, setCortex] = useState<CortexResponse | null>(null)
  const [corrections, setCorrections] = useState<CorrectionRecord[]>([])
  const [samplingRoute, setSamplingRoute] = useState<SamplingCell[]>([])

  const [sst, setSst] = useState(61)
  const [catchTrend, setCatchTrend] = useState(57)
  const [biodiversityTrend, setBiodiversityTrend] = useState(72)
  const [blueHealthScore, setBlueHealthScore] = useState(0)
  const [isScoring, setIsScoring] = useState(false)

  const [alerts, setAlerts] = useState<AlertRecord[]>([
    { id: 1, kind: "HAB", zone: "Arabian Sea PFZ-2", severity: "Moderate", updatedAt: new Date().toLocaleTimeString() },
    { id: 2, kind: "Pathogen", zone: "Mumbai Shelf PFZ-5", severity: "Low", updatedAt: new Date().toLocaleTimeString() },
  ])

  const [offline, setOffline] = useState(true)
  const [species, setSpecies] = useState("")
  const [quantity, setQuantity] = useState("30")
  const [language, setLanguage] = useState("English")
  const [location, setLocation] = useState("13.0827, 80.2707")
  const [photoName, setPhotoName] = useState("")
  const [suggestedSpecies, setSuggestedSpecies] = useState("Awaiting image")
  const [queue, setQueue] = useState<CommunityReport[]>([])
  const [ingestionEvents, setIngestionEvents] = useState<IngestionEvent[]>([])

  const [apiConnected, setApiConnected] = useState(false)
  const [apiToken, setApiToken] = useState("partner-demo-token")
  const [graphqlQuery, setGraphqlQuery] = useState("query CustomPull { ocean(region: \"Arabian Sea\") { sst salinity } biodiversity(region: \"Arabian Sea\") { richness trend citations } }")
  const [partnerResponse, setPartnerResponse] = useState("Run REST or GraphQL to preview structured, cited payloads.")

  const [auditLog, setAuditLog] = useState<AuditEntry[]>([])
  const [models, setModels] = useState<ModelVersion[]>(initialModels)

  const oceanStatus = useMemo(() => Math.max(0, Math.min(100, 100 - Math.abs(sst - 55) * 1.5)), [sst])
  const fisheriesStatus = useMemo(() => Math.max(0, Math.min(100, catchTrend)), [catchTrend])
  const biodiversityStatus = useMemo(() => Math.max(0, Math.min(100, biodiversityTrend)), [biodiversityTrend])

  function appendAudit(actor: string, action: string) {
    setAuditLog((current) => {
      const prevHash = current.length > 0 ? current[current.length - 1].hash : "GENESIS"
      const at = new Date().toISOString()
      const hash = toShortHash(`${prevHash}|${at}|${actor}|${action}`)
      return [
        ...current,
        {
          id: current.length + 1,
          at,
          actor,
          action,
          prevHash,
          hash,
        },
      ]
    })
  }

  function runCortex() {
    const trimmed = query.trim()
    if (!trimmed) return
    const response = buildCortexResponse(trimmed)
    setCortex(response)
    appendAudit("scientist", `MARLIN-Cortex answered using ${response.route}`)
  }

  function flagIncorrect() {
    if (!cortex) return
    setCorrections((current) => [
      ...current,
      {
        id: current.length + 1,
        question: query,
        answer: cortex.answer,
        status: "pending",
        flaggedBy: "scientist",
        flaggedAt: new Date().toLocaleString(),
      },
    ])
    appendAudit("scientist", "Flagged answer as incorrect -> corrections table")
  }

  function recommendRoute() {
    setSamplingRoute(createSamplingRoute())
    appendAudit("scientist", "Requested AI-recommended sampling route")
  }

  function evaluateReport(report: CommunityReport) {
    const valid = report.species.trim().length > 0 && report.quantity > 0 && report.location.trim().length > 0
    const nextId = ingestionEvents.length + 1
    if (valid) {
      setIngestionEvents((current) => [
        {
          id: nextId,
          topic: "community.reports",
          status: "committed",
          detail: `Committed ${report.species} (${report.quantity} kg) from ${report.location}`,
          at: new Date().toLocaleTimeString(),
        },
        ...current,
      ])
      appendAudit("community", "Published report to community.reports and committed to Postgres")
      return
    }

    setIngestionEvents((current) => [
      {
        id: nextId,
        topic: "ingestion_errors",
        status: "error",
        detail: "Schema validation failed. Report logged to ingestion_errors.",
        at: new Date().toLocaleTimeString(),
      },
      ...current,
    ])
    appendAudit("community", "Schema validation failure captured in ingestion_errors")
  }

  function submitCommunityReport() {
    const report: CommunityReport = {
      id: queue.length + 1,
      species,
      quantity: Number(quantity),
      location,
      timestamp: new Date().toISOString(),
      photoName,
      suggestedSpecies,
      language,
      source: "community",
    }

    if (offline) {
      setQueue((current) => [...current, report])
      appendAudit("community", "Stored report in local offline queue")
      return
    }

    evaluateReport(report)
  }

  function syncQueue() {
    if (offline || queue.length === 0) return
    queue.forEach((item) => evaluateReport(item))
    setQueue([])
    appendAudit("community", "Background sync pushed queued reports")
  }

  function executeRestDemo() {
    setPartnerResponse(
      `GET /v1/ocean/zones?region=arabian-sea\n200 OK\n{\n  \"region\": \"Arabian Sea\",\n  \"sst\": 28.4,\n  \"biodiversityRichness\": 2260,\n  \"citations\": [\"INCOIS grid 2026-08\", \"MARLIN biodiversity index Q3\"]\n}`,
    )
    appendAudit("partner", "Pulled cited REST payload through API gateway")
  }

  function executeGraphqlDemo() {
    setPartnerResponse(
      `${graphqlQuery}\n\n{\n  \"data\": {\n    \"ocean\": { \"sst\": 28.4, \"salinity\": 34.7 },\n    \"biodiversity\": {\n      \"richness\": 2260,\n      \"trend\": \"upward\",\n      \"citations\": [\"Survey cruise CW-17\", \"MARLIN index Q3\"]\n    }\n  }\n}`,
    )
    appendAudit("partner", "Executed GraphQL nested query without over-fetching")
  }

  function reviewCorrection(id: number, status: "accepted" | "rejected") {
    setCorrections((current) => current.map((item) => (item.id === id ? { ...item, status } : item)))
    appendAudit("admin", `Reviewed correction #${id} as ${status}`)
  }

  function rollbackModel(version: string) {
    setModels((current) =>
      current.map((model) =>
        model.name === "hab-risk-model"
          ? {
              ...model,
              active: model.version === version,
            }
          : model,
      ),
    )
    appendAudit("admin", `MLflow rollback for hab-risk-model to ${version}`)
  }

  useEffect(() => {
    setIsScoring(true)
    const timer = window.setTimeout(() => {
      setBlueHealthScore(Math.round((oceanStatus + fisheriesStatus + biodiversityStatus) / 3))
      setIsScoring(false)
    }, 180)
    return () => window.clearTimeout(timer)
  }, [oceanStatus, fisheriesStatus, biodiversityStatus])

  useEffect(() => {
    const zones = ["Arabian Sea PFZ-2", "Lakshadweep PFZ-4", "Mumbai Shelf PFZ-5", "Andaman PFZ-1"]
    const kinds: Array<"HAB" | "Pathogen"> = ["HAB", "Pathogen"]
    const severities: Array<"Low" | "Moderate" | "High"> = ["Low", "Moderate", "High"]

    const timer = window.setInterval(() => {
      setAlerts((current) => {
        const next: AlertRecord = {
          id: current.length + 1,
          kind: kinds[Math.floor(Math.random() * kinds.length)],
          zone: zones[Math.floor(Math.random() * zones.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          updatedAt: new Date().toLocaleTimeString(),
        }
        return [next, ...current].slice(0, 6)
      })
    }, 10000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const lat = (8 + Math.random() * 14).toFixed(4)
    const lng = (68 + Math.random() * 20).toFixed(4)
    setLocation(`${lat}, ${lng}`)
  }, [])

  return (
    <div className="min-h-screen">
      <TopNavigation />
      <main className="page-shell">
        <PageIntro
          eyebrow="Persona workflow prototype"
          title="MARLIN product flows in one frontend sandbox"
          description="Frontend-only implementation of Scientist, Policymaker, Public, Community contributor, Research partner, and Admin workflows. Keycloak/OIDC, MARLIN-Cortex routing, offline ingestion, API access, and auditability are mocked for demonstration."
          icon={SquareGanttChart}
          accent="#5a9bff"
          meta="Prototype mode"
        />

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-[#d7e5e3] bg-white">
            <CardHeader>
              <CardTitle className="text-[#153d46]">Auth Gateway (OAuth2/OIDC + Keycloak)</CardTitle>
              <CardDescription>Choose a role, then start the journey with role-aware access constraints.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Select value={oidcRole} onValueChange={(value) => setOidcRole(value as Persona)}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scientist">Scientist</SelectItem>
                  <SelectItem value="policymaker">Policymaker</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="community">Fisherfolk / Community</SelectItem>
                  <SelectItem value="partner">Research Partner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  setIsAuthenticated(true)
                  setPersona(oidcRole)
                  appendAudit("gateway", `OIDC login success for ${oidcRole}`)
                }}
              >
                <KeyRound className="h-4 w-4" /> Sign in via Keycloak
              </Button>
              <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
                Sign out
              </Button>
              <Badge variant={isAuthenticated ? "default" : "secondary"}>
                {isAuthenticated ? `Authenticated as ${oidcRole}` : "Not authenticated"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-[#d7e5e3] bg-white">
            <CardHeader>
              <CardTitle className="text-[#153d46]">Role access policy</CardTitle>
              <CardDescription>Prototype constraints aligned to your exact workflow requirements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[#5f7980]">
              <p><span className="font-semibold text-[#153d46]">Scientist:</span> Full data, query console, correction tools, route recommendation.</p>
              <p><span className="font-semibold text-[#153d46]">Policymaker:</span> Blue Health Index, what-if sliders, live risk alerts.</p>
              <p><span className="font-semibold text-[#153d46]">Public:</span> Simplified read-only dashboard.</p>
              <p><span className="font-semibold text-[#153d46]">Community:</span> Offline-first reporting with schema-safe ingestion.</p>
              <p><span className="font-semibold text-[#153d46]">Partner:</span> REST + GraphQL cited access via API gateway.</p>
              <p><span className="font-semibold text-[#153d46]">Admin:</span> Corrections review, RBAC oversight, audit chain, model rollback.</p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <SectionHeading eyebrow="Role workflow console" title="Interactive persona views" detail="Frontend prototype only" />

          <Tabs value={persona} onValueChange={(value) => setPersona(value as Persona)} className="gap-4">
            <TabsList className="h-auto flex-wrap bg-[#e9f2f1] p-1">
              <TabsTrigger value="scientist">Scientist</TabsTrigger>
              <TabsTrigger value="policymaker">Policymaker</TabsTrigger>
              <TabsTrigger value="public">Public</TabsTrigger>
              <TabsTrigger value="community">Community App</TabsTrigger>
              <TabsTrigger value="partner">Research Partner</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="scientist" className="space-y-4">
              <Card className="border-[#d7e5e3] bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#153d46]"><BrainCircuit className="h-5 w-5 text-[#0a7f7b]" /> Scientist workflow</CardTitle>
                  <CardDescription>MARLIN-Cortex routes each natural-language question to Text-to-SQL, RAG, or agentic decomposition.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-20" />
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={runCortex}>Run in NL query console</Button>
                    <Button variant="outline" onClick={flagIncorrect} disabled={!cortex}>Flag as incorrect</Button>
                    <Button variant="outline" onClick={recommendRoute}>AI-recommended sampling route</Button>
                    <Link href="/map" className="inline-flex h-9 items-center justify-center rounded-xl border border-[#d7e5e3] px-4 text-sm font-semibold text-[#153d46]">Explore via 3D globe/charts</Link>
                  </div>

                  {cortex && (
                    <div className="rounded-2xl border border-[#d7e5e3] bg-[#f8fbfa] p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{cortex.route}</Badge>
                        <Badge variant="outline">Confidence {cortex.confidence}%</Badge>
                        <Badge variant="secondary">Citations {cortex.citations.length}</Badge>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#153d46]">{cortex.answer}</p>
                      <div className="mt-3"><Progress value={cortex.confidence} /></div>

                      <Accordion type="multiple" className="mt-3 rounded-xl border border-[#d7e5e3] bg-white px-3">
                        {cortex.sql && (
                          <AccordionItem value="sql">
                            <AccordionTrigger>Generated SQL</AccordionTrigger>
                            <AccordionContent>
                              <pre className="overflow-x-auto text-xs text-[#254e56]">{cortex.sql}</pre>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                        {cortex.cypher && (
                          <AccordionItem value="cypher">
                            <AccordionTrigger>Generated Cypher</AccordionTrigger>
                            <AccordionContent>
                              <pre className="overflow-x-auto text-xs text-[#254e56]">{cortex.cypher}</pre>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      </Accordion>

                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#678289]">Source citations</p>
                          <ul className="mt-2 space-y-1 text-sm text-[#43636a]">
                            {cortex.citations.map((item) => <li key={item}>• {item}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#678289]">Sub-agent trace</p>
                          <ul className="mt-2 space-y-1 text-sm text-[#43636a]">
                            {cortex.trace.map((item) => <li key={item}>• {item}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                <Card className="border-[#d7e5e3] bg-white">
                  <CardHeader>
                    <CardTitle className="text-[#153d46]">Prioritized sampling/cruise route</CardTitle>
                    <CardDescription>PostGIS grid cells scored by recency, density, coverage gaps, and prediction variance.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cell</TableHead>
                          <TableHead>Recency</TableHead>
                          <TableHead>Density</TableHead>
                          <TableHead>Coverage Gap</TableHead>
                          <TableHead>Variance</TableHead>
                          <TableHead>Priority</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {samplingRoute.map((row) => (
                          <TableRow key={row.cell}>
                            <TableCell>{row.cell}</TableCell>
                            <TableCell>{row.recency}</TableCell>
                            <TableCell>{row.density}</TableCell>
                            <TableCell>{row.coverageGap}</TableCell>
                            <TableCell>{row.predictionVariance}</TableCell>
                            <TableCell className="font-semibold text-[#0a7f7b]">{row.score}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="border-[#d7e5e3] bg-white">
                  <CardHeader>
                    <CardTitle className="text-[#153d46]">Scientist dashboard explorer</CardTitle>
                    <CardDescription>Prototype visual exploration surface (map/charts/dashboard).</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-hidden rounded-xl border border-[#d7e5e3] bg-[#041f30] p-2">
                      <DataGlobe />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="policymaker" className="space-y-4">
              <Card className="border-[#d7e5e3] bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#153d46]"><ShieldCheck className="h-5 w-5 text-[#0a7f7b]" /> Policymaker dashboard</CardTitle>
                  <CardDescription>Blue Health Index with live what-if sliders and role-safe summaries only.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-3">
                    <Card className="border-[#d7e5e3] bg-[#f8fbfa] py-4">
                      <CardContent>
                        <p className="text-xs uppercase tracking-[0.13em] text-[#678289]">Ocean condition</p>
                        <p className="mt-2 text-3xl font-semibold text-[#153d46]">{Math.round(oceanStatus)}</p>
                        <p className="text-xs text-[#678289]">Reference {blueHealthReferences.ocean} · trend +2.1%</p>
                      </CardContent>
                    </Card>
                    <Card className="border-[#d7e5e3] bg-[#f8fbfa] py-4">
                      <CardContent>
                        <p className="text-xs uppercase tracking-[0.13em] text-[#678289]">Fisheries</p>
                        <p className="mt-2 text-3xl font-semibold text-[#153d46]">{Math.round(fisheriesStatus)}</p>
                        <p className="text-xs text-[#678289]">Reference {blueHealthReferences.fisheries} · trend +1.4%</p>
                      </CardContent>
                    </Card>
                    <Card className="border-[#d7e5e3] bg-[#f8fbfa] py-4">
                      <CardContent>
                        <p className="text-xs uppercase tracking-[0.13em] text-[#678289]">Biodiversity</p>
                        <p className="mt-2 text-3xl font-semibold text-[#153d46]">{Math.round(biodiversityStatus)}</p>
                        <p className="text-xs text-[#678289]">Reference {blueHealthReferences.biodiversity} · trend +2.8%</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="rounded-2xl border border-[#d7e5e3] bg-[#f8fbfa] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#153d46]">Composite Blue Health Index</p>
                      <Badge variant="outline">{isScoring ? "Lightweight API recomputing..." : `Score ${blueHealthScore}`}</Badge>
                    </div>
                    <Progress value={blueHealthScore} />
                    <div className="mt-4 grid gap-4">
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.13em] text-[#678289]">SST scenario</p>
                        <Slider value={[sst]} max={100} step={1} onValueChange={(value) => setSst(value[0] ?? sst)} />
                      </div>
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.13em] text-[#678289]">Catch trend scenario</p>
                        <Slider value={[catchTrend]} max={100} step={1} onValueChange={(value) => setCatchTrend(value[0] ?? catchTrend)} />
                      </div>
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.13em] text-[#678289]">Biodiversity trend scenario</p>
                        <Slider value={[biodiversityTrend]} max={100} step={1} onValueChange={(value) => setBiodiversityTrend(value[0] ?? biodiversityTrend)} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <Card className="border-[#d7e5e3] bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#153d46]"><Radio className="h-5 w-5 text-[#0a7f7b]" /> Live HAB/pathogen WebSocket alerts</CardTitle>
                    <CardDescription>Push-style alert feed for policy risk briefings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between rounded-xl border border-[#d7e5e3] bg-[#f8fbfa] px-3 py-2">
                        <div>
                          <p className="text-sm font-semibold text-[#153d46]">{alert.kind} alert · {alert.zone}</p>
                          <p className="text-xs text-[#678289]">{alert.updatedAt}</p>
                        </div>
                        <Badge variant={alert.severity === "High" ? "destructive" : "outline"}>{alert.severity}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-[#d7e5e3] bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#153d46]"><Map className="h-5 w-5 text-[#0a7f7b]" /> PFZ safety cross-reference</CardTitle>
                    <CardDescription>INCOIS PFZ zone overlays against pollution/risk to balance fish presence with safety.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>PFZ Zone</TableHead>
                          <TableHead>Fish Presence</TableHead>
                          <TableHead>Pollution / Risk</TableHead>
                          <TableHead>Safe to fish?</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow><TableCell>PFZ-2</TableCell><TableCell>High</TableCell><TableCell>Moderate HAB</TableCell><TableCell><Badge variant="outline">Caution</Badge></TableCell></TableRow>
                        <TableRow><TableCell>PFZ-4</TableCell><TableCell>Medium</TableCell><TableCell>Low risk</TableCell><TableCell><Badge>Yes</Badge></TableCell></TableRow>
                        <TableRow><TableCell>PFZ-5</TableCell><TableCell>High</TableCell><TableCell>Elevated pathogen</TableCell><TableCell><Badge variant="destructive">No</Badge></TableCell></TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="public" className="space-y-4">
              <Card className="border-[#d7e5e3] bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#153d46]"><Users className="h-5 w-5 text-[#0a7f7b]" /> Public read-only dashboard</CardTitle>
                  <CardDescription>Simplified view without correction tools, raw SQL/Cypher, or full query console internals.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-[#d7e5e3] bg-[#f8fbfa] p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#678289]">Ocean health</p><p className="mt-2 text-3xl font-semibold text-[#153d46]">74</p><p className="text-xs text-[#678289]">Stable</p></div>
                  <div className="rounded-xl border border-[#d7e5e3] bg-[#f8fbfa] p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#678289]">Biodiversity</p><p className="mt-2 text-3xl font-semibold text-[#153d46]">Good</p><p className="text-xs text-[#678289]">Improving in 2 regions</p></div>
                  <div className="rounded-xl border border-[#d7e5e3] bg-[#f8fbfa] p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#678289]">Safety alerts</p><p className="mt-2 text-3xl font-semibold text-[#153d46]">2</p><p className="text-xs text-[#678289]">Regional advisories</p></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community" className="space-y-4">
              <Card className="border-[#d7e5e3] bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#153d46]"><Fish className="h-5 w-5 text-[#0a7f7b]" /> Fisherfolk / community app (offline-first)</CardTitle>
                  <CardDescription>React Native behavior mocked in web UI: local queue, background sync, schema-safe ingestion.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="mx-auto w-full max-w-[340px] rounded-[2rem] border border-[#d7e5e3] bg-[#f8fbfa] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#153d46]">Community Reporter</p>
                      <div className="flex items-center gap-2">
                        {offline ? <WifiOff className="h-4 w-4 text-[#d75b4d]" /> : <Wifi className="h-4 w-4 text-[#0a7f7b]" />}
                        <Switch checked={offline} onCheckedChange={setOffline} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Species" value={species} onChange={(event) => setSpecies(event.target.value)} />
                      <Input placeholder="Quantity (kg)" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Tamil">Tamil</SelectItem>
                          <SelectItem value="Malayalam">Malayalam</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input value={location} readOnly />
                      <label className="block rounded-xl border border-[#d7e5e3] bg-white px-3 py-2 text-xs text-[#5f7980]">
                        <span className="mb-1 inline-flex items-center gap-1"><Upload className="h-3.5 w-3.5" /> Catch photo</span>
                        <input
                          type="file"
                          className="mt-1 block w-full text-xs"
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            if (!file) return
                            setPhotoName(file.name)
                            const lower = file.name.toLowerCase()
                            if (lower.includes("tuna")) setSuggestedSpecies("Yellowfin tuna")
                            else if (lower.includes("sard")) setSuggestedSpecies("Oil sardine")
                            else setSuggestedSpecies("Threadfin bream")
                          }}
                        />
                      </label>
                      <div className="rounded-xl border border-[#d7e5e3] bg-white px-3 py-2 text-xs">
                        <p className="font-semibold text-[#153d46]">CV suggestion</p>
                        <p className="text-[#5f7980]">{suggestedSpecies} (suggestion, not authoritative)</p>
                      </div>
                      <Button className="w-full" onClick={submitCommunityReport}>Submit report</Button>
                      <Button className="w-full" variant="outline" onClick={syncQueue} disabled={offline || queue.length === 0}>Reconnect and background sync</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card className="border-[#d7e5e3] bg-[#f8fbfa] py-4">
                      <CardHeader>
                        <CardTitle className="text-[#153d46]">Offline queue</CardTitle>
                        <CardDescription>{queue.length} queued reports pending sync</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {queue.length === 0 ? (
                          <p className="text-sm text-[#678289]">No queued reports.</p>
                        ) : (
                          <Table>
                            <TableHeader><TableRow><TableHead>Species</TableHead><TableHead>Qty</TableHead><TableHead>Language</TableHead><TableHead>Source</TableHead></TableRow></TableHeader>
                            <TableBody>
                              {queue.map((row) => (
                                <TableRow key={`${row.id}-${row.timestamp}`}>
                                  <TableCell>{row.species || "(missing)"}</TableCell>
                                  <TableCell>{row.quantity}</TableCell>
                                  <TableCell>{row.language}</TableCell>
                                  <TableCell>{row.source}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-[#d7e5e3] bg-[#f8fbfa] py-4">
                      <CardHeader>
                        <CardTitle className="text-[#153d46]">Ingestion pipeline outcomes</CardTitle>
                        <CardDescription>community.reports -> schema validation -> Postgres commit or ingestion_errors</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {ingestionEvents.length === 0 ? (
                          <p className="text-sm text-[#678289]">No ingestion events yet.</p>
                        ) : (
                          <Table>
                            <TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Status</TableHead><TableHead>Detail</TableHead><TableHead>At</TableHead></TableRow></TableHeader>
                            <TableBody>
                              {ingestionEvents.map((event) => (
                                <TableRow key={event.id}>
                                  <TableCell>{event.topic}</TableCell>
                                  <TableCell>{event.status === "committed" ? <Badge>committed</Badge> : <Badge variant="destructive">error</Badge>}</TableCell>
                                  <TableCell>{event.detail}</TableCell>
                                  <TableCell>{event.at}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partner" className="space-y-4">
              <Card className="border-[#d7e5e3] bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#153d46]"><Globe className="h-5 w-5 text-[#0a7f7b]" /> Research partner / external consumer</CardTitle>
                  <CardDescription>API gateway auth with REST and GraphQL access to structured, cited data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Input value={apiToken} onChange={(event) => setApiToken(event.target.value)} className="max-w-md" />
                    <Button onClick={() => { setApiConnected(Boolean(apiToken.trim())); appendAudit("partner", "Authenticated at API gateway") }}>Authenticate at Gateway</Button>
                    <Badge variant={apiConnected ? "default" : "secondary"}>{apiConnected ? "Authenticated" : "Not authenticated"}</Badge>
                  </div>

                  <Tabs defaultValue="rest" className="gap-3">
                    <TabsList>
                      <TabsTrigger value="rest">REST</TabsTrigger>
                      <TabsTrigger value="graphql">GraphQL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="rest" className="space-y-2">
                      <p className="text-sm text-[#5f7980]">Standard CRUD-style access for integrations.</p>
                      <Button variant="outline" onClick={executeRestDemo}>Run REST example</Button>
                    </TabsContent>
                    <TabsContent value="graphql" className="space-y-2">
                      <p className="text-sm text-[#5f7980]">Nested pull for custom ocean + biodiversity fields without over-fetching.</p>
                      <Textarea value={graphqlQuery} onChange={(event) => setGraphqlQuery(event.target.value)} className="min-h-24" />
                      <Button variant="outline" onClick={executeGraphqlDemo}>Run GraphQL example</Button>
                    </TabsContent>
                  </Tabs>

                  <pre className="overflow-x-auto rounded-xl border border-[#d7e5e3] bg-[#f8fbfa] p-3 text-xs text-[#23474f]">{partnerResponse}</pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <Card className="border-[#d7e5e3] bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#153d46]"><Siren className="h-5 w-5 text-[#0a7f7b]" /> Admin operations</CardTitle>
                  <CardDescription>Human-in-the-loop corrections, RBAC oversight, tamper-evident audit, and MLflow rollback controls.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Card className="border-[#d7e5e3] bg-[#f8fbfa] py-4">
                    <CardHeader>
                      <CardTitle className="text-[#153d46]">Corrections review queue</CardTitle>
                      <CardDescription>Flagged answers from Scientist flow are written to the corrections table.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {corrections.length === 0 ? (
                        <p className="text-sm text-[#678289]">No flagged items yet.</p>
                      ) : (
                        <Table>
                          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Question</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                          <TableBody>
                            {corrections.map((record) => (
                              <TableRow key={record.id}>
                                <TableCell>{record.id}</TableCell>
                                <TableCell className="max-w-[300px] truncate">{record.question}</TableCell>
                                <TableCell><Badge variant={record.status === "pending" ? "outline" : record.status === "accepted" ? "default" : "destructive"}>{record.status}</Badge></TableCell>
                                <TableCell className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => reviewCorrection(record.id, "accepted")}>Accept</Button>
                                  <Button size="sm" variant="destructive" onClick={() => reviewCorrection(record.id, "rejected")}>Reject</Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <Card className="border-[#d7e5e3] bg-[#f8fbfa] py-4">
                      <CardHeader>
                        <CardTitle className="text-[#153d46]">RBAC overview</CardTitle>
                        <CardDescription>Role scopes for dashboard functions.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-[#5f7980]">
                        <p><span className="font-semibold text-[#153d46]">Scientist:</span> Full data + corrections + route recommendation.</p>
                        <p><span className="font-semibold text-[#153d46]">Policymaker:</span> Blue Health Index + alerts + PFZ safety.</p>
                        <p><span className="font-semibold text-[#153d46]">Public:</span> Read-only summary.</p>
                        <p><span className="font-semibold text-[#153d46]">Community:</span> Report submit + sync only.</p>
                        <p><span className="font-semibold text-[#153d46]">Partner:</span> API access only.</p>
                      </CardContent>
                    </Card>

                    <Card className="border-[#d7e5e3] bg-[#f8fbfa] py-4">
                      <CardHeader>
                        <CardTitle className="text-[#153d46]">MLflow model registry</CardTitle>
                        <CardDescription>Monitor versions and rollback on validation regression.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader><TableRow><TableHead>Model</TableHead><TableHead>Version</TableHead><TableHead>Validation</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                          <TableBody>
                            {models.map((model) => (
                              <TableRow key={`${model.name}-${model.version}`}>
                                <TableCell>{model.name}</TableCell>
                                <TableCell>{model.version}</TableCell>
                                <TableCell>{model.validationScore}</TableCell>
                                <TableCell>{model.active ? <Badge>Active</Badge> : <Badge variant="outline">Inactive</Badge>}</TableCell>
                                <TableCell>
                                  <Button size="sm" variant="outline" disabled={model.active || model.name !== "hab-risk-model"} onClick={() => rollbackModel(model.version)}>Rollback</Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-[#d7e5e3] bg-[#f8fbfa] py-4">
                    <CardHeader>
                      <CardTitle className="text-[#153d46]">Append-only hash-chained audit log</CardTitle>
                      <CardDescription>Tamper-evidence for sensitive actions (prototype chain visualization).</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {auditLog.length === 0 ? (
                        <p className="text-sm text-[#678289]">No actions recorded yet.</p>
                      ) : (
                        <Table>
                          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Actor</TableHead><TableHead>Action</TableHead><TableHead>Prev hash</TableHead><TableHead>Hash</TableHead></TableRow></TableHeader>
                          <TableBody>
                            {auditLog.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.actor}</TableCell>
                                <TableCell>{item.action}</TableCell>
                                <TableCell className="font-mono text-xs">{item.prevHash}</TableCell>
                                <TableCell className="font-mono text-xs">{item.hash}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="mt-10 rounded-2xl border border-[#d7e5e3] bg-white p-6">
          <p className="text-sm text-[#5f7980]">Prototype notes: This page demonstrates full user workflow behavior in frontend only. Backend integrations like Keycloak token verification, WebSocket server streams, Kafka pipelines, Text-to-SQL execution, RAG retrieval, MLflow control, and PostGIS scoring are represented with mocked states and simulated responses for demo readiness.</p>
        </section>
      </main>
    </div>
  )
}
