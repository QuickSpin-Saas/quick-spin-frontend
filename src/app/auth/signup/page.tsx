"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Github, Mail, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation error",
        description: "Name is required",
        variant: "destructive",
      })
      return false
    }
    if (!formData.email.trim()) {
      toast({
        title: "Validation error",
        description: "Email is required",
        variant: "destructive",
      })
      return false
    }
    if (!formData.password) {
      toast({
        title: "Validation error",
        description: "Password is required",
        variant: "destructive",
      })
      return false
    }
    if (formData.password.length < 8) {
      toast({
        title: "Validation error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      })
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return false
    }
    if (!formData.organization.trim()) {
      toast({
        title: "Validation error",
        description: "Organization is required",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          organization: formData.organization,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Registration failed")
      }

      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please log in.",
      })
      router.push("/auth/login")
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err instanceof Error ? err.message : "Registration failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubSignup = async () => {
    try {
      window.location.href = "/api/auth/signin/github"
    } catch (err) {
      toast({
        title: "Signup failed",
        description: "GitHub authentication failed. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGoogleSignup = async () => {
    try {
      window.location.href = "/api/auth/signin/google"
    } catch (err) {
      toast({
        title: "Signup failed",
        description: "Google authentication failed. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-xl mb-4">
              <span className="text-2xl font-bold text-primary-foreground">QS</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Join QuickSpin and start deploying microservices
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <button
              onClick={handleGithubSignup}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-foreground hover:bg-foreground/90 text-background rounded-lg transition-theme disabled:opacity-50"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>

            <button
              onClick={handleGoogleSignup}
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
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground transition-theme"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground transition-theme"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-foreground mb-2">
                Organization
              </label>
              <input
                id="organization"
                name="organization"
                type="text"
                value={formData.organization}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground transition-theme"
                placeholder="Enter your organization name"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground transition-theme"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-theme"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground transition-theme"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-theme"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:text-primary/80 transition-theme"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}