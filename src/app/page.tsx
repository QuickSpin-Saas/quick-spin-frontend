import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Database, Server, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      {/* Header */}
      <header className="relative z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--brand-gradient-start))] to-[hsl(var(--brand-gradient-end))]">
              <span className="text-lg font-bold text-white">Q</span>
            </div>
            <span className="text-xl font-bold tracking-tight">QuickSpin</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#testimonials" className="hover:text-foreground transition-colors">
              Testimonials
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="container pt-24 pb-32 md:pt-32 md:pb-48">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Now in Beta - Developer Preview
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              A Lightweight <span className="text-gradient">Managed Microservices</span> Platform for Developers
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Spin up Redis, RabbitMQ, Elasticsearch and more — instantly, without Docker.
              Built for speed, designed for developers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-[hsl(var(--brand-gradient-start))] to-[hsl(var(--brand-gradient-end))] hover:opacity-90 transition-opacity">
                  Start Building Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  <Zap className="mr-2 h-4 w-4" /> Explore Features
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl md:text-3xl font-bold text-gradient">&lt; 512MB</div>
              <div className="text-sm text-muted-foreground mt-1">RAM Usage</div>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl md:text-3xl font-bold text-gradient">&lt; 100ms</div>
              <div className="text-sm text-muted-foreground mt-1">Spin-up Time</div>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl md:text-3xl font-bold text-gradient">99.9%</div>
              <div className="text-sm text-muted-foreground mt-1">Uptime</div>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl md:text-3xl font-bold text-gradient">$0</div>
              <div className="text-sm text-muted-foreground mt-1">To Get Started</div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section id="features" className="container py-24 border-t border-border/40">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to ship faster</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Focus on your code, not your infrastructure. We handle the complexity of managing stateful services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Managed Databases</h3>
              <p className="text-muted-foreground">
                Redis, MongoDB, and PostgreSQL instances ready in seconds with automated backups.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Message Queues</h3>
              <p className="text-muted-foreground">
                Reliable RabbitMQ and Kafka clusters for your event-driven architecture.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure by Default</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with VPC peering, encryption at rest, and role-based access.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/30">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-[hsl(var(--brand-gradient-start))] to-[hsl(var(--brand-gradient-end))]">
              <span className="text-xs font-bold text-white">Q</span>
            </div>
            <span className="font-semibold">QuickSpin</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 QuickSpin Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Twitter</Link>
            <Link href="#" className="hover:text-foreground">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
