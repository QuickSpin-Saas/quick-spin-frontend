"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-utils"
import { Bell, Search, User, Settings, LogOut, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import MobileNav from "./MobileNav"
import { ThemeToggle } from "@/components/ui/theme-toggle"
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

interface HeaderProps {
  className?: string
}

export default function Header({ className }: HeaderProps) {
  const { user, role, logout } = useAuth()
  
  // Mock notifications - in a real app this would come from a store/API
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
    <header className={cn("sticky top-0 z-40 bg-white/60 dark:bg-black/40 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-xl", className)}>
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Mobile Navigation */}
        <MobileNav onLogout={logout} />

        {/* Search - Hidden on mobile, visible on md and up */}
        <div className="hidden md:flex flex-1 max-w-md ml-4" role="search">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-9 bg-muted/50 focus-visible:bg-background transition-colors"
              aria-label="Search services, logs, and documentation"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="cursor-pointer flex-col items-start p-3 gap-1">
                     <div className="flex items-center gap-2 w-full">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          notification.type === "success" && "bg-success",
                          notification.type === "warning" && "bg-warning",
                          notification.type === "error" && "bg-destructive"
                        )} />
                        <span className="font-medium text-sm">{notification.title}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{notification.time}</span>
                     </div>
                     <p className="text-xs text-muted-foreground line-clamp-2 pl-4">
                        {notification.message}
                     </p>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/activity" className="w-full text-center justify-center cursor-pointer text-primary">
                  View all activity
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu - Hidden on mobile, visible on md and up */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col items-start text-xs">
                    <span className="font-medium">{user?.name || "User"}</span>
                    <span className="text-muted-foreground">{role || "Member"}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings/profile" className="cursor-pointer w-full flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer w-full flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/activity" className="cursor-pointer w-full flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Activity
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
      </div>
    </header>
  )
}
