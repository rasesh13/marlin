"use client"

import { useEffect, useState } from "react"
import { TopNavigation } from "@/components/top-navigation"
import { FishDistributionChart } from "@/components/charts/fish-distribution-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fish, MapPin, TrendingUp } from "lucide-react"

interface FishData {
  species: string
  abundance: number
  region: string
}

export default function FishDistributionPage() {
  const [fishData, setFishData] = useState<FishData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/fish-data")
        const result = await response.json()

        if (result.success) {
          setFishData(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch fish data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalAbundance = fishData.reduce((sum, fish) => sum + fish.abundance, 0)
  const topSpecies = [...fishData].sort((a, b) => b.abundance - a.abundance).slice(0, 3)
  const regionCounts = fishData.reduce(
    (acc, fish) => {
      acc[fish.region] = (acc[fish.region] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading fish distribution data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      <div>
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Fish Distribution Analysis</h1>
              <p className="text-muted-foreground">
                Species abundance and distribution patterns across different marine regions
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Fish className="w-5 h-5 text-chart-1" />
                    Total Abundance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{totalAbundance.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Individual fish counted</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="w-5 h-5 text-chart-2" />
                    Species Tracked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{fishData.length}</div>
                  <p className="text-sm text-muted-foreground">Different species monitored</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="w-5 h-5 text-chart-3" />
                    Regions Covered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{Object.keys(regionCounts).length}</div>
                  <p className="text-sm text-muted-foreground">Marine regions surveyed</p>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <div className="mb-8">
              <FishDistributionChart data={fishData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Species */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Abundant Species</CardTitle>
                  <CardDescription>Top 3 species by population count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSpecies.map((species, index) => (
                      <div key={species.species} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{species.species}</p>
                            <p className="text-sm text-muted-foreground">{species.region}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{species.abundance.toLocaleString()}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Regional Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Regional Distribution</CardTitle>
                  <CardDescription>Species count by marine region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(regionCounts).map(([region, count]) => (
                      <div key={region} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{region}</span>
                        </div>
                        <Badge variant="outline">{count} species</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
