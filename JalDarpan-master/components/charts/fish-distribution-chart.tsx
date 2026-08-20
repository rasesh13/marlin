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
    <Card className="h-full border-white/10 bg-[#092b43] shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
      <CardHeader className="border-b border-white/10 bg-[#0b3a5b]/40 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#27d3c2]">Biodiversity records</p>
        <CardTitle className="text-lg">Fish distribution</CardTitle>
        <CardDescription>Observed abundance by species and region</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <BarChart data={dataWithColors} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="species"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
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
