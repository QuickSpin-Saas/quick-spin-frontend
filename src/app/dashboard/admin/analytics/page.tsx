"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground">
                        System performance and usage metrics
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Last 30 Days
                    </Button>
                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.2M</div>
                        <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45ms</div>
                        <p className="text-xs text-muted-foreground">-5% from last month</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0.12%</div>
                        <p className="text-xs text-muted-foreground">-0.05% from last month</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">843</div>
                        <p className="text-xs text-muted-foreground">+24 since last hour</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 glass-card border-none">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>
                            Service usage over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-white/10 rounded-lg">
                            Chart Placeholder
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 glass-card border-none">
                    <CardHeader>
                        <CardTitle>Top Services</CardTitle>
                        <CardDescription>
                            Most used microservices
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-full space-y-1">
                                    <p className="text-sm font-medium leading-none">Redis Clusters</p>
                                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[75%]" />
                                    </div>
                                </div>
                                <span className="ml-4 font-bold">75%</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-full space-y-1">
                                    <p className="text-sm font-medium leading-none">PostgreSQL</p>
                                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[45%]" />
                                    </div>
                                </div>
                                <span className="ml-4 font-bold">45%</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-full space-y-1">
                                    <p className="text-sm font-medium leading-none">RabbitMQ</p>
                                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[30%]" />
                                    </div>
                                </div>
                                <span className="ml-4 font-bold">30%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
