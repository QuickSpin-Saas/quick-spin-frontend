import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  )
}

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 bg-white rounded-lg border border-slate-200", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="w-4 h-4" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  )
}

function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="rounded-lg border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-200">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="p-4">
              <div className="flex items-center gap-4">
                {Array.from({ length: columns }).map((_, j) => (
                  <Skeleton key={j} className="h-4 flex-1" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 bg-white rounded-lg border border-slate-200", className)}>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="h-64 relative">
        <Skeleton className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 h-48">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="w-4" style={{ height: `${Math.random() * 100 + 20}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StatsCardSkeleton() {
  return (
    <div className="p-6 bg-white rounded-lg border border-slate-200">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="w-12 h-12 rounded-lg" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

export {
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  ChartSkeleton,
  StatsCardSkeleton,
  FormSkeleton,
}