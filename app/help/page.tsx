import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MessageCircle, FileText, Users, Home } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions and get support for the Panchal Samaj Census Portal
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Get direct help from our support team</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Mail className="h-4 w-4 mr-2" />
                support@panchalsamaj.org
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Phone className="h-4 w-4 mr-2" />
                +91 98765 43210
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Learn how to use the system effectively</p>
            <Button className="w-full">View User Guide</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Training
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Schedule training sessions for your team</p>
            <Button className="w-full">Request Training</Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">How do I add a new family?</h3>
              <p className="text-gray-600">
                Navigate to your village page and click the "Add Family" button. Fill in the family head information and
                add all family members with their details.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">How do I edit family information?</h3>
              <p className="text-gray-600">
                Go to the family detail page and click the "Edit Family" button. You can modify family information and
                member details from there.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">What if I forgot my password?</h3>
              <p className="text-gray-600">
                Click on "Forgot Password" on the login page and follow the instructions to reset your password.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">How do I export data?</h3>
              <p className="text-gray-600">
                Data export functionality is available in the reports section. You can export family and member data in
                various formats.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Who can access the system?</h3>
              <p className="text-gray-600">
                Access is role-based. Super admins can manage everything, admins can manage their assigned areas, and
                users have limited access based on their permissions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back to Dashboard */}
      <div className="text-center">
        <Link href="/">
          <Button variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
