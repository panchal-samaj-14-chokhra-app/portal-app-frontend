"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  HelpCircle,
  MessageCircle,
  FileText,
  Users,
  Settings,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Separator } from "@/components/ui/separator/separator"
import { Badge } from "@/components/ui/badge/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion/accordion"

export default function HelpPage() {
  const contactInfo = {
    adminName: "मुकेश पंचाल",
    email: "admin@panchalsamaj.org",
    phone: "+91-9876543210",
    address: "123, Village Services Office, Main Road, District Name, State, India",
  }

  const faqData = [
    {
      question: "मैं अपना पासवर्ड कैसे रीसेट करूं?",
      answer:
        "लॉगिन पेज पर 'पासवर्ड भूल गए?' लिंक पर क्लिक करें और अपना ईमेल पता दर्ज करें। आपको पासवर्ड रीसेट करने के लिए एक लिंक भेजा जाएगा।",
    },
    {
      question: "नया परिवार कैसे पंजीकृत करें?",
      answer: "डैशबोर्ड से 'परिवार पंजीकरण' सेक्शन में जाएं, 'नया परिवार जोड़ें' बटन पर क्लिक करें और सभी आवश्यक जानकारी भरें।",
    },
    {
      question: "सदस्य की जानकारी कैसे अपडेट करें?",
      answer: "सदस्य प्रबंधन सेक्शन में जाएं, संबंधित सदस्य को खोजें और 'संपादित करें' बटन पर क्लिक करके जानकारी अपडेट करें।",
    },
    {
      question: "डेटा एक्सपोर्ट कैसे करें?",
      answer:
        "रिपोर्ट सेक्शन में जाएं, अपनी आवश्यक रिपोर्ट चुनें और 'एक्सपोर्ट' बटन पर क्लिक करें। आप Excel या PDF फॉर्मेट में डेटा डाउनलोड कर सकते हैं।",
    },
    {
      question: "सिस्टम में कोई समस्या आने पर क्या करें?",
      answer:
        "तकनीकी समस्याओं के लिए नीचे दिए गए संपर्क विवरण का उपयोग करके सहायता टीम से संपर्क करें। समस्या का विस्तृत विवरण प्रदान करें।",
    },
    {
      question: "डेटा की सुरक्षा कैसे सुनिश्चित की जाती है?",
      answer:
        "हमारा सिस्टम उच्च स्तरीय एन्क्रिप्शन और सुरक्षा प्रोटोकॉल का उपयोग करता है। सभी डेटा सुरक्षित सर्वर पर संग्रहीत किया जाता है।",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={60}
                height={60}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">सहायता और समर्थन</h1>
                <p className="text-orange-100 text-sm md:text-lg">पंचाल समाज 14 चोखरा - जनगणना पोर्टल</p>
              </div>
            </div>
            <Link href="/login">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस जाएं
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Contact Information */}
          <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-700 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2" />
                संपर्क जानकारी
              </CardTitle>
              <CardDescription>सहायता के लिए नीचे दिए गए विवरण का उपयोग करें</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">एडमिन नाम</p>
                      <p className="text-lg font-semibold text-orange-700">{contactInfo.adminName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">ईमेल</p>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-lg font-semibold text-blue-600 hover:underline"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">फोन नंबर</p>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-lg font-semibold text-green-600 hover:underline"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">संगठन का पता</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{contactInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-700">सहायता समय</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">सोमवार - शुक्रवार</p>
                    <p className="text-gray-600">सुबह 9:00 - शाम 6:00</p>
                  </div>
                  <div>
                    <p className="font-medium">शनिवार</p>
                    <p className="text-gray-600">सुबह 10:00 - दोपहर 2:00</p>
                  </div>
                </div>
                <Badge variant="outline" className="mt-2 border-orange-300 text-orange-700">
                  रविवार बंद
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-700 flex items-center">
                <HelpCircle className="w-6 h-6 mr-2" />
                अक्सर पूछे जाने वाले प्रश्न
              </CardTitle>
              <CardDescription>सामान्य प्रश्नों के उत्तर यहां देखें</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:text-blue-600">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-green-700 mb-2">उपयोगकर्ता गाइड</h3>
                <p className="text-sm text-green-600 mb-4">विस्तृत उपयोग निर्देश</p>
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  डाउनलोड करें
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-purple-700 mb-2">तकनीकी सहायता</h3>
                <p className="text-sm text-purple-600 mb-4">सिस्टम संबंधी समस्याएं</p>
                <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                  संपर्क करें
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-red-700 mb-2">सुरक्षा नीति</h3>
                <p className="text-sm text-red-600 mb-4">डेटा सुरक्षा जानकारी</p>
                <Button size="sm" className="bg-red-500 hover:bg-red-600">
                  पढ़ें
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                लॉगिन पेज पर वापस जाएं
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-orange-100">© 2025 पंचाल समाज 14 चोखरा डिजिटल जनगणना। सभी अधिकार सुरक्षित।</p>
        </div>
      </footer>
    </div>
  )
}
