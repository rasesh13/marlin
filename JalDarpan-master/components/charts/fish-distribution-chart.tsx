"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FishData {
  species: string
  abundance: number
  region: string
}

interface FishDistributionChartProps {
  data: FishData[]
}

export function FishDistributionChart({ data }: FishDistributionChartProps) {
  const regionColors: { [key: string]: string } = {
    "North Atlantic": "#1e40af", // Deep blue
    "South Atlantic": "#059669", // Emerald green
    Pacific: "#dc2626", // Red
    "Indian Ocean": "#7c3aed", // Purple
    Arctic: "#0891b2", // Cyan
    Mediterranean: "#ea580c", // Orange
    Caribbean: "#16a34a", // Green
    Baltic: "#9333ea", // Violet
  }

  const dataWithColors = data.map((item) => ({
    ...item,
    fill: regionColors[item.region] || "#1e40af",
  }))

  return (
    <Card className="h-full border-[#d9e6e5] bg-white shadow-[0_18px_55px_rgba(29,68,75,.07)]">
      <CardHeader className="border-b border-[#e2ebe9] bg-[#f5f9f8] pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#087f7b]">Biodiversity records</p>
        <CardTitle className="text-lg">Fish distribution</CardTitle>
        <CardDescription>Observed abundance by species and region</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <BarChart data={dataWithColors} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="species"
              stroke="var(--muted-foreground)"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--card-foreground)",
              }}
              formatter={(value, name, props) => [
                `${value} individuals`,
                "Abundance",
                `Region: ${props.payload.region}`,
              ]}
            />
            <Bar dataKey="abundance" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
