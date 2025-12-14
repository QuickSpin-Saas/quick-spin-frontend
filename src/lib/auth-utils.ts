"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const useAuth = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const isUnauthenticated = status === "unauthenticated"
  
  const user = session?.user || {
    name: "Demo User",
    email: "demo@quickspin.io",
    image: null,
    role: "admin",
    organization: "Demo Corp"
  }
  const role = session?.user?.role || "admin"
  const organization = session?.user?.organization || "Demo Corp"
  
  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      
      if (result?.error) {
        throw new Error(result.error)
      }
      
      if (result?.ok) {
        router.push("/dashboard")
      }
      
      return result
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }
  
  const logout = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }
  
  const loginWithGithub = async () => {
    try {
      await signIn("github", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("GitHub login error:", error)
      throw error
    }
  }
  
  const loginWithGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Google login error:", error)
      throw error
    }
  }
  
  return {
    user,
    role,
    organization,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    login,
    logout,
    loginWithGithub,
    loginWithGoogle,
  }
}

export const useRequireAuth = () => {
  const { isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    // Development bypass - skip authentication check in development
    // if (process.env.NODE_ENV === "development") {
    //   return
    // }
    
    // if (!isLoading && !isAuthenticated) {
    //   router.push("/auth/login")
    // }
  }, [isLoading, isAuthenticated, router])
  
  return { isLoading, isAuthenticated }
}

export const useRequireRole = (requiredRole: string | string[]) => {
  const { role, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      if (role && !roles.includes(role)) {
        router.push("/dashboard")
      }
    }
  }, [isLoading, isAuthenticated, role, requiredRole, router])
  
  return { hasRole: role && (Array.isArray(requiredRole) ? requiredRole.includes(role) : role === requiredRole) }
}