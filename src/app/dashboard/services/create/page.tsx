"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { useRequireAuth } from "@/lib/auth-utils"
import { useCreateServiceMutation } from "@/lib/redux/api/servicesApi"
import { ServiceType } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Server,
  Database,
  MessageSquare,
  Search,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Cpu,
  HardDrive,
  MemoryStick
} from "lucide-react"
import { useRouter } from "next/navigation"

const serviceTypes = [
  {
    id: "redis",
    name: "Redis",
    description: "In-memory data structure store",
    icon: Database,
    features: ["Caching", "Session Storage", "Pub/Sub", "High Performance"]
  },
  {
    id: "rabbitmq",
    name: "RabbitMQ",
    description: "Message broker and queue system",
    icon: MessageSquare,
    features: ["Message Queuing", "Reliable Delivery", "Routing", "Clustering"]
  },
  {
    id: "elasticsearch",
    name: "Elasticsearch",
    description: "Distributed search and analytics engine",
    icon: Search,
    features: ["Full-text Search", "Analytics", "Real-time", "Scalable"]
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    description: "Advanced open-source relational database",
    icon: Database,
    features: ["ACID Compliance", "JSON Support", "Extensions", "Replication"]
  },
  {
    id: "mongodb",
    name: "MongoDB",
    description: "Document-oriented NoSQL database",
    icon: Database,
    features: ["Document Model", "Scalability", "Flexible Schema", "Aggregation"]
  }
]

const environments = [
  { id: "development", name: "Development", description: "For development and testing" },
  { id: "staging", name: "Staging", description: "For pre-production testing" },
  { id: "production", name: "Production", description: "For live applications" }
]

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small projects",
    price: "$9/month",
    specs: { cpu: "1 vCPU", memory: "1GB", storage: "10GB SSD" }
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing applications",
    price: "$29/month",
    specs: { cpu: "2 vCPUs", memory: "4GB", storage: "50GB SSD" }
  },
  {
    id: "business",
    name: "Business",
    description: "For high-performance needs",
    price: "$99/month",
    specs: { cpu: "4 vCPUs", memory: "8GB", storage: "200GB SSD" }
  }
]

export default function CreateServicePage() {
  const { isLoading: authLoading } = useRequireAuth()
  const router = useRouter()
  const [createService, { isLoading }] = useCreateServiceMutation()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    environment: "",
    plan: "starter",
    description: "",
    region: "us-east-1",
    backupEnabled: true,
    monitoringEnabled: true,
    highAvailability: false,
    configuration: {
      ram: 1,
      cpu: 1,
      persistence: true
    }
  })

  const totalSteps = 4

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.type) {
          toast({
            title: "Validation error",
            description: "Please select a service type",
            variant: "destructive",
          })
          return false
        }
        if (!formData.name.trim()) {
          toast({
            title: "Validation error",
            description: "Please enter a service name",
            variant: "destructive",
          })
          return false
        }
        return true
      case 2:
        if (!formData.environment) {
          toast({
            title: "Validation error",
            description: "Please select an environment",
            variant: "destructive",
          })
          return false
        }
        return true
      case 3:
        if (!formData.region) {
          toast({
            title: "Validation error",
            description: "Please select a region",
            variant: "destructive",
          })
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const serviceData = {
        name: formData.name,
        type: formData.type as ServiceType,
        region: formData.region,
        configuration: formData.configuration
      }
      await createService(serviceData).unwrap()
      toast({
        title: "Service created",
        description: "Your service has been created successfully and is being deployed.",
      })
      router.push("/dashboard/services")
    } catch (error) {
      toast({
        title: "Failed to create service",
        description: error instanceof Error ? error.message : "Could not create the service. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.type && formData.name
      case 2:
        return formData.environment && formData.plan
      case 3:
        return formData.region
      default:
        return true
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Choose Service Type"
      case 2:
        return "Configure Environment"
      case 3:
        return "Select Region & Features"
      case 4:
        return "Review & Deploy"
      default:
        return "Configuration"
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label>Service Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter a name for your service"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Service Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {serviceTypes.map((serviceType) => (
                  <div
                    key={serviceType.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${formData.type === serviceType.id
                        ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(157,78,221,0.3)] scale-[1.02]'
                        : 'border-white/10 hover:border-primary/50 hover:bg-white/5 hover:-translate-y-1'
                      }`}
                    onClick={() => setFormData({ ...formData, type: serviceType.id })}
                  >
                    <div className="flex items-center space-x-3">
                      <serviceType.icon className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium text-foreground">{serviceType.name}</h3>
                        <p className="text-sm text-muted-foreground">{serviceType.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Environment</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {environments.map((env) => (
                  <div
                    key={env.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${formData.environment === env.id
                        ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(157,78,221,0.3)] scale-[1.02]'
                        : 'border-white/10 hover:border-primary/50 hover:bg-white/5 hover:-translate-y-1'
                      }`}
                    onClick={() => setFormData({ ...formData, environment: env.id })}
                  >
                    <h3 className="font-medium text-foreground">{env.name}</h3>
                    <p className="text-sm text-muted-foreground">{env.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Plan</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${formData.plan === plan.id
                        ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(157,78,221,0.3)] scale-[1.02]'
                        : 'border-white/10 hover:border-primary/50 hover:bg-white/5 hover:-translate-y-1'
                      }`}
                    onClick={() => setFormData({ ...formData, plan: plan.id })}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-foreground">{plan.name}</h3>
                      <span className="text-primary font-medium">{plan.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                    <div className="text-sm text-muted-foreground">
                      <div>CPU: {plan.specs.cpu}</div>
                      <div>Memory: {plan.specs.memory}</div>
                      <div>Storage: {plan.specs.storage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Region</Label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full p-2 border rounded-md mt-1"
              >
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">Europe (Ireland)</option>
                <option value="eu-central-1">Europe (Frankfurt)</option>
                <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
              </select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Backup Enabled</Label>
                <input
                  type="checkbox"
                  checked={formData.backupEnabled}
                  onChange={(e) => setFormData({ ...formData, backupEnabled: e.target.checked })}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Monitoring Enabled</Label>
                <input
                  type="checkbox"
                  checked={formData.monitoringEnabled}
                  onChange={(e) => setFormData({ ...formData, monitoringEnabled: e.target.checked })}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>High Availability</Label>
                <input
                  type="checkbox"
                  checked={formData.highAvailability}
                  onChange={(e) => setFormData({ ...formData, highAvailability: e.target.checked })}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <h3 className="font-medium mb-3 text-foreground">Service Summary</h3>
              <div className="space-y-2 text-sm text-foreground">
                <div><strong>Name:</strong> {formData.name}</div>
                <div><strong>Type:</strong> {formData.type}</div>
                <div><strong>Environment:</strong> {formData.environment}</div>
                <div><strong>Plan:</strong> {formData.plan}</div>
                <div><strong>Region:</strong> {formData.region}</div>
                <div><strong>Description:</strong> {formData.description || 'None'}</div>
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <h3 className="font-medium mb-3 text-foreground">Features</h3>
              <div className="space-y-2 text-sm text-foreground">
                <div><strong>Backup:</strong> {formData.backupEnabled ? 'Enabled' : 'Disabled'}</div>
                <div><strong>Monitoring:</strong> {formData.monitoringEnabled ? 'Enabled' : 'Disabled'}</div>
                <div><strong>High Availability:</strong> {formData.highAvailability ? 'Enabled' : 'Disabled'}</div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Create New Service</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Deploy a new service in just a few steps
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Service Configuration</CardTitle>
                <CardDescription>
                  Step {currentStep} of {totalSteps}: {getStepTitle()}
                </CardDescription>
              </div>
              <Badge variant="outline">Step {currentStep}/{totalSteps}</Badge>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="mt-4" />
          </CardHeader>
          <CardContent>
            {renderStepContent()}

            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext} disabled={!isStepValid()} className="w-full sm:w-auto">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? "Creating..." : "Create Service"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}