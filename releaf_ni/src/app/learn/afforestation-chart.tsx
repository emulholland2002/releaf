"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Data represents Northern Ireland afforestation trends
// Note: This is sample data
const afforestationData = [
  { year: 2010, hectaresPlanted: 200, cumulativeCoverage: 8.0 },
  { year: 2011, hectaresPlanted: 250, cumulativeCoverage: 8.05 },
  { year: 2012, hectaresPlanted: 300, cumulativeCoverage: 8.1 },
  { year: 2013, hectaresPlanted: 280, cumulativeCoverage: 8.15 },
  { year: 2014, hectaresPlanted: 320, cumulativeCoverage: 8.2 },
  { year: 2015, hectaresPlanted: 270, cumulativeCoverage: 8.25 },
  { year: 2016, hectaresPlanted: 240, cumulativeCoverage: 8.3 },
  { year: 2017, hectaresPlanted: 210, cumulativeCoverage: 8.35 },
  { year: 2018, hectaresPlanted: 230, cumulativeCoverage: 8.4 },
  { year: 2019, hectaresPlanted: 280, cumulativeCoverage: 8.45 },
  { year: 2020, hectaresPlanted: 310, cumulativeCoverage: 8.5 },
  { year: 2021, hectaresPlanted: 350, cumulativeCoverage: 8.55 },
  { year: 2022, hectaresPlanted: 380, cumulativeCoverage: 8.6 },
  { year: 2023, hectaresPlanted: 420, cumulativeCoverage: 8.7 },
]

export default function AfforestationChart() {
  return (
    <ChartContainer
      config={{
        hectaresPlanted: {
          label: "Hectares Planted",
          color: "hsl(142, 76%, 36%)", // Green
        },
        cumulativeCoverage: {
          label: "Woodland Coverage (%)",
          color: "hsl(43, 96%, 56%)", // Amber
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%" className="mx-auto">
        <LineChart data={afforestationData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="year" tick={{ fill: "hsl(var(--foreground))" }} tickMargin={10} />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fill: "hsl(var(--foreground))" }}
            tickMargin={10}
            label={{
              value: "Hectares Planted",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "hsl(var(--foreground))" },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[7.5, 9]}
            tick={{ fill: "hsl(var(--foreground))" }}
            tickMargin={10}
            label={{
              value: "Woodland Coverage (%)",
              angle: -90,
              position: "insideRight",
              style: { textAnchor: "middle", fill: "hsl(var(--foreground))" },
            }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar yAxisId="left" dataKey="hectaresPlanted" fill="var(--color-hectaresPlanted)" barSize={20} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulativeCoverage"
            stroke="var(--color-cumulativeCoverage)"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
