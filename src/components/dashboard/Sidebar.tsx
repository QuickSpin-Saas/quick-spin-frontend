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
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Building2,
  PlusCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, organization, logout } = useAuth()

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        "relative hidden md:flex flex-col bg-sidebar transition-all duration-300 ease-in-out shadow-2xl",
        isCollapsed ? "w-[60px]" : "w-[240px]",
        className
      )}
    >
      {/* Logo and Toggle */}
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-gradient-primary rounded-xl flex-shrink-0 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">QS</span>
            </div>
            <span className="font-semibold text-lg truncate text-sidebar-foreground">QuickSpin</span>
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

      {/* User Profile (Collapsed mode shows avatar only, expanded shows details) */}
      {!isCollapsed && (
        <div className="p-4 bg-sidebar-accent/30 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-primary rounded-full flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name || "User"}
              </p>
              {organization && (
                <p className="text-xs text-sidebar-foreground/60 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  <span className="truncate">{organization}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-6 p-2 overflow-y-auto py-4">
        <div>
          {!isCollapsed && (
            <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              Main
            </h3>
          )}
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md hover:bg-sidebar-primary/90"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive(item.href) ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70")} />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 mt-2">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-all",
            isCollapsed && "justify-center px-0"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  )
}
