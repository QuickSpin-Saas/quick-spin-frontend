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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="glass-card p-8 md:p-10 animate-slide-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-4 shadow-colored">
              <span className="text-3xl font-bold text-white">QS</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gradient">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-base">
              Sign in to your QuickSpin account
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 glass hover:bg-white/90 text-foreground rounded-xl transition-all duration-200 disabled:opacity-50 font-medium shadow-md hover-lift"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 glass hover:bg-white/90 text-foreground rounded-xl transition-all duration-200 disabled:opacity-50 font-medium shadow-md hover-lift"
            >
              <Mail className="w-5 h-5 text-primary" />
              Continue with Google
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/90 text-muted-foreground font-medium">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 border-2 border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200 font-medium"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 pr-12 border-2 border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200 font-medium"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-foreground">
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover-glow hover-lift shadow-md"
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
              className="font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}