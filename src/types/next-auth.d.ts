import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image: string
      role: string
      organization: string
    }
    accessToken: string
    provider: string
  }

  interface User {
    id: string
    email: string
    name: string
    image: string
    role: string
    organization: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
    image: string
    role: string
    organization: string
    accessToken: string
    provider: string
  }
}