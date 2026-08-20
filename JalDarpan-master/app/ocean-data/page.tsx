"use client"

import { useEffect, useState } from "react"
import { TopNavigation } from "@/components/top-navigation"
import { OceanParametersChart } from "@/components/charts/ocean-parameters-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Droplets, Leaf } from "lucide-react"

interface OceanData {
  date: string
  temperature: number
  salinity: number
  chlorophyll: number
}

export default function OceanDataPage() {
  const [oceanData, setOceanData] = useState<OceanData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/ocean-data")
        const result = await response.json()

        if (result.success) {
          setOceanData(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch ocean data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const latestData = oceanData[oceanData.length - 1]
  const avgTemp = oceanData.length > 0 ? oceanData.reduce((sum, d) => sum + d.temperature, 0) / oceanData.length : 0
  const avgSalinity = oceanData.length > 0 ? oceanData.reduce((sum, d) => sum + d.salinity, 0) / oceanData.length : 0
  const avgChlorophyll =
    oceanData.length > 0 ? oceanData.reduce((sum, d) => sum + d.chlorophyll, 0) / oceanData.length : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ocean data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Ocean Data Monitoring</h1>
            <p className="text-muted-foreground">
              Comprehensive ocean parameter tracking including temperature, salinity, and chlorophyll levels
            </p>
          </div>

          {/* Current Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Thermometer className="w-5 h-5 text-chart-1" />
                  Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current</span>
                    <Badge variant="secondary">{latestData?.temperature}°C</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">30-day Average</span>
                    <span className="text-sm font-medium">{Math.round(avgTemp * 10) / 10}°C</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Droplets className="w-5 h-5 text-chart-2" />
                  Salinity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current</span>
                    <Badge variant="secondary">{latestData?.salinity} PSU</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">30-day Average</span>
                    <span className="text-sm font-medium">{Math.round(avgSalinity * 10) / 10} PSU</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Leaf className="w-5 h-5 text-chart-3" />
                  Chlorophyll
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current</span>
                    <Badge variant="secondary">{latestData?.chlorophyll} mg/m³</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">30-day Average</span>
                    <span className="text-sm font-medium">{Math.round(avgChlorophyll * 100) / 100} mg/m³</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <div className="mb-8">
            <OceanParametersChart data={oceanData} />
          </div>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Measurements</CardTitle>
              <CardDescription>Latest ocean parameter readings from monitoring stations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Temperature (°C)</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Salinity (PSU)</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Chlorophyll (mg/m³)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oceanData
                      .slice(-10)
                      .reverse()
                      .map((data, index) => (
                        <tr key={index} className="border-b border-border/50">
                          <td className="py-3 px-2 text-foreground">{new Date(data.date).toLocaleDateString()}</td>
                          <td className="py-3 px-2 text-foreground">{data.temperature}</td>
                          <td className="py-3 px-2 text-foreground">{data.salinity}</td>
                          <td className="py-3 px-2 text-foreground">{data.chlorophyll}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
