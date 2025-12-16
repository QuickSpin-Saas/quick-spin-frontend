import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 dark:shadow-primary/20",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary/80 dark:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80 dark:shadow-destructive/20",
        outline: "text-foreground border-border hover:bg-accent dark:border-border dark:hover:bg-accent/60",
        success:
          "border-transparent bg-success/15 text-success hover:bg-success/25 dark:bg-success/20 dark:text-success dark:hover:bg-success/30",
        warning:
          "border-transparent bg-warning/15 text-warning-foreground hover:bg-warning/25 dark:bg-warning/20 dark:text-warning dark:hover:bg-warning/30",
        error:
          "border-transparent bg-destructive/15 text-destructive hover:bg-destructive/25 dark:bg-destructive/20 dark:text-error dark:hover:bg-destructive/30",
        info:
          "border-transparent bg-info/15 text-info hover:bg-info/25 dark:bg-info/20 dark:text-info dark:hover:bg-info/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
