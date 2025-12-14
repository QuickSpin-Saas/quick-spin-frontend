import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        success:
          "border-success/50 bg-success/10 text-success dark:border-success/30 dark:bg-success/20 [&>svg]:text-success",
        destructive:
          "border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/20 [&>svg]:text-destructive",
        warning:
          "border-warning/50 bg-warning/10 text-warning-foreground dark:border-warning/30 dark:bg-warning/20 [&>svg]:text-warning",
        info:
          "border-info/50 bg-info/10 text-info dark:border-info/30 dark:bg-info/20 [&>svg]:text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & {
    icon?: boolean
  }
>(({ className, variant, icon = true, children, ...props }, ref) => {
  const IconComponent =
    variant === "success" ? CheckCircle2 :
    variant === "destructive" ? XCircle :
    variant === "warning" ? AlertCircle :
    variant === "info" ? Info :
    AlertCircle

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon && <IconComponent className="h-4 w-4" />}
      {children}
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
