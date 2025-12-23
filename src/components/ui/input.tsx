import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  success?: boolean
  warning?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, warning, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border-2 border-input bg-input px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground placeholder:font-normal",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:border-primary",
          "hover:border-primary/50 hover:shadow-md",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input",
          "dark:bg-input dark:border-border dark:focus-visible:border-primary dark:focus-visible:ring-primary/50",
          "dark:hover:border-primary/40 dark:hover:shadow-lg dark:focus-visible:shadow-[0_0_20px_rgba(199,125,255,0.3)]",
          error && "input-error border-destructive focus-visible:ring-destructive dark:border-destructive/60",
          success && "input-success border-success focus-visible:ring-success dark:border-success/60",
          warning && "input-warning border-warning focus-visible:ring-warning dark:border-warning/60",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
