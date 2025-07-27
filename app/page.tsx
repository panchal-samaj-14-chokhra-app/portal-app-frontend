"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Home,
  MapPin,
  BarChart3,
  Shield,
  Database,
  ArrowRight,
  CheckCircle,
  Globe,
  Smartphone,
  Lock,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin/superadmin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === "authenticated") {
    return null // Will redirect
  }

  const features = [
    {
      icon: Users,
      title: "Family Management",
      description: "Comprehensive family and member registration system",
    },
    {
      icon: Home,
      title: "Village Administration",
      description: "Organize and manage villages within chokhlas",
    },
    {
      icon: Database,
      title: "Data Security",
      description: "Secure data storage with backup and recovery",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Generate insights and statistical reports",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Access from any device, anywhere",
    },
    {
      icon: Shield,
      title: "Role-based Access",
      description: "Secure access control for different user roles",
    },
  ]

  const stats = [
    { label: "Registered Families", value: "1,250+", icon: Users },
    { label: "Community Members", value: "4,800+", icon: Users },
    { label: "Villages Covered", value: "85+", icon: Home },
    { label: "Chokhlas Managed", value: "14", icon: MapPin },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/images/main-logo.png" alt="Panchal Samaj Logo" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Panchal Samaj</h1>
              <p className="text-xs text-gray-600">Census Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/help">
              <Button variant="ghost" size="sm">
                Help
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="mb-4">
              <Globe className="w-3 h-3 mr-1" />
              Digital Census Management
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Panchal Samaj
              <span className="block text-primary">Census Portal</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive digital platform for managing community census data, family records, and member
              information for the Panchal Samaj community.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage community census data efficiently and securely
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Our Platform?</h2>
              <p className="text-lg text-gray-600">
                Built specifically for the Panchal Samaj community with modern technology and user-friendly design.
              </p>

              <div className="space-y-4">
                {[
                  "Easy family and member registration",
                  "Secure data management and privacy",
                  "Real-time updates and synchronization",
                  "Comprehensive reporting and analytics",
                  "Mobile-friendly responsive design",
                  "Role-based access control",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Lock className="h-6 w-6 text-primary" />
                    <span className="font-semibold">Secure & Reliable</span>
                  </div>
                  <p className="text-gray-600">
                    Your community data is protected with enterprise-grade security and regular backups to ensure data
                    integrity.
                  </p>
                  <div className="pt-4">
                    <Link href="/login">
                      <Button className="w-full">
                        Start Managing Your Community
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <Image src="/images/main-logo.png" alt="Panchal Samaj Logo" fill className="object-contain" />
                </div>
                <span className="text-xl font-bold">Panchal Samaj</span>
              </div>
              <p className="text-gray-400">Digital census management for the Panchal Samaj community.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/login" className="block text-gray-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/help" className="block text-gray-400 hover:text-white transition-colors">
                  Help & Support
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>support@panchalsamaj.org</p>
                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Panchal Samaj Census Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
