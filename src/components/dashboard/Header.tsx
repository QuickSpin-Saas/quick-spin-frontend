"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Bell, Search, User, Settings, LogOut, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import MobileNav from "./MobileNav"

interface HeaderProps {
  className?: string
}

export default function Header({ className }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, role, logout } = useAuth()

  const notifications = [
    {
      id: 1,
      title: "Service Deployed",
      message: "Redis instance 'production-cache' deployed successfully",
      time: "2 minutes ago",
      type: "success",
    },
    {
      id: 2,
      title: "High CPU Usage",
      message: "Elasticsearch cluster 'logs-cluster' CPU usage above 80%",
      time: "15 minutes ago",
      type: "warning",
    },
    {
      id: 3,
      title: "Service Stopped",
      message: "RabbitMQ instance 'message-queue' stopped unexpectedly",
      time: "1 hour ago",
      type: "error",
    },
  ]

  return (
    <header className={cn("bg-background border-b border-border", className)}>
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Mobile Navigation */}
        <MobileNav onLogout={logout} />

        {/* Search - Hidden on mobile, visible on md and up */}
        <div className="hidden md:flex flex-1 max-w-2xl" role="search">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search services, logs, documentation..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-foreground transition-theme"
              aria-label="Search services, logs, and documentation"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-4 ml-2 md:ml-6">
          {/* Theme toggle - Hidden on mobile, visible on md and up */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-accent transition-theme relative"
              aria-label={`Notifications${notifications.length > 0 ? ` (${notifications.length} unread)` : ''}`}
              aria-expanded={showNotifications}
              aria-haspopup="true"
            >
              <Bell className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center" aria-hidden="true">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg border border-border z-50">
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-border hover:bg-accent transition-theme"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                          notification.type === "success" && "bg-success",
                          notification.type === "warning" && "bg-warning",
                          notification.type === "error" && "bg-error"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border">
                  <Link
                    href="/dashboard/activity"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-theme"
                  >
                    View all activity
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User menu - Hidden on mobile, visible on md and up */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-theme"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {role || "Member"}
                </p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border z-50">
                <div className="p-2">
                  <Link
                    href="/dashboard/settings/profile"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-theme"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-theme"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <Link
                    href="/dashboard/activity"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-theme"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Activity className="w-4 h-4" />
                    Activity
                  </Link>
                  <hr className="my-2 border-border" />
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-theme w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}