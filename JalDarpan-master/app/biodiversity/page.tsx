"use client"

import { useEffect, useState } from "react"
import { TopNavigation } from "@/components/top-navigation"
import { BiodiversityChart } from "@/components/charts/biodiversity-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Leaf, Waves, Bug } from "lucide-react"

interface BiodiversityData {
  pelagic: number
  benthic: number
  crustaceans: number
  others: number
}

export default function BiodiversityPage() {
  const [biodiversityData, setBiodiversityData] = useState<BiodiversityData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/biodiversity-data")
        const result = await response.json()

        if (result.success) {
          setBiodiversityData(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch biodiversity data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading biodiversity data...</p>
        </div>
      </div>
    )
  }

  if (!biodiversityData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load biodiversity data</p>
      </div>
    )
  }

  const total =
    biodiversityData.pelagic + biodiversityData.benthic + biodiversityData.crustaceans + biodiversityData.others
  const biodiversityIndex = Math.round((total / 50) * 10) / 10

  const categories = [
    {
      name: "Pelagic Species",
      count: biodiversityData.pelagic,
      icon: Waves,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      description: "Open ocean dwelling species",
    },
    {
      name: "Benthic Species",
      count: biodiversityData.benthic,
      icon: BarChart3,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      description: "Bottom dwelling species",
    },
    {
      name: "Crustaceans",
      count: biodiversityData.crustaceans,
      icon: Bug,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      description: "Crabs, lobsters, and shrimp",
    },
    {
      name: "Other Species",
      count: biodiversityData.others,
      icon: Leaf,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      description: "Marine plants and other organisms",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      <div>
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Marine Biodiversity Analysis</h1>
              <p className="text-muted-foreground">
                Comprehensive breakdown of marine life categories and ecosystem health indicators
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {categories.map((category) => (
                <Card key={category.name}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <category.icon className={`w-5 h-5 ${category.color}`} />
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-foreground">{category.count}</div>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                      <Progress value={(category.count / total) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {Math.round((category.count / total) * 100)}% of total
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Biodiversity Chart */}
              <BiodiversityChart data={biodiversityData} />

              {/* Biodiversity Index */}
              <Card>
                <CardHeader>
                  <CardTitle>Biodiversity Health Index</CardTitle>
                  <CardDescription>Overall ecosystem diversity score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-primary">{biodiversityIndex}</div>
                    <div className="space-y-2">
                      <Progress value={biodiversityIndex * 10} className="h-3" />
                      <p className="text-sm text-muted-foreground">
                        {biodiversityIndex >= 8
                          ? "Excellent biodiversity"
                          : biodiversityIndex >= 6
                            ? "Good biodiversity"
                            : biodiversityIndex >= 4
                              ? "Moderate biodiversity"
                              : "Low biodiversity"}
                      </p>
                    </div>
                    <div className="text-left space-y-2 pt-4">
                      <h4 className="font-medium text-foreground">Key Metrics:</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>• Total species: {total}</p>
                        <p>• Dominant category: {categories.sort((a, b) => b.count - a.count)[0].name}</p>
                        <p>• Species richness: High</p>
                        <p>• Ecosystem stability: Stable</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Species Category Details</CardTitle>
                <CardDescription>
                  Detailed breakdown of marine life categories and their characteristics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map((category) => (
                    <div key={category.name} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                          <category.icon className={`w-5 h-5 ${category.color}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.count} species</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground pl-13">{category.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
