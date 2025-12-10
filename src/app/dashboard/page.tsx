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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingCard key={i} className="p-6 bg-white dark:bg-slate-800 rounded-lg border" />
            ))}
          </div>

          {/* Charts Loading */}
          <div className="grid gap-6 md:grid-cols-2">
            <LoadingChart className="bg-white dark:bg-slate-800 rounded-lg border p-6" />
            <LoadingChart className="bg-white dark:bg-slate-800 rounded-lg border p-6" />
          </div>

          {/* Activity Feed Loading */}
          <LoadingCard className="bg-white dark:bg-slate-800 rounded-lg border p-6" />
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
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock3 className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {stats?.user.name || "User"}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here's what's happening with your microservices today.
            </p>
          </div>
          <Link href="/dashboard/services/create">
            <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Service
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Services
              </CardTitle>
              <Server className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalServices}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {runningServices} running, {totalServices - runningServices} stopped
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Usage
              </CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.usage?.currentMonth || 0} GB
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats?.usage?.growth || 0}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Cost
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats?.billing?.currentMonth || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                of ${stats?.billing?.limit || 0} limit
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Uptime
              </CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.uptime || 99.9}%
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Service Status Overview</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Current status of all your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["running", "stopped", "deploying", "error"].map((status) => {
                  const count = services.filter(s => s.status === status).length
                  const percentage = totalServices > 0 ? (count / totalServices) * 100 : 0
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge 
                          className={cn(
                            "capitalize",
                            status === "running" && "bg-green-100 text-green-800",
                            status === "stopped" && "bg-gray-100 text-gray-800",
                            status === "deploying" && "bg-blue-100 text-blue-800",
                            status === "error" && "bg-red-100 text-red-800"
                          )}
                        >
                          {status}
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {count} services
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
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
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/dashboard/activity"
                  className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center gap-1"
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