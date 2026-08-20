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
    <Card className="h-full border-[#d9e6e5] bg-white shadow-[0_18px_55px_rgba(29,68,75,.07)]">
      <CardHeader className="border-b border-[#e2ebe9] bg-[#f5f9f8] pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#087f7b]">Environmental sensors</p>
        <CardTitle className="text-lg">Ocean parameters</CardTitle>
        <CardDescription>30-day trend across the monitoring network</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--card-foreground)",
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
