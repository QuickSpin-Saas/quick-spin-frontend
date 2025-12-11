import { LucideIcon } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-4",
      className
    )}>
      {Icon && (
        <div className="mb-4 rounded-full bg-muted p-4">
          <Icon className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground" />
        </div>
      )}

      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
      )}

      {action && (
        action.href ? (
          <Button asChild>
            <a href={action.href}>{action.label}</a>
          </Button>
        ) : (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  )
}
