"use client"

import { Component, ErrorInfo, ReactNode } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    console.error("Error caught by boundary:", error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
                <div>
                  <CardTitle className="text-red-600">
                    Something went wrong
                  </CardTitle>
                  <CardDescription>
                    An unexpected error has occurred. We've been notified and are working to fix it.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-100 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900 mb-2">
                Error Details
              </p>
              <p className="text-sm text-slate-600 font-mono">
                {this.state.error.name}: {this.state.error.message}
              </p>
              {this.state.errorInfo && (
                <details className="mt-3">
                  <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700">
                    Show technical details
                  </summary>
                  <pre className="mt-2 text-xs text-slate-500 overflow-auto max-h-32 font-mono">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={this.resetError}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<Props, 'children'>
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary {...options}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}