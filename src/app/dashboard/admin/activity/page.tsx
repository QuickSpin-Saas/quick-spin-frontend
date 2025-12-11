"use client"

import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, AlertCircle, XCircle } from "lucide-react"

export default function AdminActivityPage() {
  const activities = [
    {
      id: 1,
      user: "System",
      action: "Backup completed",
      target: "Database Cluster",
      status: "success",
      time: "2 minutes ago"
    },
    {
      id: 2,
      user: "Admin User",
      action: "Updated service configuration",
      target: "Redis-01",
      status: "success",
      time: "15 minutes ago"
    },
    {
      id: 3,
      user: "System",
      action: "High memory usage warning",
      target: "Elasticsearch-Prod",
      status: "warning",
      time: "1 hour ago"
    },
    {
      id: 4,
      user: "John Doe",
      action: "Failed login attempt",
      target: "Auth Service",
      status: "error",
      time: "2 hours ago"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Activity</h1>
          <p className="text-gray-600 mt-1">
            Monitor system events and user actions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Latest system activities and logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">
                        by {activity.user} • {activity.target}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
