'use client';

import { useState } from 'react';
import { 
  Users, 
  Server, 
  DollarSign, 
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const systemMetrics = [
  { name: 'Total Users', value: 1247, change: 12.5, trend: 'up', icon: Users, color: 'text-info' },
  { name: 'Active Services', value: 892, change: 8.3, trend: 'up', icon: Server, color: 'text-success' },
  { name: 'Revenue', value: 45230, change: -2.1, trend: 'down', icon: DollarSign, color: 'text-primary' },
  { name: 'System Health', value: 98.7, change: 0.3, trend: 'up', icon: Activity, color: 'text-warning' },
];

const serviceDistribution = [
  { name: 'Redis', value: 35, color: '#ef4444' },
  { name: 'RabbitMQ', value: 25, color: '#3b82f6' },
  { name: 'Elasticsearch', value: 20, color: '#10b981' },
  { name: 'PostgreSQL', value: 15, color: '#f59e0b' },
  { name: 'MongoDB', value: 5, color: '#8b5cf6' },
];

const usageTrends = [
  { name: 'Jan', users: 400, services: 240, revenue: 2400 },
  { name: 'Feb', users: 300, services: 139, revenue: 2210 },
  { name: 'Mar', users: 200, services: 980, revenue: 2290 },
  { name: 'Apr', users: 278, services: 390, revenue: 2000 },
  { name: 'May', users: 189, services: 480, revenue: 2181 },
  { name: 'Jun', users: 239, services: 380, revenue: 2500 },
  { name: 'Jul', users: 349, services: 430, revenue: 2100 },
  { name: 'Aug', users: 400, services: 500, revenue: 2800 },
  { name: 'Sep', users: 450, services: 600, revenue: 3200 },
  { name: 'Oct', users: 500, services: 700, revenue: 3500 },
  { name: 'Nov', users: 600, services: 800, revenue: 4000 },
  { name: 'Dec', users: 700, services: 900, revenue: 4500 },
];

const recentActivities = [
  { id: 1, user: 'John Doe', action: 'Created Redis service', timestamp: '2 minutes ago', status: 'success' },
  { id: 2, user: 'Jane Smith', action: 'Updated billing information', timestamp: '5 minutes ago', status: 'success' },
  { id: 3, user: 'Mike Johnson', action: 'Deleted PostgreSQL service', timestamp: '10 minutes ago', status: 'warning' },
  { id: 4, user: 'Sarah Wilson', action: 'Failed to start Elasticsearch', timestamp: '15 minutes ago', status: 'error' },
  { id: 5, user: 'David Brown', action: 'Updated organization settings', timestamp: '20 minutes ago', status: 'success' },
];

const topUsers = [
  { name: 'John Doe', email: 'john@example.com', services: 12, usage: 85, revenue: 2300 },
  { name: 'Jane Smith', email: 'jane@example.com', services: 8, usage: 92, revenue: 1800 },
  { name: 'Mike Johnson', email: 'mike@example.com', services: 15, usage: 78, revenue: 3200 },
  { name: 'Sarah Wilson', email: 'sarah@example.com', services: 6, usage: 88, revenue: 1500 },
  { name: 'David Brown', email: 'david@example.com', services: 10, usage: 95, revenue: 2800 },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-error" />;
      default:
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            System overview and analytics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="w-full sm:w-auto">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {systemMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.name === 'Revenue' ? `$${metric.value.toLocaleString()}` : metric.value.toLocaleString()}
                  {metric.name === 'System Health' && '%'}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-error" />
                  )}
                  <span className={metric.trend === 'up' ? 'text-success' : 'text-error'}>
                    {Math.abs(metric.change)}%
                  </span>
                  <span>from last period</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Usage Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>
                  Monthly user growth and service adoption
                </CardDescription>
              </div>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={usageTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="services" stroke="#10b981" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Service Distribution</CardTitle>
                <CardDescription>
                  Breakdown of active services by type
                </CardDescription>
              </div>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest user actions and system events
                </CardDescription>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Users</CardTitle>
                <CardDescription>
                  Most active users by usage
                </CardDescription>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={user.email} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.services} services • ${user.revenue}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.usage}%</p>
                    <Progress value={user.usage} className="h-2 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current status of all system components
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-muted-foreground">All systems operational</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'API Gateway', status: 'operational', uptime: '99.9%' },
              { name: 'Database Cluster', status: 'operational', uptime: '99.8%' },
              { name: 'Redis Cache', status: 'operational', uptime: '99.7%' },
              { name: 'Load Balancer', status: 'operational', uptime: '99.9%' },
            ].map((component) => (
              <div key={component.name} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{component.name}</p>
                  <div className="h-2 w-2 rounded-full bg-success" />
                </div>
                <p className="text-sm text-muted-foreground">Uptime: {component.uptime}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}