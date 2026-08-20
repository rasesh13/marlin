"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, TrendingDown, Zap, Bell, X } from "lucide-react"

interface Alert {
  id: string
  type: "temperature" | "salinity" | "species" | "pollution" | "weather"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  location: string
  timestamp: string
  acknowledged: boolean
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "temperature",
    severity: "high",
    title: "Temperature anomaly detected",
    description: "Surface temperature anomaly: +1.8°C against the 30-day regional baseline",
    location: "Arabian Sea · Western Indian coast · Source: INCOIS · Confidence: 87%",
    timestamp: "2026-08-20T12:30:00+05:30",
    acknowledged: false,
  },
  {
    id: "2",
    type: "species",
    severity: "medium",
    title: "Biodiversity shift under review",
    description: "Observation volume is above the recent regional range and requires validation",
    location: "Lakshadweep · Source: IndOBIS · Confidence: 82%",
    timestamp: "2026-08-20T11:45:00+05:30",
    acknowledged: false,
  },
  {
    id: "3",
    type: "pollution",
    severity: "critical",
    title: "HAB risk requires review",
    description: "SST and chlorophyll indicators are elevated; no confirmed event is reported",
    location: "Kerala coast · Source: INCOIS · Confidence: 79%",
    timestamp: "2026-08-20T10:15:00+05:30",
    acknowledged: true,
  },
]

export function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [filter, setFilter] = useState<"all" | "unacknowledged">("unacknowledged")

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
  }

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return TrendingUp
      case "species":
        return TrendingDown
      case "pollution":
        return AlertTriangle
      default:
        return Zap
    }
  }

  const filteredAlerts = filter === "all" ? alerts : alerts.filter((alert) => !alert.acknowledged)

  return (
    <Card id="alerts">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Real-Time Alerts
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === "unacknowledged" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unacknowledged")}
            >
              Unacknowledged ({alerts.filter((a) => !a.acknowledged).length})
            </Button>
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All ({alerts.length})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredAlerts.map((alert) => {
            const Icon = getSeverityIcon(alert.type)
            return (
              <div
                key={alert.id}
                  className={`border border-white/10 border-l-2 ${getSeverityColor(alert.severity)} bg-[#08263c] p-4`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{alert.title}</h4>
                        <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                          {alert.severity}
                        </Badge>
                        {alert.acknowledged && <Badge variant="outline">Acknowledged</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{alert.location}</span>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!alert.acknowledged && (
                      <Button variant="outline" size="sm" onClick={() => acknowledgeAlert(alert.id)}>
                        Acknowledge
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
          {filteredAlerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No alerts to display</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
