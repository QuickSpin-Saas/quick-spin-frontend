// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  user: {
    id: string;
    name: string;
    email: string;
  };
  totalServices: number;
  activeServices: number;
  totalUsage: number;
  currentSpend: number;
  usage?: {
    currentMonth: number;
    growth: number;
  };
  billing?: {
    currentMonth: number;
    limit: number;
  };
  uptime?: number;
  recentActivity: Array<{
    id: string;
    type: 'service_created' | 'service_deleted' | 'service_updated';
    description: string;
    timestamp: string;
  }>;
}

// Service types
export type ServiceType = 'redis' | 'rabbitmq' | 'elasticsearch';
export type ServiceStatus = 'running' | 'stopped' | 'error' | 'pending';

export interface Service {
  id: string;
  name: string;
  description?: string;
  type: ServiceType;
  status: ServiceStatus;
  environment: 'development' | 'staging' | 'production';
  region: string;
  configuration: {
    ram: number;
    cpu: number;
    persistence: boolean;
  };
  connectionDetails: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
  metrics: {
    cpu: TimeSeriesData[];
    memory: TimeSeriesData[];
    network: TimeSeriesData[];
    requests: TimeSeriesData[];
  };
  logs: LogEntry[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  serviceId: string;
}

// Billing types
export interface BillingSummary {
  currentMonth: {
    total: number;
    services: Array<{
      serviceId: string;
      serviceName: string;
      type: ServiceType;
      cost: number;
      usage: number;
    }>;
  };
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  createdAt: string;
  pdfUrl?: string;
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface GetServicesParams extends PaginationParams {
  type?: ServiceType;
  status?: ServiceStatus;
  search?: string;
}

export interface CreateServiceData {
  name: string;
  type: ServiceType;
  configuration: {
    ram: number;
    cpu: number;
    persistence: boolean;
  };
  region: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Admin types
export interface AdminDashboardStats {
  totalUsers: number;
  activeServices: number;
  revenueMTD: number;
  errorRate: number;
  recentSignups: User[];
  recentServices: Service[];
}

export interface SystemHealth {
  kubernetes: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    nodes: Array<{
      name: string;
      status: 'ready' | 'not-ready';
      cpu: number;
      memory: number;
      disk: number;
    }>;
  };
  operators: {
    redis: 'healthy' | 'degraded' | 'unhealthy';
    rabbitmq: 'healthy' | 'degraded' | 'unhealthy';
    elasticsearch: 'healthy' | 'degraded' | 'unhealthy';
  };
  certificates: Array<{
    name: string;
    expiresAt: string;
    daysUntilExpiry: number;
  }>;
}

export interface AnalyticsData {
  userGrowth: TimeSeriesData[];
  serviceCreationTrends: TimeSeriesData[];
  popularServices: Array<{
    type: ServiceType;
    count: number;
  }>;
  regionalDistribution: Array<{
    region: string;
    count: number;
  }>;
  churnRate: number;
  conversionFunnel: {
    signups: number;
    activations: number;
    paid: number;
  };
}

// UI types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Theme {
  mode: 'light' | 'dark' | 'system';
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}