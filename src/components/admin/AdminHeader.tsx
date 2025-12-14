"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-utils"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import AdminMobileNav from "./AdminMobileNav"
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity,
  Command
} from "lucide-react"

interface HeaderProps {
  className?: string
}

export default function AdminHeader({ className }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock admin notifications
  const adminNotifications = [
    {
      id: 1,
      title: "High Memory Usage Detected",
      message: "Elasticsearch cluster 'logs-prod' memory usage at 87%",
      time: "5 minutes ago",
      type: "warning",
      priority: "high"
    },
    {
      id: 2,
      title: "New User Registration",
      message: "15 new users registered in the last hour",
      time: "12 minutes ago",
      type: "success",
      priority: "normal"
    },
    {
      id: 3,
      title: "Service Deployment Failed",
      message: "MongoDB instance 'analytics-db' failed to deploy",
      time: "1 hour ago",
      type: "error",
      priority: "high"
    },
    {
      id: 4,
      title: "System Update Available",
      message: "Platform update v2.5.0 is ready to install",
      time: "2 hours ago",
      type: "info",
      priority: "normal"
    },
  ]

  const highPriorityCount = adminNotifications.filter(n => n.priority === "high").length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/admin/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-warning" />
      case "error":
        return <XCircle className="w-4 h-4 text-error" />
      default:
        return <Activity className="w-4 h-4 text-info" />
    }
  }

  return (
    <header className={cn("sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border/50 shadow-sm", className)}>
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Mobile Navigation */}
        <AdminMobileNav onLogout={logout} />

        {/* Search - Enhanced for admin */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl" role="search">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search users, services, logs, and system data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 bg-muted/50 border-border/50 focus-visible:bg-background transition-colors"
              aria-label="Search admin panel"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <Command className="w-3 h-3" />K
            </kbd>
          </div>
        </form>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          {/* Quick Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Activity className="w-4 h-4 mr-2" />
              System Status
            </Button>
          </div>

          {/* Notifications with priority indicator */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {highPriorityCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive items-center justify-center text-[9px] font-bold text-white">
                      {highPriorityCount}
                    </span>
                  </span>
                )}
                <span className="sr-only">Admin Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Admin Notifications</span>
                {adminNotifications.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {adminNotifications.length} new
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {adminNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="cursor-pointer flex-col items-start p-3 gap-1 focus:bg-accent"
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 w-full">
                          <span className="font-semibold text-sm flex-1">{notification.title}</span>
                          {notification.priority === "high" && (
                            <Badge variant="error" className="text-xs px-1.5 py-0">
                              High
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/admin/notifications" className="w-full text-center justify-center cursor-pointer text-primary font-medium">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="hidden lg:flex flex-col items-start text-xs">
                  <span className="font-semibold">{user?.name || "Admin"}</span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-success rounded-full" />
                    Administrator
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Admin Account</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {user?.email || "admin@example.com"}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/admin/profile" className="cursor-pointer w-full flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Admin Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/admin/settings" className="cursor-pointer w-full flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  System Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/admin/activity" className="cursor-pointer w-full flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  System Activity
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer w-full flex items-center gap-2 text-info">
                  <User className="w-4 h-4" />
                  Switch to User Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
