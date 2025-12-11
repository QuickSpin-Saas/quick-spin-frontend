"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle, Home, ArrowLeft } from "lucide-react"
import { Suspense } from "react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration. Please contact support."
      case "AccessDenied":
        return "Access denied. You don't have permission to access this resource."
      case "Verification":
        return "The verification token has expired or has already been used."
      case "Default":
        return "An error occurred during authentication. Please try again."
      default:
        return "An unexpected error occurred. Please try again."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-xl mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Error
          </h1>
          
          <p className="text-gray-600 mb-8">
            {getErrorMessage(error)}
          </p>

          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
            
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mb-4 animate-pulse">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>}>
      <AuthErrorContent />
    </Suspense>
  )
}