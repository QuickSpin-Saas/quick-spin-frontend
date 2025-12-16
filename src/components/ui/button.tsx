import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 dark:shadow-primary/20 dark:hover:shadow-primary/30 dark:hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg hover:-translate-y-0.5 dark:shadow-destructive/20 dark:hover:shadow-destructive/30",
        outline:
          "border-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:shadow-md dark:border-border dark:hover:bg-accent/50 dark:hover:border-primary/60",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md dark:bg-secondary/80 dark:hover:bg-secondary/90 dark:hover:shadow-secondary/20",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/60 dark:hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 dark:hover:text-primary/90",
        gradient:
          "bg-gradient-primary text-white shadow-colored hover:shadow-lg hover:shadow-colored hover:-translate-y-0.5 dark:shadow-primary/30 dark:hover:shadow-primary/40",
        success:
          "bg-success text-success-foreground shadow-md hover:bg-success/90 hover:shadow-lg hover:-translate-y-0.5 dark:shadow-success/20 dark:hover:shadow-success/30",
        warning:
          "bg-warning text-warning-foreground shadow-md hover:bg-warning/90 hover:shadow-lg hover:-translate-y-0.5 dark:shadow-warning/20 dark:hover:shadow-warning/30",
        info:
          "bg-info text-info-foreground shadow-md hover:bg-info/90 hover:shadow-lg hover:-translate-y-0.5 dark:shadow-info/20 dark:hover:shadow-info/30",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
