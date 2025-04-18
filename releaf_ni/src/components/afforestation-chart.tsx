/**
 * AfforestationChart Component
 *
 * This component visualizes Northern Ireland's afforestation trends over time,
 * displaying both the annual hectares planted (bar chart) and the cumulative
 * woodland coverage percentage (line chart) in a dual-axis chart.
 * It provides an interactive visualization of reforestation progress.
 */

"use client"

// Recharts component imports for chart visualization
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Bar } from "recharts"

// Custom UI chart components for styling and tooltips
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

/**
 * Sample data representing Northern Ireland afforestation trends from 2010-2023
 */
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

/**
 * AfforestationChart Component
 *
 * Renders a responsive dual-axis chart showing:
 * 1. Bar chart: Annual hectares of woodland planted (left y-axis)
 * 2. Line chart: Cumulative woodland coverage percentage (right y-axis)
 *
 * The chart includes interactive tooltips, a legend, and axis labels.
 */
export default function AfforestationChart() {
  return (
    <ChartContainer
      // Configuration for the chart series colors and labels
      config={{
        hectaresPlanted: {
          label: "Hectares Planted",
          color: "hsl(142, 76%, 36%)", // Green color for planted area
        },
        cumulativeCoverage: {
          label: "Woodland Coverage (%)",
          color: "hsl(43, 96%, 56%)", // Amber color for coverage percentage
        },
      }}
      className="h-full"
    >
      {/* Responsive container ensures the chart resizes with its parent element */}
      <ResponsiveContainer width="100%" height="100%" className="mx-auto">
        {/* LineChart component as the base chart type */}
        <LineChart data={afforestationData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
          {/* Grid lines for better readability of values */}
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

          {/* X-axis configuration showing years */}
          <XAxis dataKey="year" tick={{ fill: "hsl(var(--foreground))" }} tickMargin={10} />

          {/* Left Y-axis for hectares planted (bar chart) */}
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

          {/* Right Y-axis for woodland coverage percentage (line chart) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[7.5, 9]} // Custom domain to better visualize small percentage changes
            tick={{ fill: "hsl(var(--foreground))" }}
            tickMargin={10}
            label={{
              value: "Woodland Coverage (%)",
              angle: -90,
              position: "insideRight",
              style: { textAnchor: "middle", fill: "hsl(var(--foreground))" },
            }}
          />

          {/* Tooltip component for interactive data display on hover */}
          <ChartTooltip content={<ChartTooltipContent />} />

          {/* Legend for identifying data series */}
          <Legend />

          {/* Bar chart showing annual hectares planted */}
          <Bar yAxisId="left" dataKey="hectaresPlanted" fill="var(--color-hectaresPlanted)" barSize={20} />

          {/* Line chart showing cumulative woodland coverage percentage */}
          <Line
            yAxisId="right"
            type="monotone" // Creates a smooth curve between data points
            dataKey="cumulativeCoverage"
            stroke="var(--color-cumulativeCoverage)"
            strokeWidth={3}
            dot={{ r: 4 }} // Size of data point dots
            activeDot={{ r: 6 }} // Size of active (hovered) data point dots
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
