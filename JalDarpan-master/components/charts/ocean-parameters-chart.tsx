"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OceanData {
  date: string
  temperature: number
  salinity: number
  chlorophyll: number
}

interface OceanParametersChartProps {
  data: OceanData[]
}

export function OceanParametersChart({ data }: OceanParametersChartProps) {
  return (
    <Card className="h-full border-white/10 bg-[#092b43] shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
      <CardHeader className="border-b border-white/10 bg-[#0b3a5b]/40 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#13c8d8]">Environmental sensors</p>
        <CardTitle className="text-lg">Ocean parameters</CardTitle>
        <CardDescription>30-day trend across the monitoring network</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Temperature (°C)"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="salinity"
              stroke="#10b981"
              strokeWidth={3}
              name="Salinity (PSU)"
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="chlorophyll"
              stroke="#f59e0b"
              strokeWidth={3}
              name="Chlorophyll (mg/m³)"
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
