"use client"

import { cn } from "@/lib/utils"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { useRequireAuth } from "@/lib/auth-utils"
import { useGetServicesQuery } from "@/lib/redux/api/servicesApi"
import { useGetUserStatsQuery } from "@/lib/redux/api/usersApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loading, LoadingCard, LoadingChart } from "@/components/ui/loading"
import { 
  Server, 
  Activity, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Plus,
  ArrowRight,
  CheckCircle,
  Clock3,
  XCircle
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function DashboardPage() {
  const { isLoading: authLoading } = useRequireAuth()
  const { data: services = [], isLoading: servicesLoading } = useGetServicesQuery({})
  const { data: stats, isLoading: statsLoading } = useGetUserStatsQuery()

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loading text="Loading dashboard..." size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (servicesLoading || statsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Stats Cards Loading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingCard key={i} className="p-6 bg-card rounded-lg border border-border" />
            ))}
          </div>

          {/* Charts Loading */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <LoadingChart className="bg-card rounded-lg border border-border p-6" />
            <LoadingChart className="bg-card rounded-lg border border-border p-6" />
          </div>

          {/* Activity Feed Loading */}
          <LoadingCard className="bg-card rounded-lg border border-border p-6" />
        </div>
      </DashboardLayout>
    )
  }

  const runningServices = services.filter(s => s.status === "running").length
  const totalServices = services.length

  const recentActivity = [
    {
      id: 1,
      type: "service_created",
      title: "Redis instance created",
      description: "Production cache Redis instance deployed successfully",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: "success"
    },
    {
      id: 2,
      type: "service_updated",
      title: "Elasticsearch cluster updated",
      description: "Updated to version 8.11.1 with new security patches",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: "info"
    },
    {
      id: 3,
      type: "alert_triggered",
      title: "High memory usage alert",
      description: "MongoDB instance 'analytics-db' memory usage above 85%",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: "warning"
    },
    {
      id: 4,
      type: "service_stopped",
      title: "RabbitMQ instance stopped",
      description: "Development message queue stopped for maintenance",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      status: "info"
    }
  ]

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-warning" />
      case "error":
        return <XCircle className="w-4 h-4 text-error" />
      default:
        return <Clock3 className="w-4 h-4 text-info" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Welcome back, {stats?.user.name || "User"}!
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Here's what's happening with your microservices today.
            </p>
          </div>
          <Link href="/dashboard/services/create" className="w-full md:w-auto">
            <Button variant="gradient" className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Service
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="border-border hover-lift animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Services
              </CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totalServices}
              </div>
              <p className="text-xs text-muted-foreground">
                {runningServices} running, {totalServices - runningServices} stopped
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover-lift animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Usage
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats?.usage?.currentMonth || 0} GB
              </div>
              <p className="text-xs text-success flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats?.usage?.growth || 0}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover-lift animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Cost
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${stats?.billing?.currentMonth || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                of ${stats?.billing?.limit || 0} limit
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover-lift animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Uptime
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats?.uptime || 99.9}%
              </div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="border-border animate-in">
            <CardHeader>
              <CardTitle className="text-foreground">Service Status Overview</CardTitle>
              <CardDescription className="text-muted-foreground">
                Current status of all your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["running", "stopped", "deploying", "error"].map((status) => {
                  const count = services.filter(s => s.status === status).length
                  const percentage = totalServices > 0 ? (count / totalServices) * 100 : 0

                  const getBadgeVariant = (status: string) => {
                    switch(status) {
                      case "running": return "success"
                      case "stopped": return "secondary"
                      case "deploying": return "info"
                      case "error": return "error"
                      default: return "default"
                    }
                  }

                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={getBadgeVariant(status) as any} className="capitalize">
                          {status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {count} services
                        </span>
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border animate-in">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription className="text-muted-foreground">
                Latest events and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-1">
                      {getActivityIcon(activity.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Link
                  href="/dashboard/activity"
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-theme"
                >
                  View all activity
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}