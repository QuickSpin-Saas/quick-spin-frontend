import { Metadata } from "next"
import { SEO } from "@/components/ui/seo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Users, Eye, Keyboard, Volume2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "QuickSpin is committed to making our platform accessible to all users. Learn about our accessibility features and compliance.",
}

export default function AccessibilityPage() {
  const features = [
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Full keyboard navigation support with clear focus indicators and logical tab order."
    },
    {
      icon: Eye,
      title: "Screen Reader Support",
      description: "Compatible with screen readers and assistive technologies using proper ARIA labels."
    },
    {
      icon: Volume2,
      title: "Audio Feedback",
      description: "Announcements for important state changes and loading states for screen readers."
    },
    {
      icon: Users,
      title: "High Contrast Mode",
      description: "Support for high contrast settings and reduced motion preferences."
    }
  ]

  const standards = [
    {
      level: "WCAG 2.1 Level A",
      status: "Compliant",
      description: "Basic accessibility requirements including keyboard navigation and text alternatives."
    },
    {
      level: "WCAG 2.1 Level AA",
      status: "Compliant",
      description: "Enhanced accessibility including color contrast, text sizing, and navigation."
    },
    {
      level: "Section 508",
      status: "Compliant",
      description: "Federal accessibility requirements for electronic and information technology."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO
        title="Accessibility Statement"
        description="QuickSpin is committed to making our platform accessible to all users. Learn about our accessibility features and compliance."
        keywords={["accessibility", "wcag", "aria", "screen reader", "keyboard navigation"]}
      />
      
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Accessibility Statement
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            QuickSpin is committed to making our platform accessible to all users, regardless of ability or technology.
          </p>
        </div>

        <div className="grid gap-8 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Compliance Standards
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {standards.map((standard, index) => (
              <Card key={index} className="border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">{standard.level}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {standard.status === "Compliant" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    {standard.status}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {standard.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl">Keyboard Shortcuts</CardTitle>
            <CardDescription>
              Navigate QuickSpin efficiently using keyboard shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Skip to main content</span>
                <kbd className="px-2 py-1 text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                  Tab
                </kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Navigate sidebar</span>
                <kbd className="px-2 py-1 text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                  Arrow Keys
                </kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Activate buttons/links</span>
                <kbd className="px-2 py-1 text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                  Enter / Space
                </kbd>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700 dark:text-gray-300">Close modals</span>
                <kbd className="px-2 py-1 text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                  Escape
                </kbd>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Feedback and Support
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're continuously working to improve the accessibility of our platform. If you encounter any accessibility barriers or have suggestions for improvement, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:accessibility@quickspin.io"
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              Report Accessibility Issue
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>This statement was prepared based on WCAG 2.1 guidelines and Section 508 requirements.</p>
        </div>
      </div>
    </div>
  )
}