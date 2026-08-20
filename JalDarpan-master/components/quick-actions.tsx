"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, FileText, Settings, RefreshCw, AlertCircle } from "lucide-react"
import { useState } from "react"

export function QuickActions() {
  const [isExporting, setIsExporting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [notice, setNotice] = useState("")

  const handleExportData = async () => {
    setIsExporting(true)
    const response = await fetch("/api/ocean-data")
    const result = await response.json()
    const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "marlin-ocean-data.json"
    link.click()
    URL.revokeObjectURL(url)
    setIsExporting(false)
    setNotice("Ocean data exported successfully")
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    const response = await fetch("/api/generate-report")
    const report = await response.blob()
    const url = URL.createObjectURL(report)
    const link = document.createElement("a")
    link.href = url
    link.download = "marlin-network-report.txt"
    link.click()
    URL.revokeObjectURL(url)
    setIsGenerating(false)
    setNotice("Network report downloaded")
  }

  const handleShareDashboard = async () => {
    try {
      if (navigator.share) await navigator.share({ title: "MARLIN dashboard", url: window.location.href })
      else await navigator.clipboard.writeText(window.location.href)
      setNotice("Dashboard link ready to share")
    } catch {
      setNotice("Sharing was cancelled")
    }
  }

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    setIsRefreshing(false)
    window.location.reload()
  }

  const handleSetAlerts = () => {
    document.getElementById("alerts")?.scrollIntoView({ behavior: "smooth" })
    setNotice("Alerts panel opened")
  }

  const handleConfigure = () => {
    setNotice("Dashboard settings are available from the account menu")
  }

  return (
    <Card className="h-full border-white/10 bg-[#092b43] shadow-[0_8px_24px_rgba(0,0,0,0.14)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#567087]">Operations</p><CardTitle className="mt-1 text-lg">Quick actions</CardTitle></div><span className="text-xs text-[#567087]">20 Aug 2026</span></div>
      </CardHeader>
      <CardContent>
        {notice && <p className="mb-4 rounded-lg border border-[#27d3c2]/30 bg-[#27d3c2]/10 px-3 py-2 text-sm text-[#a8f1e8]" role="status">{notice}</p>}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button
            variant="outline"
            className="flex h-10 flex-row gap-2 border-white/10 bg-[#0b3a5b]/40 py-2 transition-all duration-200 hover:border-[#13c8d8]/50 hover:bg-[#0b3a5b]"
            onClick={handleExportData}
            disabled={isExporting}
          >
            <Download className={`w-5 h-5 ${isExporting ? "animate-bounce" : ""}`} />
            <span className="text-xs">{isExporting ? "Exporting..." : "Export"}</span>
          </Button>

          <Button
            variant="outline"
            className="flex h-10 flex-row gap-2 border-white/10 bg-[#0b3a5b]/40 py-2 transition-all duration-200 hover:border-[#13c8d8]/50 hover:bg-[#0b3a5b]"
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            <FileText className={`w-5 h-5 ${isGenerating ? "animate-pulse" : ""}`} />
            <span className="text-xs">{isGenerating ? "Generating..." : "Report"}</span>
          </Button>

          <Button
            variant="outline"
            className="flex h-10 flex-row gap-2 border-white/10 bg-[#0b3a5b]/40 py-2 transition-all duration-200 hover:border-[#13c8d8]/50 hover:bg-[#0b3a5b]"
            onClick={handleShareDashboard}
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs">Share</span>
          </Button>

          <Button
            variant="outline"
            className="flex h-10 flex-row gap-2 border-white/10 bg-[#0b3a5b]/40 py-2 transition-all duration-200 hover:border-[#13c8d8]/50 hover:bg-[#0b3a5b]"
            onClick={handleRefreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="text-xs">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>

          <Button
            variant="outline"
            className="hidden h-10 flex-row gap-2 border-white/10 bg-[#0b3a5b]/40 py-2 transition-all duration-200 hover:border-[#13c8d8]/50 hover:bg-[#0b3a5b] sm:flex"
            onClick={handleSetAlerts}
          >
            <AlertCircle className="w-5 h-5" />
            <span className="text-xs">Alerts</span>
          </Button>

          <Button
            variant="outline"
            className="flex h-10 flex-row gap-2 border-white/10 bg-[#0b3a5b]/40 py-2 transition-all duration-200 hover:border-[#13c8d8]/50 hover:bg-[#0b3a5b]"
            onClick={handleConfigure}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Configure</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
