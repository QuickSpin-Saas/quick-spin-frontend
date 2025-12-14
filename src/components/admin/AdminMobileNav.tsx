"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Users,
  Server,
  Activity,
  Settings,
  LogOut,
  Menu,
  Shield,
  BarChart3,
  FileText,
  X
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

interface AdminMobileNavProps {
  onLogout: () => void
}

export default function AdminMobileNav({ onLogout }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const isActive = (href: string): boolean => {
    if (href === "/dashboard/admin") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar">
          <SheetHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <SheetTitle className="text-sidebar-foreground text-base font-bold">Admin Panel</SheetTitle>
                  <span className="text-[10px] text-sidebar-foreground/60">System Control</span>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Admin User Info */}
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

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-gradient-primary text-white shadow-lg shadow-colored"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive(item.href) ? "text-white" : "text-sidebar-foreground/70")} />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-sidebar-border space-y-3">
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

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              onClick={() => {
                onLogout()
                setOpen(false)
              }}
              className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
