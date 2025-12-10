import { Metadata } from "next"
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Authentication | ${APP_NAME}`,
  description: `Sign in to ${APP_NAME} to manage your microservices. ${APP_DESCRIPTION}`,
  keywords: ["login", "signup", "authentication", "microservices", "redis", "rabbitmq", "elasticsearch"],
  openGraph: {
    title: `Authentication | ${APP_NAME}`,
    description: `Sign in to ${APP_NAME} to manage your microservices.`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Authentication | ${APP_NAME}`,
    description: `Sign in to ${APP_NAME} to manage your microservices.`,
  },
  robots: "noindex, nofollow",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}