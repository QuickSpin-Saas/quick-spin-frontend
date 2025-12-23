"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Filter, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const reports = [
    {
        id: "REP-001",
        name: "Monthly Usage Summary",
        type: "PDF",
        date: "Dec 01, 2024",
        size: "2.4 MB",
        status: "Ready"
    },
    {
        id: "REP-002",
        name: "System Performance Audit",
        type: "CSV",
        date: "Dec 01, 2024",
        size: "856 KB",
        status: "Ready"
    },
    {
        id: "REP-003",
        name: "User Activity Log",
        type: "CSV",
        date: "Nov 28, 2024",
        size: "12.5 MB",
        status: "Archived"
    },
    {
        id: "REP-004",
        name: "Billing Reconciliation",
        type: "PDF",
        date: "Nov 01, 2024",
        size: "1.2 MB",
        status: "Ready"
    }
]

export default function AdminReportsPage() {
    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Reports</h1>
                    <p className="text-muted-foreground">
                        Generate and manage system reports
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate New Report
                    </Button>
                </div>
            </div>

            <Card className="glass-card border-none">
                <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>
                        A list of recently generated system reports.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {reports.map((report) => (
                            <div key={report.id} className="flex items-center">
                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <FileText className="h-4 w-4 text-primary" />
                                </div>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{report.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {report.id} • {report.date} • {report.size}
                                    </p>
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                    <div className={`hidden sm:inline-flex px-2 py-1 rounded-full text-xs font-semibold ${report.status === "Ready" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                        }`}>
                                        {report.status}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
