import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"

export type ServiceStatus = "running" | "stopped" | "deploying" | "error" | "pending"
export type PaymentStatus = "paid" | "pending" | "failed"
export type EnvironmentType = "development" | "staging" | "production"

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: ServiceStatus | PaymentStatus | EnvironmentType
  type?: "service" | "payment" | "environment"
}

export function StatusBadge({ status, type = "service", className, ...props }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case "running":
      case "paid":
        return "success"
      case "stopped":
        return "secondary"
      case "deploying":
      case "development":
        return "info"
      case "error":
      case "failed":
        return "error"
      case "pending":
      case "staging":
        return "warning"
      case "production":
        return "error" // Red for production to indicate caution
      default:
        return "default"
    }
  }

  const getLabel = () => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <Badge
      variant={getVariant()}
      className={cn("capitalize", className)}
      {...props}
    >
      {getLabel()}
    </Badge>
  )
}

export default StatusBadge
