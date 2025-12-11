"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Loader2, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email.trim()) {
      setError("Email is required")
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to send reset email")
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card rounded-2xl shadow-xl p-8 text-center border border-border">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success-light rounded-xl mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Check your email
            </h1>
            <p className="text-muted-foreground mb-6">
              We've sent a password reset link to <strong className="text-foreground">{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              The link will expire in 1 hour. Please check your spam folder if you don't see it in your inbox.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full text-primary hover:text-primary/80 font-medium transition-theme"
              >
                Didn't receive the email? Try again
              </button>
              <Link
                href="/auth/login"
                className="block w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
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
              Reset your password
            </h1>
            <p className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-light border border-error rounded-lg">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground transition-theme"
                  placeholder="Enter your email"
                />
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
                  Sending reset link...
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-primary hover:text-primary/80 transition-theme"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}