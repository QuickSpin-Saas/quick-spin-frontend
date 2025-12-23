import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 dark:shadow-primary/25 hover:shadow-md",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary/80 dark:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80 dark:shadow-destructive/20",
        outline: "text-foreground border-border hover:bg-accent dark:border-primary/20 dark:hover:bg-primary/10",
        success:
          "border-transparent bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30 border-emerald-200/50 dark:border-emerald-500/20",
        warning:
          "border-transparent bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30 border-amber-200/50 dark:border-amber-500/20",
        error:
          "border-transparent bg-red-500/15 text-red-600 hover:bg-red-500/25 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 border-red-200/50 dark:border-red-500/20",
        info:
          "border-transparent bg-cyan-500/15 text-cyan-600 hover:bg-cyan-500/25 dark:bg-cyan-500/20 dark:text-cyan-400 dark:hover:bg-cyan-500/30 border-cyan-200/50 dark:border-cyan-500/20",
        glass: "border-primary/20 bg-white/10 text-foreground hover:bg-white/20 backdrop-blur-md shadow-sm dark:bg-white/5 dark:text-white dark:border-white/10",
        gradient: "border-transparent bg-gradient-to-r from-primary to-purple-600 text-white shadow-md hover:opacity-90 hover:shadow-lg transition-all",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
