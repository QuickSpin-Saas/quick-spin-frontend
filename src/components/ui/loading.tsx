import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  variant?: "spinner" | "dots" | "pulse"
  className?: string
  text?: string
}

export function Loading({ size = "md", variant = "spinner", className, text }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="flex space-x-1">
          <div className={cn("w-2 h-2 bg-primary-600 rounded-full animate-bounce", sizeClasses[size])} />
          <div className={cn("w-2 h-2 bg-primary-600 rounded-full animate-bounce", sizeClasses[size])} style={{ animationDelay: "0.1s" }} />
          <div className={cn("w-2 h-2 bg-primary-600 rounded-full animate-bounce", sizeClasses[size])} style={{ animationDelay: "0.2s" }} />
        </div>
        {text && <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{text}</span>}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className={cn("bg-primary-600 rounded-full animate-pulse", sizeClasses[size])} />
        {text && <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{text}</span>}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary-600", sizeClasses[size])} />
      {text && <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{text}</span>}
    </div>
  )
}

interface LoadingCardProps {
  className?: string
  lines?: number
}

export function LoadingCard({ className, lines = 3 }: LoadingCardProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      ))}
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-4" />
    </div>
  )
}

interface LoadingTableProps {
  rows?: number
  cols?: number
  className?: string
}

export function LoadingTable({ rows = 5, cols = 4, className }: LoadingTableProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="flex space-x-4 mb-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 mb-3">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="h-3 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

interface LoadingChartProps {
  className?: string
}

export function LoadingChart({ className }: LoadingChartProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-end justify-center p-4">
        <div className="flex space-x-2 items-end h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-300 dark:bg-gray-600 rounded"
              style={{
                width: "20px",
                height: `${Math.random() * 80 + 20}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}