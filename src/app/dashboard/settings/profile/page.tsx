"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Upload,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  Activity,
  Github,
  Twitter,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { useAuth } from "@/lib/auth-utils"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const recentActivity = [
    { id: 1, action: "Password changed", time: "2 hours ago", status: "success" },
    { id: 2, action: "Profile updated", time: "1 day ago", status: "success" },
    { id: 3, action: "Failed login attempt", time: "3 days ago", status: "warning" },
    { id: 4, action: "Email verified", time: "1 week ago", status: "success" }
  ]

  const connectedAccounts = [
    { id: 1, provider: "GitHub", connected: true, icon: Github },
    { id: 2, provider: "Twitter", connected: false, icon: Twitter }
  ]

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "warning":
        return <XCircle className="w-4 h-4 text-warning" />
      default:
        return <Clock className="w-4 h-4 text-info" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage your personal information and account settings
            </p>
          </div>
          <Link href="/dashboard/settings">
            <Button variant="outline">Back to Settings</Button>
          </Link>
        </div>

        {/* Profile Overview */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details and profile photo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Photo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback className="text-xl sm:text-2xl bg-gradient-primary text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto text-destructive hover:text-destructive">
                    Remove
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or GIF. Max size 2MB. Recommended 400x400px.
                </p>
              </div>
            </div>

            {/* Personal Information Form */}
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      defaultValue={user?.name || "John Doe"}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email || "john@example.com"}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="San Francisco, CA"
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground transition-theme resize-none"
                  placeholder="Tell us about yourself..."
                  disabled={!isEditing}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {!isEditing ? (
                  <Button type="button" onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button type="submit" className="w-full sm:w-auto">
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Change Password
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Enable 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connected Accounts */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your linked social accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {connectedAccounts.map((account) => {
                const Icon = account.icon
                return (
                  <div key={account.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{account.provider}</p>
                        {account.connected && (
                          <Badge variant="success" className="mt-1">Connected</Badge>
                        )}
                      </div>
                    </div>
                    <Button variant={account.connected ? "ghost" : "outline"} size="sm">
                      {account.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent account activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getActivityIcon(activity.status)}
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/activity">
                <Button variant="ghost" size="sm" className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  View All Activity
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-destructive/50 rounded-lg bg-destructive/5">
              <div>
                <p className="font-medium text-foreground">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
