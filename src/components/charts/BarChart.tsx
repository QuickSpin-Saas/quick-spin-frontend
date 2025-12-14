"use client"

import { Bar } from 'react-chartjs-2'
import { ChartOptions } from 'chart.js'
import { useTheme } from 'next-themes'
import { getDefaultChartOptions, chartColors } from '@/lib/chart-config'

interface BarChartProps {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
    }>
  }
  options?: ChartOptions<'bar'>
  height?: number
}

export function BarChart({ data, options, height = 300 }: BarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const defaultOptions = getDefaultChartOptions(isDark)

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || chartColors[`chart${index + 1}` as keyof typeof chartColors],
      borderColor: dataset.borderColor || chartColors[`chart${index + 1}` as keyof typeof chartColors],
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    })),
  }

  return (
    <div style={{ height }}>
      <Bar
        data={chartData}
        options={{
          ...defaultOptions,
          ...options,
        }}
      />
    </div>
  )
}
