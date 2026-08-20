"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Thermometer, Droplets, Fish, BarChart3 } from "lucide-react"

interface StatsCardsProps {
  avgTemperature: number
  avgSalinity: number
  speciesCount: number
  biodiversityIndex: number
}

export function StatsCards({ avgTemperature, avgSalinity, speciesCount, biodiversityIndex }: StatsCardsProps) {
  const stats = [
    {
      title: "Avg Temperature",
      value: `${avgTemperature}°C`,
      detail: "Surface average / 30 days",
      icon: Thermometer,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Avg Salinity",
      value: `${avgSalinity} PSU`,
      detail: "Sensor network average",
      icon: Droplets,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Species Count",
      value: speciesCount.toLocaleString(),
      detail: "Observed records",
      icon: Fish,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Biodiversity Index",
      value: biodiversityIndex.toString(),
      detail: "Current ecosystem score",
      icon: BarChart3,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-white/10 bg-[#092b43] shadow-[0_8px_24px_rgba(0,0,0,0.14)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
