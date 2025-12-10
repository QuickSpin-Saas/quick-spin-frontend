import { Metadata } from "next"
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Dashboard | ${APP_NAME}`,
  description: `Manage your microservices, monitor performance, and access all QuickSpin features from your dashboard. ${APP_DESCRIPTION}`,
  keywords: ["dashboard", "microservices", "monitoring", "redis", "rabbitmq", "elasticsearch", "kubernetes"],
  openGraph: {
    title: `Dashboard | ${APP_NAME}`,
    description: `Manage your microservices and monitor performance from your QuickSpin dashboard.`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Dashboard | ${APP_NAME}`,
    description: `Manage your microservices and monitor performance from your QuickSpin dashboard.`,
  },
  robots: "index, follow",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}