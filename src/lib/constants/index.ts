export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const APP_NAME = 'QuickSpin'
export const APP_DESCRIPTION = 'Managed Microservices Platform'

export const SERVICE_TYPES = [
  { value: 'redis', label: 'Redis', description: 'In-memory data structure store' },
  { value: 'rabbitmq', label: 'RabbitMQ', description: 'Message broker' },
  { value: 'elasticsearch', label: 'Elasticsearch', description: 'Search and analytics engine' },
] as const

export const SERVICE_STATUS_COLORS = {
  running: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
  stopped: 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200',
  error: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200',
  pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
} as const

export const REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
  { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
] as const

export const CONFIGURATION_OPTIONS = {
  redis: [
    { ram: 256, cpu: 0.5, persistence: false, price: 10 },
    { ram: 512, cpu: 1, persistence: true, price: 25 },
    { ram: 1024, cpu: 2, persistence: true, price: 50 },
    { ram: 2048, cpu: 4, persistence: true, price: 100 },
  ],
  rabbitmq: [
    { ram: 512, cpu: 1, persistence: true, price: 30 },
    { ram: 1024, cpu: 2, persistence: true, price: 60 },
    { ram: 2048, cpu: 4, persistence: true, price: 120 },
    { ram: 4096, cpu: 8, persistence: true, price: 240 },
  ],
  elasticsearch: [
    { ram: 1024, cpu: 2, persistence: true, price: 80 },
    { ram: 2048, cpu: 4, persistence: true, price: 160 },
    { ram: 4096, cpu: 8, persistence: true, price: 320 },
    { ram: 8192, cpu: 16, persistence: true, price: 640 },
  ],
} as const

export const TIME_RANGES = [
  { value: '1h', label: 'Last 1 hour' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
] as const

export const LOG_LEVELS = [
  { value: 'info', label: 'Info', color: 'text-blue-600' },
  { value: 'warning', label: 'Warning', color: 'text-yellow-600' },
  { value: 'error', label: 'Error', color: 'text-red-600' },
  { value: 'debug', label: 'Debug', color: 'text-gray-600' },
] as const

export const USER_ROLES = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
] as const

export const OAUTH_PROVIDERS = [
  { name: 'github', label: 'GitHub', icon: 'github' },
  { name: 'google', label: 'Google', icon: 'google' },
] as const