"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { useRequireAuth } from "@/lib/auth-utils"
import { useGetServiceQuery, useGetServiceMetricsQuery, useGetServiceLogsQuery } from "@/lib/redux/api/servicesApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Server, 
  Play, 
  Square, 
  RotateCcw, 
  Settings, 
  Activity, 
  Clock, 
  Cpu, 
  HardDrive, 
  MemoryStick,
  AlertCircle,
  CheckCircle,
  Database,
  Network,
  Download,
  RefreshCw,
  ExternalLink,
  Edit,
  Trash2
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

export default function ServiceDetailPage() {
  const { isLoading: authLoading } = useRequireAuth()
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string
  
  const { data: service, isLoading: serviceLoading } = useGetServiceQuery(serviceId)
  const { data: metrics = [], isLoading: metricsLoading } = useGetServiceMetricsQuery(serviceId)
  const { data: logs = [], isLoading: logsLoading } = useGetServiceLogsQuery(serviceId)
  
  const [activeTab, setActiveTab] = useState("overview")

  if (authLoading || serviceLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!service) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Service not found
          </h3>
          <p className="text-gray-600 mb-6">
            The service you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.push("/dashboard/services")}>
            Back to Services
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Running</Badge>
      case "stopped":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Stopped</Badge>
      case "deploying":
        return <Badge variant="outline" className="border-blue-200 text-blue-800">Deploying</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "redis":
        return <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                 <span className="text-red-600 font-bold">R</span>
               </div>
      case "rabbitmq":
        return <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                 <span className="text-orange-600 font-bold text-sm">RM</span>
               </div>
      case "elasticsearch":
        return <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                 <span className="text-yellow-600 font-bold text-sm">ES</span>
               </div>
      default:
        return <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                 <Server className="w-6 h-6 text-primary-600" />
               </div>
    }
  }


  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-600 bg-red-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "info":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getServiceIcon(service.type)}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {service.name}
                </h1>
                {getStatusBadge(service.status)}
              </div>
              <p className="text-gray-600 mt-1">
                {service.type} • {service.environment} • Created {formatDistanceToNow(new Date(service.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            {service.status === "running" ? (
              <Button variant="outline" size="sm">
                <Square className="w-4 h-4 mr-1" />
                Stop
              </Button>
            ) : (
              <Button size="sm">
                <Play className="w-4 h-4 mr-1" />
                Start
              </Button>
            )}
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              Restart
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger 
              className={activeTab === 'overview' ? 'data-[state=active]' : ''}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              className={activeTab === 'metrics' ? 'data-[state=active]' : ''}
              onClick={() => setActiveTab('metrics')}
            >
              Metrics
            </TabsTrigger>
            <TabsTrigger 
              className={activeTab === 'logs' ? 'data-[state=active]' : ''}
              onClick={() => setActiveTab('logs')}
            >
              Logs
            </TabsTrigger>
            <TabsTrigger 
              className={activeTab === 'settings' ? 'data-[state=active]' : ''}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {activeTab === 'overview' && <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Status
                  </CardTitle>
                  <Activity className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {service.status === "running" ? "Online" : "Offline"}
                  </div>
                  <p className="text-xs text-green-600">
                    Uptime: 99.9%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    CPU Usage
                  </CardTitle>
                  <Cpu className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">45%</div>
                  <p className="text-xs text-gray-500">
                    Last 24h average
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Memory Usage
                  </CardTitle>
                  <MemoryStick className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">2.1 GB</div>
                  <p className="text-xs text-gray-500">
                    of 4 GB allocated
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Disk Usage
                  </CardTitle>
                  <HardDrive className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">15.2 GB</div>
                  <p className="text-xs text-gray-500">
                    of 50 GB allocated
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Service Details */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Service Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service ID:</span>
                    <span className="font-mono text-sm">{service.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="capitalize">{service.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Environment:</span>
                    <span className="capitalize">{service.environment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Region:</span>
                    <span>us-east-1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span>{formatDistanceToNow(new Date(service.createdAt), { addSuffix: true })}</span>
                  </div>
                  {service.description && (
                    <div>
                      <span className="text-gray-600">Description:</span>
                      <p className="mt-1 text-sm">{service.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Connection Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-gray-600">Endpoint:</span>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md font-mono text-sm break-all">
                      redis-cluster-abc123.quickspin.internal:6379
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Connection String:</span>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md font-mono text-sm break-all">
                      redis://username:password@redis-cluster-abc123.quickspin.internal:6379/0
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Connection Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>}

          {activeTab === 'metrics' && <div className="space-y-6">
            {/* Metrics Charts */}
            <div className="grid gap-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>CPU Usage</CardTitle>
                  <CardDescription>
                    CPU utilization over the last 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={Array.isArray(metrics) ? [] : (metrics?.cpu || [])}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Memory Usage</CardTitle>
                  <CardDescription>
                    Memory consumption over the last 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={Array.isArray(metrics) ? [] : (metrics?.memory || [])}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="memory" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Disk I/O</CardTitle>
                    <CardDescription>
                      Disk read/write operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={Array.isArray(metrics) ? [] : (metrics?.network || [])}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="disk" stroke="#f59e0b" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Network Traffic</CardTitle>
                    <CardDescription>
                      Network inbound/outbound traffic
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={Array.isArray(metrics) ? [] : (metrics?.requests || [])}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="network" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>}

          {activeTab === 'logs' && <div className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Service Logs</CardTitle>
                  <CardDescription>
                    Recent log entries from your service
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs?.map((log, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{log.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>}

          {activeTab === 'settings' && <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Basic configuration for your service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="service-name">Service Name</Label>
                    <Input
                      id="service-name"
                      defaultValue={service.name}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      defaultValue={service.description || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 min-h-[80px] mt-1"
                      placeholder="Describe your service..."
                    />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Resource Limits</CardTitle>
                  <CardDescription>
                    Configure resource allocation for your service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cpu-limit">CPU Limit (vCPUs)</Label>
                    <Input
                      id="cpu-limit"
                      type="number"
                      defaultValue="2"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="memory-limit">Memory Limit (GB)</Label>
                    <Input
                      id="memory-limit"
                      type="number"
                      defaultValue="4"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="disk-limit">Disk Limit (GB)</Label>
                    <Input
                      id="disk-limit"
                      type="number"
                      defaultValue="50"
                      className="mt-1"
                    />
                  </div>
                  <Button>Update Resources</Button>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Backup Settings</CardTitle>
                  <CardDescription>
                    Configure automatic backups for your service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Automatic Backups</Label>
                      <p className="text-sm text-gray-600">
                        Enable daily automatic backups
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                  <div>
                    <Label htmlFor="backup-retention">Retention Period (days)</Label>
                    <Input
                      id="backup-retention"
                      type="number"
                      defaultValue="30"
                      className="mt-1"
                    />
                  </div>
                  <Button>Save Backup Settings</Button>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Advanced configuration options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>High Availability</Label>
                      <p className="text-sm text-gray-600">
                        Enable multi-zone deployment
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Monitoring</Label>
                      <p className="text-sm text-gray-600">
                        Enable detailed monitoring
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                  <Button>Save Advanced Settings</Button>
                </CardContent>
              </Card>
            </div>
          </div>}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}