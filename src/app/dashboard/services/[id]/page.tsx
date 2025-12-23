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
  Cpu,
  HardDrive,
  MemoryStick,
  AlertCircle,
  Database,
  Download,
  RefreshCw,
  ExternalLink,
  Edit,
  Trash2,
  Terminal,
  ArrowUpRight
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

export default function ServiceDetailPage() {
  const { isLoading: authLoading } = useRequireAuth()
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string

  const { data: apiService, isLoading: serviceLoading } = useGetServiceQuery(serviceId)

  // Mock data fallback
  const mockService = {
    id: serviceId,
    name: "Redis Cache Production",
    type: "redis",
    status: "running",
    environment: "production",
    region: "us-east-1",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    description: "Primary Redis cluster for caching session data and API responses.",
    configuration: {
      port: 6379,
      version: "7.0",
      endpoint: "redis-cluster-prod.quickspin.internal"
    }
  }

  const service = apiService || mockService

  // Mock metrics
  const mockMetrics = {
    cpu: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, cpu: Math.floor(Math.random() * 40) + 10 })),
    memory: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, memory: Math.floor(Math.random() * 60) + 20 })),
    network: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, network: Math.floor(Math.random() * 100) + 50 })),
    requests: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, requests: Math.floor(Math.random() * 1000) + 200 })),
  }

  // Mock logs
  const mockLogs = [
    { level: "info", message: "Backup completed successfully", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { level: "info", message: "Client connected from 10.0.0.15", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { level: "warning", message: "Memory usage above 70%", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { level: "info", message: "Service started", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  ]

  const metrics = mockMetrics
  const logs = mockLogs

  const [activeTab, setActiveTab] = useState("overview")

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Running</Badge>
      case "stopped":
        return <Badge variant="secondary">Stopped</Badge>
      case "deploying":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Deploying</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "redis": return <Database className="w-6 h-6 text-red-500" />
      case "rabbitmq": return <Server className="w-6 h-6 text-orange-500" />
      case "elasticsearch": return <Activity className="w-6 h-6 text-yellow-500" />
      default: return <Server className="w-6 h-6 text-primary" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center border border-white/10">
              {getServiceIcon(service.type)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {service.name}
                </h1>
                {getStatusBadge(service.status)}
              </div>
              <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                <span className="capitalize">{service.type}</span> •
                <span className="capitalize">{service.environment}</span> •
                Created {formatDistanceToNow(new Date(service.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Metrics
            </Button>
            {service.status === "running" ? (
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            ) : (
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            )}
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            {['overview', 'metrics', 'logs', 'settings'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="capitalize data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="glass-card border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                  <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">running</div>
                  <p className="text-xs text-green-500 font-medium">99.9% Uptime</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">CPU Usage</CardTitle>
                  <Cpu className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24%</div>
                  <p className="text-xs text-muted-foreground">Average load</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Memory</CardTitle>
                  <MemoryStick className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2 GB</div>
                  <p className="text-xs text-muted-foreground">of 4 GB (30%)</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Disk</CardTitle>
                  <HardDrive className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15 GB</div>
                  <p className="text-xs text-muted-foreground">of 50 GB (30%)</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
              <Card className="col-span-4 glass-card border-none">
                <CardHeader>
                  <CardTitle>Connection Details</CardTitle>
                  <CardDescription>Use these details to connect to your service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Endpoint</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-3 bg-black/40 rounded-lg font-mono text-sm border border-white/5 truncate">
                        {(service as any).configuration?.endpoint || 'redis-cluster-prod.quickspin.internal'}
                      </div>
                      <Button size="icon" variant="outline" className="shrink-0"><span className="sr-only">Copy</span><Terminal className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Port</Label>
                    <div className="flex-1 p-3 bg-black/40 rounded-lg font-mono text-sm border border-white/5">
                      {(service as any).configuration?.port || '6379'}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3 glass-card border-none">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Recent health checks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">Health Check #{1000 + i}</p>
                            <p className="text-xs text-muted-foreground">Passed successfully</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">2m ago</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Real-time resource usage metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.cpu}>
                      <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a0f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="cpu" stroke="#8884d8" fillOpacity={1} fill="url(#colorCpu)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Live Logs</CardTitle>
                  <CardDescription>Real-time logs from your instance</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Download</Button>
                  <Button variant="ghost" size="sm"><RefreshCw className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-black/40 rounded-lg border border-white/5 p-4 font-mono text-sm max-h-[400px] overflow-y-auto space-y-2">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-3 text-muted-foreground/80 hover:bg-white/5 p-1 rounded transition-colors">
                      <span className="shrink-0 text-blue-400">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className={`shrink-0 uppercase w-16 ${log.level === 'error' ? 'text-red-400' : log.level === 'warning' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {log.level}
                      </span>
                      <span className="text-foreground/90">{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle>General Configuration</CardTitle>
                <CardDescription>Manage your service settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Service Name</Label>
                  <Input defaultValue={service.name} className="bg-black/20" />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Input defaultValue={service.description} className="bg-black/20" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
            <Card className="glass-card border-none border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Destructive actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div>
                    <h4 className="font-semibold text-destructive">Delete Service</h4>
                    <p className="text-sm text-destructive/70">This action cannot be undone.</p>
                  </div>
                  <Button variant="destructive">Delete Service</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}