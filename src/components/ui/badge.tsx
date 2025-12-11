import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = {
  default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "text-foreground border-border",
  success: "border-transparent bg-success-light text-success hover:bg-success-light/80",
  warning: "border-transparent bg-warning-light text-warning hover:bg-warning-light/80",
  error: "border-transparent bg-error-light text-error hover:bg-error-light/80",
  info: "border-transparent bg-info-light text-info hover:bg-info-light/80",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }