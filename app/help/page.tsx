"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HelpCircle, Search, Users, Home, Settings, FileText, Phone, Mail, MessageCircle } from "lucide-react"

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: HelpCircle,
    items: [
      {
        question: "How do I log into the system?",
        answer:
          "Use your assigned username and password to log in through the login page. If you forgot your credentials, contact your administrator.",
      },
      {
        question: "What is my role in the system?",
        answer:
          "Your role determines what features you can access. Common roles include Village Admin, Chokhla Admin, and Super Admin.",
      },
      {
        question: "How do I navigate the dashboard?",
        answer:
          "Use the navigation menu on the left side to access different sections. The main dashboard shows an overview of your assigned area.",
      },
    ],
  },
  {
    id: "family-management",
    title: "Family Management",
    icon: Users,
    items: [
      {
        question: "How do I add a new family?",
        answer:
          'Go to your village page and click "Add Family". Fill in the family head information and add family members one by one.',
      },
      {
        question: "How do I edit family information?",
        answer:
          'Navigate to the family detail page and click "Edit Family". You can modify family information and member details.',
      },
      {
        question: "How do I add new members to an existing family?",
        answer:
          'On the family detail page, click "Add Member" and fill in the member information including their relationship to the family head.',
      },
      {
        question: "Can I delete a family record?",
        answer:
          "Only authorized administrators can delete family records. Contact your supervisor if a family record needs to be removed.",
      },
    ],
  },
  {
    id: "village-management",
    title: "Village Management",
    icon: Home,
    items: [
      {
        question: "How do I view village statistics?",
        answer:
          "The village detail page shows comprehensive statistics including total families, members, and demographic breakdowns.",
      },
      {
        question: "How do I search for families in my village?",
        answer: "Use the search bar on the village page to find families by name, address, or other criteria.",
      },
      {
        question: "How do I generate village reports?",
        answer:
          "Go to the Reports section and select your village to generate various statistical and demographic reports.",
      },
    ],
  },
  {
    id: "data-entry",
    title: "Data Entry",
    icon: FileText,
    items: [
      {
        question: "What information is required for each family member?",
        answer:
          "Required information includes name, age, gender, relationship to head, occupation, education level, and marital status.",
      },
      {
        question: "How do I handle data validation errors?",
        answer:
          "The system will highlight fields with errors in red. Hover over the error message to see what needs to be corrected.",
      },
      {
        question: "Can I save partially completed forms?",
        answer: "Yes, the system auto-saves your progress. You can return to complete forms later from your dashboard.",
      },
    ],
  },
  {
    id: "technical-issues",
    title: "Technical Issues",
    icon: Settings,
    items: [
      {
        question: "The page is loading slowly. What should I do?",
        answer:
          "Check your internet connection. If the problem persists, try refreshing the page or clearing your browser cache.",
      },
      {
        question: "I'm getting an error message. How do I resolve it?",
        answer:
          "Note down the exact error message and contact technical support. Include details about what you were doing when the error occurred.",
      },
      {
        question: "Can I use the system on my mobile phone?",
        answer:
          "Yes, the system is mobile-responsive. However, for the best experience, we recommend using a desktop or tablet.",
      },
    ],
  },
]

const contactInfo = {
  phone: "+91 98765 43210",
  email: "support@panchalsamaj.org",
  hours: "Monday - Friday, 9:00 AM - 6:00 PM",
}

export default function HelpPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to common questions and get help with using the census portal
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search for help topics..." className="flex-1" />
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-medium">Family Management</h3>
                <p className="text-sm text-muted-foreground">Learn how to manage families</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-medium">Data Entry Guide</h3>
                <p className="text-sm text-muted-foreground">Tips for accurate data entry</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-orange-500" />
              <div>
                <h3 className="font-medium">Technical Support</h3>
                <p className="text-sm text-muted-foreground">Resolve technical issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {helpCategories.slice(0, 3).map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.title}
                  <Badge variant="secondary">{category.items.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {category.items.map((item, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`}>
                      <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          {helpCategories.slice(3).map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.title}
                  <Badge variant="secondary">{category.items.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {category.items.map((item, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`}>
                      <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for? Get in touch with our support team.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contactInfo.email}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Support Hours:</strong> {contactInfo.hours}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
