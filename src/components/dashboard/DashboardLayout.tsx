"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-slate-900">
      <Sidebar className="flex-shrink-0" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header className="flex-shrink-0" />
        <main className={cn("flex-1 overflow-y-auto p-6", className)}>
          {children}
        </main>
      </div>
    </div>
  )
}