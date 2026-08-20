"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Brain, Target, Zap } from "lucide-react"

interface Prediction {
  id: string
  type: "temperature" | "species_migration" | "algae_bloom" | "weather_event"
  title: string
  description: string
  probability: number
  timeframe: string
  impact: "low" | "medium" | "high"
  location: string
  trend: "increasing" | "decreasing" | "stable"
}

const mockPredictions: Prediction[] = [
  {
    id: "1",
    type: "temperature",
    title: "Temperature Anomaly",
    description: "+1.8°C against the 30-day regional baseline",
    probability: 87,
    timeframe: "Western Indian coast · 7 days",
    impact: "high",
    location: "Arabian Sea",
    trend: "increasing",
  },
  {
    id: "2",
    type: "species_migration",
    title: "Biodiversity Shift",
    description: "Observation patterns are being monitored against the regional baseline",
    probability: 73,
    timeframe: "Lakshadweep · 14 days",
    impact: "medium",
    location: "Lakshadweep",
    trend: "stable",
  },
  {
    id: "3",
    type: "algae_bloom",
    title: "HAB Risk",
    description: "Environmental indicators are consistent with moderate HAB risk",
    probability: 92,
    timeframe: "Kerala coast · 7 days",
    impact: "high",
    location: "Arabian Sea",
    trend: "increasing",
  },
  {
    id: "4",
    type: "weather_event",
    title: "Fisheries Opportunity",
    description: "PFZ and environmental safety layers are available for review",
    probability: 65,
    timeframe: "Bay of Bengal · 5 days",
    impact: "medium",
    location: "Bay of Bengal",
    trend: "decreasing",
  },
]

export function PredictiveAnalytics() {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return TrendingUp
      case "decreasing":
        return TrendingDown
      default:
        return Target
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return TrendingUp
      case "species_migration":
        return Target
      case "algae_bloom":
        return Zap
      case "weather_event":
        return TrendingDown
      default:
        return Brain
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Marine Risk Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockPredictions.map((prediction) => {
            const TrendIcon = getTrendIcon(prediction.trend)
            const TypeIcon = getTypeIcon(prediction.type)

            return (
              <div key={prediction.id} className="p-4 border rounded-lg bg-muted/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <TypeIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{prediction.title}</h4>
                      <p className="text-sm text-muted-foreground">{prediction.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(prediction.impact)}>{prediction.impact} impact</Badge>
                    <TrendIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <p className="text-sm mb-4">{prediction.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Probability</span>
                    <span className="font-semibold">{prediction.probability}%</span>
                  </div>
                  <Progress value={prediction.probability} className="h-2" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Timeframe</span>
                    <span className="font-medium">{prediction.timeframe}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
