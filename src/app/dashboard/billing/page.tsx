"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { useRequireAuth } from "@/lib/auth-utils"
import { useGetBillingSummaryQuery, useGetPaymentMethodsQuery, useGetInvoicesQuery } from "@/lib/redux/api/billingApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  Settings,
  FileText,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from "recharts"

export default function BillingPage() {
  const { isLoading: authLoading } = useRequireAuth()
  const { data: billingSummary, isLoading: billingLoading } = useGetBillingSummaryQuery()
  const { data: paymentMethods } = useGetPaymentMethodsQuery()
  const { data: invoices } = useGetInvoicesQuery()
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="success">Paid</Badge>
      case "pending":
        return <Badge variant="warning">Pending</Badge>
      case "failed":
        return <Badge variant="error">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (authLoading || billingLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Billing & Usage</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Monitor your usage, manage payments, and view billing history
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="w-4 h-4 mr-2" />
              View Invoices
            </Button>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>

        {/* Current Balance Card */}
        <Card variant="gradient" className="hover-lift animate-slide-up">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">$312.45</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Due on July 1, 2024
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button className="bg-success hover:bg-success/90 text-success-foreground w-full sm:w-auto">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger
              className={activeTab === 'overview' ? 'data-[state=active]' : ''}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              className={activeTab === 'usage' ? 'data-[state=active]' : ''}
              onClick={() => setActiveTab('usage')}
            >
              Usage
            </TabsTrigger>
            <TabsTrigger
              className={activeTab === 'payment' ? 'data-[state=active]' : ''}
              onClick={() => setActiveTab('payment')}
            >
              Payment Methods
            </TabsTrigger>
            <TabsTrigger
              className={activeTab === 'history' ? 'data-[state=active]' : ''}
              onClick={() => setActiveTab('history')}
            >
              Billing History
            </TabsTrigger>
          </TabsList>

          {activeTab === 'overview' && <div className="space-y-6">
            {/* Usage Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <Card className="hover-lift animate-slide-up">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    This Month
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">$312.45</div>
                  <p className="text-xs text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +16.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift animate-slide-up">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Services
                  </CardTitle>
                  <Activity className="h-4 w-4 text-info" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">7</div>
                  <p className="text-xs text-muted-foreground">
                    Across 3 environments
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift animate-slide-up">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Daily Cost
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">$10.42</div>
                  <p className="text-xs text-muted-foreground">
                    Based on current usage
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Spending Trend */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Current Month Summary</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Your current billing period overview
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                {billingSummary && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Services</span>
                      <span className="font-medium text-foreground">{billingSummary.currentMonth.services.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Cost</span>
                      <span className="font-medium text-foreground">${billingSummary.currentMonth.total.toFixed(2)}</span>
                    </div>
                    {billingSummary.currentMonth.services.slice(0, 3).map((service, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{service.serviceName}</span>
                        <span className="text-foreground">${service.cost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>}

          {activeTab === 'usage' && <div className="space-y-6">
            {/* Service Usage Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="hover-lift animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-foreground">Service Usage Breakdown</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Cost breakdown by service type this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {billingSummary && (
                    <div className="space-y-3">
                      {billingSummary.currentMonth.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span className="text-sm text-foreground">{service.serviceName}</span>
                          </div>
                          <span className="text-sm font-medium text-foreground">${service.cost.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="hover-lift animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-foreground">Usage Statistics</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Current month service usage details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {billingSummary && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">{billingSummary.currentMonth.services.length}</div>
                          <div className="text-sm text-muted-foreground">Active Services</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">${billingSummary.currentMonth.total.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Total Cost</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground text-center">
                        Current billing period: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Usage Alerts */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Usage Alerts</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Monitor your usage and spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
                      <div>
                        <p className="font-medium text-warning">
                          80% of monthly budget reached
                        </p>
                        <p className="text-sm text-warning/80">
                          You've used $249.96 of your $300 monthly budget
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto border-warning/20 hover:bg-warning/20 text-warning hover:text-warning">
                      View Details
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-info/10 border border-info/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-info flex-shrink-0" />
                      <div>
                        <p className="font-medium text-info">
                          Auto-scaling enabled
                        </p>
                        <p className="text-sm text-info/80">
                          Your services will automatically scale based on demand
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto border-info/20 hover:bg-info/20 text-info hover:text-info">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>}

          {activeTab === 'payment' && <div className="space-y-6">
            {/* Payment Methods */}
            <Card className="border-border">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground">Payment Methods</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage your payment methods
                  </CardDescription>
                </div>
                <Button size="sm" className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Method
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods?.map((method) => (
                    <div key={method.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          <CreditCard className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {method.brand} •••• {method.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expMonth}/{method.expYear}
                          </p>
                          {method.isDefault && (
                            <Badge variant="success" className="mt-1">Default</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="flex-1 sm:flex-none">
                          <Settings className="w-4 h-4" />
                        </Button>
                        {!method.isDefault && (
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                            Make Default
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Billing Settings */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Billing Settings</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configure your billing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Automatic Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically charge your default payment method
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-primary-foreground translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Paperless Billing</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive invoices by email only
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-primary-foreground translate-x-6" />
                  </button>
                </div>

                <div>
                  <Label className="text-foreground">Billing Email</Label>
                  <Input
                    type="email"
                    defaultValue="billing@company.com"
                    className="mt-1"
                  />
                </div>

                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </div>}

          {activeTab === 'history' && <div className="space-y-6">
            {/* Recent Invoices */}
            <Card className="border-border">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground">Billing History</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Your recent invoices and payment history
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Export History
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices?.map((invoice) => (
                    <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            Invoice #{invoice.id.slice(-6)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-left sm:text-right">
                          <p className="font-semibold text-foreground">
                            ${invoice.amount}
                          </p>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}