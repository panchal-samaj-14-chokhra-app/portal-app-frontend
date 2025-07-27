"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  HelpCircle,
  Users,
  Home,
  Phone,
  Mail,
  BookOpen,
  Video,
  MessageCircle,
  Download,
  Settings,
  Shield,
  Database,
} from "lucide-react"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I add a new family to a village?",
      answer:
        "Navigate to the village page, click on 'Add Family' button, fill in the family details including head of family information, and add family members. Make sure to provide accurate contact information.",
    },
    {
      question: "How can I edit family member information?",
      answer:
        "Go to the family detail page, click on the 'Edit' button next to the member you want to modify, update the information in the form, and save the changes.",
    },
    {
      question: "What is a Chokhla and how is it different from a Village?",
      answer:
        "A Chokhla is a larger administrative unit that contains multiple villages. It's used for organizing and managing villages in a hierarchical structure within the Panchal Samaj community.",
    },
    {
      question: "How do I search for a specific family or member?",
      answer:
        "Use the search functionality available on village pages and family listings. You can search by family name, head of family name, or member names.",
    },
    {
      question: "Can I export family data?",
      answer:
        "Yes, you can export family and member data in various formats. Look for the export options in the village or family management sections.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Click on 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email to reset your password.",
    },
    {
      question: "What permissions do I need to manage families?",
      answer:
        "Your permissions depend on your role. Village administrators can manage families in their assigned villages, while super administrators have access to all villages and chokhlas.",
    },
    {
      question: "How do I add a new village to a chokhla?",
      answer:
        "Super administrators can add new villages by going to the chokhla management section, selecting the appropriate chokhla, and using the 'Add Village' option.",
    },
  ]

  const quickActions = [
    {
      title: "Add New Family",
      description: "Learn how to register a new family",
      icon: Users,
      badge: "Common",
    },
    {
      title: "Manage Villages",
      description: "Village administration guide",
      icon: Home,
      badge: "Admin",
    },
    {
      title: "User Permissions",
      description: "Understanding roles and access",
      icon: Shield,
      badge: "Important",
    },
    {
      title: "Data Export",
      description: "Export and backup data",
      icon: Download,
      badge: "Feature",
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to common questions and get help with using the Panchal Samaj Census Portal
        </p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Quick Help Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <action.icon className="h-8 w-8 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {action.badge}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Need additional help? Our support team is here to assist you.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">support@panchalsamaj.org</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
            </div>
            <Button className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Send Support Email
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Watch step-by-step video guides for common tasks.</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Video className="h-4 w-4 mr-2" />
                Getting Started Guide
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="h-4 w-4 mr-2" />
                Family Management
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Database className="h-4 w-4 mr-2" />
                Data Export & Import
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="font-medium text-muted-foreground">Version</label>
              <p>v1.0.0</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">Last Updated</label>
              <p>January 2024</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">Status</label>
              <Badge variant="default">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
