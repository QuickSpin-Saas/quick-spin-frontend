export interface SEOConfig {
  title: string
  description: string
  keywords: string[]
  openGraph: {
    title: string
    description: string
    type: string
    siteName: string
    images?: string[]
  }
  twitter: {
    card: string
    title: string
    description: string
    images?: string[]
  }
  robots: string
  viewport: string
  charset: string
  lang: string
}

export const APP_NAME = "QuickSpin"
export const APP_DESCRIPTION = "Deploy and manage Redis, RabbitMQ, Elasticsearch, and other microservices with QuickSpin's managed platform. Scale effortlessly with Kubernetes."
export const APP_URL = "https://quickspin.io"
export const APP_IMAGE = "https://quickspin.io/og-image.png"

export const defaultSEO: SEOConfig = {
  title: `${APP_NAME} - Managed Microservices Platform`,
  description: APP_DESCRIPTION,
  keywords: [
    "microservices",
    "redis hosting",
    "rabbitmq hosting",
    "elasticsearch hosting",
    "managed services",
    "kubernetes",
    "cloud hosting",
    "database hosting",
    "message queue",
    "search engine",
    "cache service",
    "redis cluster",
    "rabbitmq cluster",
    "elasticsearch cluster",
    "scalable infrastructure",
    "devops tools",
    "developer platform"
  ],
  openGraph: {
    title: `${APP_NAME} - ${APP_DESCRIPTION}`,
    description: APP_DESCRIPTION,
    type: "website",
    siteName: APP_NAME,
    images: [APP_IMAGE]
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [APP_IMAGE]
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  charset: "utf-8",
  lang: "en"
}

export const pageSEO = {
  home: {
    ...defaultSEO,
    title: `${APP_NAME} - Deploy Microservices in Minutes`
  },
  login: {
    ...defaultSEO,
    title: `Login - ${APP_NAME}`,
    description: "Sign in to your QuickSpin account to manage your microservices."
  },
  signup: {
    ...defaultSEO,
    title: `Sign Up - ${APP_NAME}`,
    description: "Create a free QuickSpin account to start deploying microservices."
  },
  dashboard: {
    ...defaultSEO,
    title: `Dashboard - ${APP_NAME}`,
    description: "Manage and monitor your deployed microservices from the QuickSpin dashboard."
  },
  services: {
    ...defaultSEO,
    title: `Services - ${APP_NAME}`,
    description: "View and manage all your deployed microservices including Redis, RabbitMQ, and Elasticsearch."
  },
  createService: {
    ...defaultSEO,
    title: `Create Service - ${APP_NAME}`,
    description: "Deploy a new microservice with QuickSpin's managed platform. Choose from Redis, RabbitMQ, Elasticsearch, and more."
  },
  billing: {
    ...defaultSEO,
    title: `Billing - ${APP_NAME}`,
    description: "Manage your billing information, view usage statistics, and update payment methods."
  },
  settings: {
    ...defaultSEO,
    title: `Settings - ${APP_NAME}`,
    description: "Configure your account settings, API keys, and preferences."
  },
  admin: {
    ...defaultSEO,
    title: `Admin Dashboard - ${APP_NAME}`,
    description: "Administrative dashboard for managing users, services, and system analytics."
  }
}

export const generatePageSEO = (page: keyof typeof pageSEO, customData?: Partial<SEOConfig>) => {
  const baseConfig = pageSEO[page] || defaultSEO
  return {
    ...baseConfig,
    ...customData
  }
}