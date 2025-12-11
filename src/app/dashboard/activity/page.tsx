"use client"

import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, AlertCircle, XCircle } from "lucide-react"

export default function ActivityPage() {
  const activities = [
    { id: 1, action: "Service created", target: "Redis-Prod", status: "success", time: "2 minutes ago" },
    { id: 2, action: "Configuration updated", target: "API Gateway", status: "success", time: "15 minutes ago" },
    { id: 3, action: "High latency detected", target: "Search Service", status: "warning", time: "1 hour ago" },
    { id: 4, action: "Deployment failed", target: "Worker Node 3", status: "error", time: "2 hours ago" }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
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
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Activity Log</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            History of your service activities and events
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Activities</CardTitle>
            <CardDescription>Comprehensive log of all system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.target}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
