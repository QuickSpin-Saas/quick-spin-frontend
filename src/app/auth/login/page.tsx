"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-utils"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Github, Mail, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, loginWithGithub, loginWithGoogle, isLoading } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await login(email, password)
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      })
    } catch (err) {
      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : "Invalid email or password",
        variant: "destructive",
      })
    }
  }

  const handleGithubLogin = async () => {
    try {
      await loginWithGithub()
      toast({
        title: "Success",
        description: "You have been logged in with GitHub.",
      })
    } catch (err) {
      toast({
        title: "Login failed",
        description: "GitHub authentication failed. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      toast({
        title: "Success",
        description: "You have been logged in with Google.",
      })
    } catch (err) {
      toast({
        title: "Login failed",
        description: "Google authentication failed. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-xl mb-4">
              <span className="text-2xl font-bold text-primary-foreground">QS</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your QuickSpin account
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <button
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-foreground hover:bg-foreground/90 text-background rounded-lg transition-theme disabled:opacity-50"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-background hover:bg-accent text-foreground border border-border rounded-lg transition-theme disabled:opacity-50"
            >
              <Mail className="w-5 h-5" />
              Continue with Google
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground transition-theme"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground transition-theme"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-theme"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-theme"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary text-primary-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:text-primary/80 transition-theme"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}