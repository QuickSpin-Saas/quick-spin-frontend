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
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
      case "pending":
        return <Badge variant="outline" className="border-yellow-200 text-yellow-800">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (authLoading || billingLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Usage</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor your usage, manage payments, and view billing history
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              View Invoices
            </Button>
            <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>

        {/* Current Balance Card */}
        <Card className="border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Balance</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">$312.45</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Due on July 1, 2024
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs>
          <TabsList className="grid w-full grid-cols-4">
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
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    This Month
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">$312.45</div>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +16.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Services
                  </CardTitle>
                  <Activity className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">7</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Across 3 environments
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Average Daily Cost
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">$10.42</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Based on current usage
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Spending Trend */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Current Month Summary</CardTitle>
                  <CardDescription>
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
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Services</span>
                      <span className="font-medium">{billingSummary.currentMonth.services.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Cost</span>
                      <span className="font-medium">${billingSummary.currentMonth.total.toFixed(2)}</span>
                    </div>
                    {billingSummary.currentMonth.services.slice(0, 3).map((service, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{service.serviceName}</span>
                        <span>${service.cost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>}

          {activeTab === 'usage' && <div className="space-y-6">
            {/* Service Usage Breakdown */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Service Usage Breakdown</CardTitle>
                  <CardDescription>
                    Cost breakdown by service type this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {billingSummary && (
                    <div className="space-y-3">
                      {billingSummary.currentMonth.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary-600" />
                            <span className="text-sm">{service.serviceName}</span>
                          </div>
                          <span className="text-sm font-medium">${service.cost.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                  <CardDescription>
                    Current month service usage details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {billingSummary && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-primary-600">{billingSummary.currentMonth.services.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Active Services</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-primary-600">${billingSummary.currentMonth.total.toFixed(2)}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Total Cost</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Current billing period: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Usage Alerts */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Usage Alerts</CardTitle>
                <CardDescription>
                  Monitor your usage and spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <p className="font-medium text-yellow-800 dark:text-yellow-400">
                          80% of monthly budget reached
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          You've used $249.96 of your $300 monthly budget
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-400">
                          Auto-scaling enabled
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Your services will automatically scale based on demand
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>}

          {activeTab === 'payment' && <div className="space-y-6">
            {/* Payment Methods */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Method
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods?.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {method.brand} •••• {method.last4}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Expires {method.expMonth}/{method.expYear}
                          </p>
                          {method.isDefault && (
                            <Badge className="mt-1 bg-green-100 text-green-800 border-green-200">Default</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        {!method.isDefault && (
                          <Button variant="outline" size="sm">
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
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Billing Settings</CardTitle>
                <CardDescription>
                  Configure your billing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Payments</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically charge your default payment method
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Paperless Billing</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive invoices by email only
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>

                <div>
                  <Label>Billing Email</Label>
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
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>
                    Your recent invoices and payment history
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export History
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices?.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Invoice #{invoice.id.slice(-6)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
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