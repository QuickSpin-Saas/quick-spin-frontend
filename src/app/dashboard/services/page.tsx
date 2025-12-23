"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { useRequireAuth } from "@/lib/auth-utils"
import { useGetServicesQuery, useStartServiceMutation, useStopServiceMutation } from "@/lib/redux/api/servicesApi"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loading, LoadingCard } from "@/components/ui/loading"
import { EmptyState } from "@/components/ui/empty-state"
import {
  Server,
  Search,
  Filter,
  Plus,
  Play,
  Square,
  RotateCcw,
  MoreVertical,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Database
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function ServicesPage() {
  const { isLoading: authLoading } = useRequireAuth()
  // Mock data for UI Review
  const services = [
    { id: '1', name: 'Redis Cache', type: 'redis', status: 'running', environment: 'production', createdAt: new Date(Date.now() - 86400000).toISOString(), metrics: { cpu: [{ value: 45 }] } },
    { id: '2', name: 'RabbitMQ Cluster', type: 'rabbitmq', status: 'stopped', environment: 'staging', createdAt: new Date(Date.now() - 172800000).toISOString(), metrics: { cpu: [{ value: 0 }] } },
    { id: '3', name: 'Main DB', type: 'postgres', status: 'deploying', environment: 'development', createdAt: new Date().toISOString(), metrics: { cpu: [{ value: 12 }] } },
    { id: '4', name: 'Search Engine', type: 'elasticsearch', status: 'error', environment: 'production', createdAt: new Date(Date.now() - 604800000).toISOString(), metrics: { cpu: [{ value: 0 }] } },
    { id: '5', name: 'Analytics Store', type: 'mongodb', status: 'running', environment: 'production', createdAt: new Date(Date.now() - 2592000000).toISOString(), metrics: { cpu: [{ value: 78 }] } },
  ]
  const servicesLoading = false
  // const { data: services = [], isLoading: servicesLoading } = useGetServicesQuery({})
  const [startService] = useStartServiceMutation()
  const [stopService] = useStopServiceMutation()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [environmentFilter, setEnvironmentFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.type.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || service.status === statusFilter
      const matchesType = typeFilter === "all" || service.type === typeFilter
      const matchesEnvironment = environmentFilter === "all" || service.environment === environmentFilter

      return matchesSearch && matchesStatus && matchesType && matchesEnvironment
    })
  }, [services, searchTerm, statusFilter, typeFilter, environmentFilter])

  const handleStartService = async (serviceId: string) => {
    try {
      await startService(serviceId).unwrap()
      toast({
        title: "Service started",
        description: "Service has been started successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to start service",
        description: error instanceof Error ? error.message : "Could not start the service.",
        variant: "destructive",
      })
    }
  }

  const handleStopService = async (serviceId: string) => {
    try {
      await stopService(serviceId).unwrap()
      toast({
        title: "Service stopped",
        description: "Service has been stopped successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to stop service",
        description: error instanceof Error ? error.message : "Could not stop the service.",
        variant: "destructive",
      })
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setTypeFilter("all")
    setEnvironmentFilter("all")
    toast({
      title: "Filters cleared",
      description: "All filters have been reset.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge variant="success">Running</Badge>
      case "stopped":
        return <Badge variant="secondary">Stopped</Badge>
      case "deploying":
        return <Badge variant="info">Deploying</Badge>
      case "error":
        return <Badge variant="error">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "redis":
        return <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
          <Database className="w-6 h-6 text-white" />
        </div>
      case "rabbitmq":
        return <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
          <Server className="w-6 h-6 text-white" />
        </div>
      case "elasticsearch":
        return <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
          <Database className="w-6 h-6 text-white" />
        </div>
      case "postgres":
        return <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
          <Database className="w-6 h-6 text-white" />
        </div>
      case "mongodb":
        return <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
          <Database className="w-6 h-6 text-white" />
        </div>
      default:
        return <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md">
          <Server className="w-6 h-6 text-white" />
        </div>
    }
  }

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loading text="Loading services..." size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (servicesLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header Loading */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <LoadingCard className="w-64" lines={2} />
            <div className="h-10 w-full md:w-32 bg-muted rounded-lg animate-pulse" />
          </div>

          {/* Search and Filters Loading */}
          <div className="flex items-center gap-4">
            <div className="h-10 flex-1 max-w-md bg-muted rounded-lg animate-pulse" />
            <div className="h-10 w-24 bg-muted rounded-lg animate-pulse" />
          </div>

          {/* Results Summary Loading */}
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />

          {/* Services Grid Loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingCard key={i} className="p-6 bg-card rounded-lg border border-border" lines={5} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage and monitor your deployed microservices
            </p>
          </div>
          <Link href="/dashboard/services/create" className="w-full md:w-auto">
            <Button className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Service
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            {(statusFilter !== "all" || typeFilter !== "all" || environmentFilter !== "all" || searchTerm) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg border border-border animate-in slide-in-from-top-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="stopped">Stopped</SelectItem>
                    <SelectItem value="deploying">Deploying</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Type
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="redis">Redis</SelectItem>
                    <SelectItem value="rabbitmq">RabbitMQ</SelectItem>
                    <SelectItem value="elasticsearch">Elasticsearch</SelectItem>
                    <SelectItem value="postgres">PostgreSQL</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Environment
                </label>
                <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Environments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Environments</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {filteredServices.length} of {services.length} services
          </p>
          {filteredServices.length > 0 && (
            <p>
              {filteredServices.filter(s => s.status === "running").length} running,{" "}
              {filteredServices.filter(s => s.status === "stopped").length} stopped
            </p>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredServices.map((service, index) => (
            <Card key={service.id} variant="gradient" className="hover-lift animate-slide-up group relative" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500 blur-xl"></div>
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getServiceIcon(service.type)}
                    <div>
                      <CardTitle className="text-lg font-bold text-white">{service.name}</CardTitle>
                      <CardDescription className="capitalize flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-white/10 text-white/80 hover:bg-white/20 border-none">{service.type}</Badge>
                        <Badge variant="outline" className="border-white/20 text-white/70">{service.environment}</Badge>
                      </CardDescription>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg border border-white/5">
                    <span className="text-sm font-medium text-white/70">Status</span>
                    {getStatusBadge(service.status)}
                  </div>
                  <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg border border-white/5">
                    <span className="text-sm font-medium text-white/70">Created</span>
                    <span className="text-sm font-semibold text-white/90">
                      {formatDistanceToNow(new Date(service.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {service.metrics && service.metrics.cpu && service.metrics.cpu.length > 0 && (
                    <div className="space-y-1.5 p-2 bg-black/20 rounded-lg border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white/70">CPU Usage</span>
                        <span className="text-sm font-bold text-white/90">
                          {service.metrics.cpu[service.metrics.cpu.length - 1]?.value || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
                          style={{ width: `${service.metrics.cpu[service.metrics.cpu.length - 1]?.value || 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {service.status === "running" ? (
                    <Button
                      variant="glass"
                      size="sm"
                      className="flex-1 hover:bg-red-500/20 hover:text-red-200 hover:border-red-500/30"
                      onClick={() => handleStopService(service.id)}
                    >
                      <Square className="w-4 h-4 mr-1" />
                      Stop
                    </Button>
                  ) : (
                    <Button
                      variant="glass"
                      size="sm"
                      className="flex-1 hover:bg-emerald-500/20 hover:text-emerald-200 hover:border-emerald-500/30"
                      onClick={() => handleStartService(service.id)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  )}
                  <Link href={`/dashboard/services/${service.id}`} className="flex-1">
                    <Button size="sm" variant="default" className="w-full bg-white text-purple-900 hover:bg-white/90 shadow-none">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <EmptyState
            icon={Server}
            title="No services found"
            description={
              searchTerm || statusFilter !== "all" || typeFilter !== "all" || environmentFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first service"
            }
            action={
              !(searchTerm || statusFilter !== "all" || typeFilter !== "all" || environmentFilter !== "all")
                ? {
                  label: "Create Service",
                  href: "/dashboard/services/create"
                }
                : {
                  label: "Clear Filters",
                  onClick: clearFilters
                }
            }
          />
        )}
      </div>
    </DashboardLayout>
  )
}
