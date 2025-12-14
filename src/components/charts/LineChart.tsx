"use client"

import { Line } from 'react-chartjs-2'
import { ChartOptions } from 'chart.js'
import { useTheme } from 'next-themes'
import { getDefaultChartOptions, chartColors } from '@/lib/chart-config'

interface LineChartProps {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor?: string
      backgroundColor?: string
    }>
  }
  options?: ChartOptions<'line'>
  height?: number
}

export function LineChart({ data, options, height = 300 }: LineChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const defaultOptions = getDefaultChartOptions(isDark)

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: dataset.borderColor || chartColors[`chart${index + 1}` as keyof typeof chartColors],
      backgroundColor: dataset.backgroundColor || `${chartColors[`chart${index + 1}` as keyof typeof chartColors]}33`,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: dataset.borderColor || chartColors[`chart${index + 1}` as keyof typeof chartColors],
      fill: true,
    })),
  }

  return (
    <div style={{ height }}>
      <Line
        data={chartData}
        options={{
          ...defaultOptions,
          ...options,
        }}
      />
    </div>
  )
}
