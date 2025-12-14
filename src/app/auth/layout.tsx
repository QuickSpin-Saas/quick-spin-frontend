import Link from "next/link"
import { Metadata } from "next"
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants"
import { Shield, Zap, Server } from "lucide-react"

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
  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/95 via-purple-500/95 to-purple-600/95 backdrop-blur-sm" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 mr-2">
            <span className="text-lg font-bold">Q</span>
          </div>
          {APP_NAME}
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;QuickSpin has completely transformed how we handle our development infrastructure. Spinning up a Redis instance takes seconds instead of minutes.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis, Senior DevOps Engineer</footer>
          </blockquote>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm opacity-20 pointer-events-none">
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-white/10 rounded-lg transform rotate-6">
                <Server className="w-8 h-8 mb-2" />
                <div className="h-2 w-12 bg-white/20 rounded mb-1"></div>
                <div className="h-2 w-20 bg-white/20 rounded"></div>
             </div>
             <div className="p-4 bg-white/10 rounded-lg transform -rotate-3 translate-y-8">
                <Zap className="w-8 h-8 mb-2" />
                <div className="h-2 w-12 bg-white/20 rounded mb-1"></div>
                <div className="h-2 w-20 bg-white/20 rounded"></div>
             </div>
             <div className="p-4 bg-white/10 rounded-lg transform -rotate-6">
                <Shield className="w-8 h-8 mb-2" />
                <div className="h-2 w-12 bg-white/20 rounded mb-1"></div>
                <div className="h-2 w-20 bg-white/20 rounded"></div>
             </div>
          </div>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
