"use client"

import { cn } from "@/lib/utils"
import AdminSidebar from "./AdminSidebar"
import AdminHeader from "./AdminHeader"

interface AdminLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function AdminLayout({ children, className }: AdminLayoutProps) {
  return (
    <div className="h-screen flex">
      <AdminSidebar className="flex-shrink-0" />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader className="flex-shrink-0" />
        <main className={cn("flex-1 overflow-y-auto p-6 md:p-8", className)}>
          {children}
        </main>
      </div>
    </div>
  )
}
