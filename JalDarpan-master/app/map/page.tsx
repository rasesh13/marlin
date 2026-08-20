"use client"

import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Activity, AlertTriangle, CheckCircle } from "lucide-react"
import dynamic from "next/dynamic"

const InteractiveMap = dynamic(
  () => import("@/components/interactive-map").then((mod) => ({ default: mod.InteractiveMap })),
  {
    ssr: false,
    loading: () => (
      <Card className="h-[600px]">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading interactive map...</p>
          </div>
        </CardContent>
      </Card>
    ),
  },
)

export default function MapPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Global Marine Monitoring Network</h1>
            <p className="text-muted-foreground">
              Real-time monitoring stations across the world's oceans providing comprehensive marine data
            </p>
          </div>

          {/* Network Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Stations</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Maintenance</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Offline</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Stations</p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Map */}
          <InteractiveMap />

          {/* Recent Alerts */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Alerts & Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Gulf Stream Observatory - Maintenance Mode</p>
                      <p className="text-sm text-muted-foreground">Scheduled maintenance for sensor calibration</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Maintenance</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium">Mediterranean Research Hub - Connection Lost</p>
                      <p className="text-sm text-muted-foreground">Last communication 2 days ago</p>
                    </div>
                  </div>
                  <Badge variant="destructive">Offline</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Arctic Marine Station - Data Quality Excellent</p>
                      <p className="text-sm text-muted-foreground">All sensors reporting within normal parameters</p>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
