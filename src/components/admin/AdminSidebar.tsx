"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Server,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  BarChart3,
  Database,
  FileText,
  Zap
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: typeof LayoutDashboard
}

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Service Management",
    href: "/dashboard/admin/services",
    icon: Server,
  },
  {
    title: "System Activity",
    href: "/dashboard/admin/activity",
    icon: Activity,
  },
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "/dashboard/admin/reports",
    icon: FileText,
  },
  {
    title: "System Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
]

interface AdminSidebarProps {
  className?: string
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const isActive = (href: string): boolean => {
    if (href === "/dashboard/admin") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        "relative hidden md:flex flex-col bg-sidebar transition-all duration-300 ease-in-out shadow-2xl border-r border-sidebar-border",
        isCollapsed ? "w-[70px]" : "w-[260px]",
        className
      )}
    >
      {/* Logo and Toggle */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base truncate text-sidebar-foreground">Admin Panel</span>
              <span className="text-[10px] text-sidebar-foreground/60">System Control</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("h-8 w-8 ml-auto hover:bg-sidebar-accent", isCollapsed && "mx-auto")}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
          )}
        </Button>
      </div>

      {/* Admin User Info */}
      {!isCollapsed && (
        <div className="p-4 bg-sidebar-accent/30 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {user?.name || "Administrator"}
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                <p className="text-xs text-sidebar-foreground/70">Admin Access</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        <div className="space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive(item.href)
                  ? "bg-gradient-primary text-white shadow-lg shadow-colored hover-glow"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive(item.href) ? "text-white" : "text-sidebar-foreground/70")} />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Quick Stats (Collapsed = Icon only) */}
      <div className={cn("p-4 border-t border-sidebar-border", isCollapsed && "px-2")}>
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sidebar-foreground/60">System Status</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-success rounded-full" />
                <span className="text-success font-medium">Operational</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-sidebar-accent/30 rounded-lg p-2">
                <div className="text-sidebar-foreground/60">Users</div>
                <div className="text-sidebar-foreground font-semibold">1,247</div>
              </div>
              <div className="bg-sidebar-accent/30 rounded-lg p-2">
                <div className="text-sidebar-foreground/60">Services</div>
                <div className="text-sidebar-foreground font-semibold">892</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  )
}
