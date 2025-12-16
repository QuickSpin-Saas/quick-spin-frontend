import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Chart color palette based on purple theme
export const chartColors = {
  primary: '#B399D4',
  secondary: '#9370DB',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
  chart1: '#B399D4',
  chart2: '#A58DC9',
  chart3: '#C8B5E0',
  chart4: '#9370DB',
  chart5: '#B088D6',
}

// Default chart options for consistent theming
export const getDefaultChartOptions = (isDark: boolean = false): ChartOptions<any> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: {
        color: isDark ? '#e5e7eb' : '#1f2937',
        usePointStyle: true,
        padding: 15,
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 12,
          weight: '500',
        },
      },
    },
    tooltip: {
      backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      titleColor: isDark ? '#e5e7eb' : '#1f2937',
      bodyColor: isDark ? '#d1d5db' : '#4b5563',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        labelColor: function(context: any) {
          return {
            borderColor: context.dataset.borderColor as string,
            backgroundColor: context.dataset.backgroundColor as string,
          }
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: isDark ? '#374151' : '#e5e7eb',
      },
      ticks: {
        color: isDark ? '#9ca3af' : '#6b7280',
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 11,
        },
      },
    },
    y: {
      grid: {
        color: isDark ? '#374151' : '#f3f4f6',
        drawBorder: false,
      },
      ticks: {
        color: isDark ? '#9ca3af' : '#6b7280',
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 11,
        },
      },
    },
  },
})

// Gradient generator for charts
export const createGradient = (
  ctx: CanvasRenderingContext2D,
  color1: string,
  color2: string,
  height: number
): CanvasGradient => {
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)
  return gradient
}
