import { Metadata } from "next"
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants"
import AdminLayout from "@/components/admin/AdminLayout"

export const metadata: Metadata = {
  title: `Admin Dashboard | ${APP_NAME}`,
  description: `Admin dashboard for managing users, services, and system analytics. ${APP_DESCRIPTION}`,
  keywords: ["admin", "dashboard", "user management", "service management", "analytics", "admin panel"],
  openGraph: {
    title: `Admin Dashboard | ${APP_NAME}`,
    description: `Admin dashboard for managing users, services, and system analytics.`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Admin Dashboard | ${APP_NAME}`,
    description: `Admin dashboard for managing users, services, and system analytics.`,
  },
  robots: "noindex, nofollow",
}

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}