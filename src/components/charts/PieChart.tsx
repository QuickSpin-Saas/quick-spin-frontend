"use client"

import { Pie } from 'react-chartjs-2'
import { ChartOptions } from 'chart.js'
import { useTheme } from 'next-themes'
import { getDefaultChartOptions, chartColors } from '@/lib/chart-config'

interface PieChartProps {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string[]
      borderColor?: string[]
    }>
  }
  options?: ChartOptions<'pie'>
  height?: number
}

export function PieChart({ data, options, height = 300 }: PieChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const defaultOptions = getDefaultChartOptions(isDark)

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || [
        chartColors.chart1,
        chartColors.chart2,
        chartColors.chart3,
        chartColors.chart4,
        chartColors.chart5,
      ],
      borderColor: isDark ? '#1f1f1f' : '#ffffff',
      borderWidth: 2,
    })),
  }

  return (
    <div style={{ height }}>
      <Pie
        data={chartData}
        options={{
          ...defaultOptions,
          ...options,
        }}
      />
    </div>
  )
}
