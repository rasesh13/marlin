"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BiodiversityData {
  pelagic: number
  benthic: number
  crustaceans: number
  others: number
}

interface BiodiversityChartProps {
  data: BiodiversityData
}

const COLORS = [
  "#0ea5e9", // Bright ocean blue for Pelagic
  "#10b981", // Emerald green for Benthic
  "#ef4444", // Bright red for Crustaceans
  "#8b5cf6", // Vibrant purple for Others
]

export function BiodiversityChart({ data }: BiodiversityChartProps) {
  const chartData = [
    { name: "Pelagic", value: data.pelagic, fill: COLORS[0] },
    { name: "Benthic", value: data.benthic, fill: COLORS[1] },
    { name: "Crustaceans", value: data.crustaceans, fill: COLORS[2] },
    { name: "Others", value: data.others, fill: COLORS[3] },
  ]

  const total = data.pelagic + data.benthic + data.crustaceans + data.others

  return (
    <Card className="border-[#d9e6e5] bg-white shadow-[0_18px_55px_rgba(29,68,75,.07)]">
      <CardHeader className="border-b border-[#e2ebe9] bg-[#f5f9f8] pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2f66b6]">Ecosystem composition</p>
        <CardTitle className="text-lg">Biodiversity breakdown</CardTitle>
        <CardDescription>Distribution of marine life categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} style={{ fill: entry.fill }} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--card-foreground)",
                  }}
                  formatter={(value: number) => [`${value} species (${((value / total) * 100).toFixed(1)}%)`, "Count"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {chartData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[index],
                    background: COLORS[index],
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.value} species ({((item.value / total) * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
