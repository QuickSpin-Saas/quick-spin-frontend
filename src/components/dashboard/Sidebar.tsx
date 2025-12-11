"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-utils"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Server,
  CreditCard,
  Settings,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Building2,
  Activity,
  PlusCircle,
} from "lucide-react"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Services",
    href: "/dashboard/services",
    icon: Server,
  },
  {
    title: "Create Service",
    href: "/dashboard/services/create",
    icon: PlusCircle,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

const adminNavItems = [
  {
    title: "Admin Overview",
    href: "/dashboard/admin",
    icon: BarChart3,
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
]

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, role, organization, logout } = useAuth()

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn("relative hidden md:block", className)}
      aria-label="Main navigation"
    >
      <div
        className={cn(
          "h-full bg-background border-r border-border transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center gap-2" role="banner">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">QS</span>
                </div>
                <span className="font-semibold text-foreground">QuickSpin</span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md hover:bg-accent transition-theme"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                  {organization && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span className="truncate">{organization}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto" role="navigation" aria-label="Primary">
            <div className="mb-4">
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Main
                </h3>
              )}
              <div className="space-y-1" role="group" aria-label="Main navigation">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-theme",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-accent"
                    )}
                    aria-label={item.title}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                ))}
              </div>
            </div>

            {role === "admin" && (
              <div className="mb-4">
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Admin
                  </h3>
                )}
                <div className="space-y-1" role="group" aria-label="Admin navigation">
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-theme",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-accent"
                      )}
                      aria-label={item.title}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border space-y-2">
            <button
              onClick={logout}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-theme w-full",
                isCollapsed ? "justify-center" : "justify-start"
              )}
              aria-label="Logout"
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}