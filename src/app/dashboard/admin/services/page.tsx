'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Server,
  Activity,
  Settings,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Service {
  id: string;
  name: string;
  type: 'redis' | 'rabbitmq' | 'elasticsearch' | 'postgresql' | 'mongodb';
  status: 'running' | 'stopped' | 'error' | 'pending';
  owner: {
    name: string;
    email: string;
    organization: string;
  };
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  lastActive: string;
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  uptime: number;
  cost: number;
  region: string;
  version: string;
  connections: number;
}

const mockServices: Service[] = [
  {
    id: '1',
    name: 'Production Redis Cache',
    type: 'redis',
    status: 'running',
    owner: {
      name: 'John Doe',
      email: 'john@example.com',
      organization: 'TechCorp'
    },
    plan: 'pro',
    createdAt: '2024-01-15',
    lastActive: '2 minutes ago',
    cpu: 45,
    memory: 68,
    storage: 42,
    network: 23,
    uptime: 99.9,
    cost: 150,
    region: 'us-east-1',
    version: '7.2.4',
    connections: 1247
  },
  {
    id: '2',
    name: 'Message Queue RabbitMQ',
    type: 'rabbitmq',
    status: 'running',
    owner: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      organization: 'StartupXYZ'
    },
    plan: 'enterprise',
    createdAt: '2024-02-01',
    lastActive: '5 minutes ago',
    cpu: 32,
    memory: 55,
    storage: 28,
    network: 67,
    uptime: 99.8,
    cost: 300,
    region: 'eu-west-1',
    version: '3.12.0',
    connections: 892
  },
  {
    id: '3',
    name: 'Elasticsearch Search Engine',
    type: 'elasticsearch',
    status: 'error',
    owner: {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      organization: 'DevStudio'
    },
    plan: 'pro',
    createdAt: '2024-01-20',
    lastActive: '10 minutes ago',
    cpu: 78,
    memory: 85,
    storage: 73,
    network: 45,
    uptime: 95.2,
    cost: 250,
    region: 'us-west-2',
    version: '8.11.0',
    connections: 456
  },
  {
    id: '4',
    name: 'PostgreSQL Database',
    type: 'postgresql',
    status: 'stopped',
    owner: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      organization: 'DesignHub'
    },
    plan: 'free',
    createdAt: '2024-03-10',
    lastActive: '1 hour ago',
    cpu: 0,
    memory: 0,
    storage: 15,
    network: 0,
    uptime: 0,
    cost: 0,
    region: 'ap-southeast-1',
    version: '15.4',
    connections: 0
  },
  {
    id: '5',
    name: 'MongoDB NoSQL',
    type: 'mongodb',
    status: 'running',
    owner: {
      name: 'David Brown',
      email: 'david@example.com',
      organization: 'CloudTech'
    },
    plan: 'enterprise',
    createdAt: '2024-02-15',
    lastActive: '1 minute ago',
    cpu: 28,
    memory: 41,
    storage: 35,
    network: 19,
    uptime: 99.7,
    cost: 200,
    region: 'eu-central-1',
    version: '7.0.2',
    connections: 678
  },
  {
    id: '6',
    name: 'Development Redis',
    type: 'redis',
    status: 'running',
    owner: {
      name: 'Emily Davis',
      email: 'emily@example.com',
      organization: 'CreativeAgency'
    },
    plan: 'free',
    createdAt: '2024-04-01',
    lastActive: '30 minutes ago',
    cpu: 15,
    memory: 25,
    storage: 10,
    network: 8,
    uptime: 98.5,
    cost: 0,
    region: 'us-east-1',
    version: '7.2.4',
    connections: 23
  },
  {
    id: '7',
    name: 'Analytics Elasticsearch',
    type: 'elasticsearch',
    status: 'pending',
    owner: {
      name: 'Robert Taylor',
      email: 'robert@example.com',
      organization: 'Enterprise Solutions'
    },
    plan: 'enterprise',
    createdAt: '2024-05-01',
    lastActive: 'Never',
    cpu: 0,
    memory: 0,
    storage: 0,
    network: 0,
    uptime: 0,
    cost: 500,
    region: 'us-west-1',
    version: '8.11.0',
    connections: 0
  },
  {
    id: '8',
    name: 'Queue Management RabbitMQ',
    type: 'rabbitmq',
    status: 'running',
    owner: {
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      organization: 'Small Business Co'
    },
    plan: 'pro',
    createdAt: '2024-05-15',
    lastActive: '2 hours ago',
    cpu: 22,
    memory: 38,
    storage: 18,
    network: 31,
    uptime: 99.1,
    cost: 120,
    region: 'ca-central-1',
    version: '3.12.0',
    connections: 156
  }
];

const usageData = [
  { name: '00:00', cpu: 45, memory: 68, network: 23 },
  { name: '04:00', cpu: 38, memory: 62, network: 19 },
  { name: '08:00', cpu: 52, memory: 75, network: 34 },
  { name: '12:00', cpu: 67, memory: 82, network: 48 },
  { name: '16:00', cpu: 59, memory: 78, network: 41 },
  { name: '20:00', cpu: 48, memory: 71, network: 28 },
];

const costData = [
  { name: 'Redis', cost: 150, trend: 12 },
  { name: 'RabbitMQ', cost: 300, trend: -5 },
  { name: 'Elasticsearch', cost: 250, trend: 8 },
  { name: 'PostgreSQL', cost: 0, trend: 0 },
  { name: 'MongoDB', cost: 200, trend: 15 },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Service>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.owner.organization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
      const matchesType = typeFilter === 'all' || service.type === typeFilter;
      const matchesPlan = planFilter === 'all' || service.plan === planFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesPlan;
    }).sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [services, searchTerm, statusFilter, typeFilter, planFilter, sortField, sortDirection]);

  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredServices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredServices, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedServices(paginatedServices.map(service => service.id));
    } else {
      setSelectedServices([]);
    }
  };

  const handleSelectService = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices([...selectedServices, serviceId]);
    } else {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    }
  };

  const handleSort = (field: keyof Service) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleBulkAction = (action: string) => {
    const updatedServices = services.map(service => {
      if (selectedServices.includes(service.id)) {
        switch (action) {
          case 'start':
            return { ...service, status: 'running' };
          case 'stop':
            return { ...service, status: 'stopped' };
          case 'restart':
            return { ...service, status: 'running' };
          case 'delete':
            return null;
          default:
            return service;
        }
      }
      return service;
    }).filter(Boolean) as Service[];
    
    setServices(updatedServices);
    setSelectedServices([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge variant="default" className="bg-green-500">Running</Badge>;
      case 'stopped':
        return <Badge variant="secondary">Stopped</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'redis':
        return <Database className="h-4 w-4 text-red-500" />;
      case 'rabbitmq':
        return <Server className="h-4 w-4 text-blue-500" />;
      case 'elasticsearch':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'postgresql':
        return <Database className="h-4 w-4 text-yellow-500" />;
      case 'mongodb':
        return <Database className="h-4 w-4 text-purple-500" />;
      default:
        return <Server className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'free':
        return <Badge variant="outline">Free</Badge>;
      case 'pro':
        return <Badge variant="default" className="bg-blue-500">Pro</Badge>;
      case 'enterprise':
        return <Badge variant="default" className="bg-purple-500">Enterprise</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage all platform services
          </p>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running Services</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => s.status === 'running').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((services.filter(s => s.status === 'running').length / services.length) * 100).toFixed(1)}% uptime
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${services.reduce((sum, s) => sum + s.cost, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. CPU Usage</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(services.filter(s => s.status === 'running').reduce((sum, s) => sum + s.cpu, 0) / 
                services.filter(s => s.status === 'running').length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Trends Chart */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage Trends</CardTitle>
            <CardDescription>CPU, Memory, and Network usage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} name="Memory %" />
                <Line type="monotone" dataKey="network" stroke="#f59e0b" strokeWidth={2} name="Network %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Cost Breakdown</CardTitle>
            <CardDescription>Monthly costs by service type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cost" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="redis">Redis</SelectItem>
                  <SelectItem value="rabbitmq">RabbitMQ</SelectItem>
                  <SelectItem value="elasticsearch">Elasticsearch</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mongodb">MongoDB</SelectItem>
                </SelectContent>
              </Select>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedServices.length > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border p-3 bg-muted/50">
              <span className="text-sm font-medium">
                {selectedServices.length} services selected
              </span>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('start')}
                >
                  <Play className="h-4 w-4" />
                  Start
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('stop')}
                >
                  <Pause className="h-4 w-4" />
                  Stop
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('restart')}
                >
                  <RotateCcw className="h-4 w-4" />
                  Restart
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Services</CardTitle>
              <CardDescription>
                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-4 text-left">
                    <Checkbox
                      checked={selectedServices.length === paginatedServices.length && paginatedServices.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort('name')}
                    >
                      Service
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
                      )}
                    </Button>
                  </th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort('owner')}
                    >
                      Owner
                      {sortField === 'owner' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
                      )}
                    </Button>
                  </th>
                  <th className="p-4 text-left">Plan</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Region</th>
                  <th className="p-4 text-left">CPU</th>
                  <th className="p-4 text-left">Memory</th>
                  <th className="p-4 text-left">Connections</th>
                  <th className="p-4 text-left">Uptime</th>
                  <th className="p-4 text-left">Cost</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedServices.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => handleSelectService(service.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        v{service.version} • Created {service.createdAt}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(service.type)}
                        <span className="text-sm font-medium capitalize">{service.type}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{service.owner.name}</div>
                        <div className="text-sm text-muted-foreground">{service.owner.organization}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      {getPlanBadge(service.plan)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(service.status)}
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{service.region}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Progress value={service.cpu} className="h-2 w-16" />
                        <span className="text-sm text-muted-foreground">{service.cpu}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Progress value={service.memory} className="h-2 w-16" />
                        <span className="text-sm text-muted-foreground">{service.memory}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium">{service.connections.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {service.uptime >= 99 ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : service.uptime >= 95 ? (
                          <AlertCircle className="h-3 w-3 text-yellow-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-sm">{service.uptime}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium">${service.cost}</span>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Service
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {service.status === 'running' ? (
                            <DropdownMenuItem className="text-yellow-600">
                              <Pause className="mr-2 h-4 w-4" />
                              Stop Service
                            </DropdownMenuItem>
                          ) : service.status === 'stopped' ? (
                            <DropdownMenuItem className="text-green-600">
                              <Play className="mr-2 h-4 w-4" />
                              Start Service
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restart Service
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Service
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredServices.length)} of {filteredServices.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}