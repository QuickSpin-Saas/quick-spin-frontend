"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-utils"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const { logout } = useAuth()

  useEffect(() => {
    logout()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Signing out...
          </h1>
          
          <p className="text-gray-600">
            Please wait while we securely log you out of your account.
          </p>
        </div>
      </div>
    </div>
  )
}