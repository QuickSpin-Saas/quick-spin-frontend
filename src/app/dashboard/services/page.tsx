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
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function ServicesPage() {
  const { isLoading: authLoading } = useRequireAuth()
  const { data: services = [], isLoading: servicesLoading } = useGetServicesQuery({})
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
        return <div className="w-10 h-10 bg-service-redis-light rounded-lg flex items-center justify-center">
                 <span className="text-service-redis font-bold text-sm">R</span>
               </div>
      case "rabbitmq":
        return <div className="w-10 h-10 bg-service-rabbitmq-light rounded-lg flex items-center justify-center">
                 <span className="text-service-rabbitmq font-bold text-sm">RM</span>
               </div>
      case "elasticsearch":
        return <div className="w-10 h-10 bg-service-elasticsearch-light rounded-lg flex items-center justify-center">
                 <span className="text-service-elasticsearch font-bold text-sm">ES</span>
               </div>
      case "postgres":
        return <div className="w-10 h-10 bg-service-postgres-light rounded-lg flex items-center justify-center">
                 <span className="text-service-postgres font-bold text-sm">PG</span>
               </div>
      case "mongodb":
        return <div className="w-10 h-10 bg-service-mongodb-light rounded-lg flex items-center justify-center">
                 <span className="text-service-mongodb font-bold text-sm">MG</span>
               </div>
      default:
        return <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                 <Server className="w-5 h-5 text-primary" />
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
            <Button variant="gradient" className="w-full md:w-auto">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg border border-border">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground transition-theme"
                >
                  <option value="all">All Status</option>
                  <option value="running">Running</option>
                  <option value="stopped">Stopped</option>
                  <option value="deploying">Deploying</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground transition-theme"
                >
                  <option value="all">All Types</option>
                  <option value="redis">Redis</option>
                  <option value="rabbitmq">RabbitMQ</option>
                  <option value="elasticsearch">Elasticsearch</option>
                  <option value="postgres">PostgreSQL</option>
                  <option value="mongodb">MongoDB</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Environment
                </label>
                <select
                  value={environmentFilter}
                  onChange={(e) => setEnvironmentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground transition-theme"
                >
                  <option value="all">All Environments</option>
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
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
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover-lift animate-in">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getServiceIcon(service.type)}
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {service.type} • {service.environment}
                      </CardDescription>
                    </div>
                  </div>
                  <button className="p-1 rounded-md hover:bg-accent transition-theme">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(service.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm text-foreground">
                      {formatDistanceToNow(new Date(service.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {service.metrics && service.metrics.cpu && service.metrics.cpu.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">CPU Usage</span>
                      <span className="text-sm text-foreground">
                        {service.metrics.cpu[service.metrics.cpu.length - 1]?.value || 0}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  {service.status === "running" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStopService(service.id)}
                    >
                      <Square className="w-4 h-4 mr-1" />
                      Stop
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStartService(service.id)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  )}
                  <Link href={`/dashboard/services/${service.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
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