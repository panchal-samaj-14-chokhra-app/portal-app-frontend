"use client"

import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin, HelpCircle, ArrowLeft, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion/accordion"

export default function HelpPage() {
  const contactInfo = {
    adminName: "राजेश पंचाल",
    email: "admin@panchalsamaj.org",
    phone: "+91-9876543210",
    address: "123, Village Services Office, Main Road, District Name, State, India",
  }

  const faqs = [
    {
      question: "मैं एक नया परिवार कैसे पंजीकृत करूं?",
      answer:
        "परिवार अनुभाग पर जाएं और 'नया परिवार जोड़ें' पर क्लिक करें। सभी आवश्यक जानकारी भरें जैसे कि परिवार मुखिया का नाम, पता, फोन नंबर, और गांव का विवरण। फॉर्म को पूरा भरने के बाद 'सहेजें' बटन पर क्लिक करें।",
    },
    {
      question: "मैं सदस्य की जानकारी कैसे अपडेट कर सकता हूं?",
      answer:
        "सदस्य अनुभाग पर जाएं, जिस सदस्य को आप अपडेट करना चाहते हैं उसे खोजें। सदस्य के नाम पर क्लिक करें और फिर 'संपादित करें' बटन पर क्लिक करें। आवश्यक बदलाव करने के बाद 'सहेजें' पर क्लिक करें।",
    },
    {
      question: "मैं रिपोर्ट कैसे जेनरेट करूं?",
      answer:
        "रिपोर्ट अनुभाग पर जाएं जहां आप विभिन्न प्रकार की रिपोर्ट जेनरेट कर सकते हैं। आप परिवार सूची, सदस्य आंकड़े, गांव सारांश, और जनसंख्या रिपोर्ट बना सकते हैं। रिपोर्ट का प्रकार चुनें और 'जेनरेट करें' पर क्लिक करें।",
    },
    {
      question: "यदि मैं अपना पासवर्ड भूल गया तो क्या करूं?",
      answer:
        "लॉगिन पेज पर 'पासवर्ड भूल गए?' लिंक पर क्लिक करें। अपना ईमेल पता दर्ज करें और 'रीसेट लिंक भेजें' पर क्लिक करें। आपको ईमेल पर पासवर्ड रीसेट करने का लिंक मिलेगा।",
    },
    {
      question: "डेटा कितना सुरक्षित है?",
      answer:
        "हमारा सिस्टम उच्च स्तर की सुरक्षा प्रदान करता है। सभी डेटा एन्क्रिप्टेड है और केवल अधिकृत व्यक्ति ही इसे एक्सेस कर सकते हैं। हम नियमित रूप से सिस्टम की सुरक्षा की जांच करते हैं।",
    },
    {
      question: "मैं डेटा को एक्सपोर्ट कैसे करूं?",
      answer:
        "रिपोर्ट सेक्शन में जाकर आप डेटा को PDF या Excel फॉर्मेट में एक्सपोर्ट कर सकते हैं। 'एक्सपोर्ट' बटन पर क्लिक करें और अपना पसंदीदा फॉर्मेट चुनें।",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-4">
            <Image
              src="/images/main-logo.png"
              alt="Panchal Samaj Logo"
              width={60}
              height={60}
              className="rounded-full shadow-lg"
            />
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white">सहायता और समर्थन</h1>
              <p className="text-orange-100 text-sm md:text-lg">जनगणना पोर्टल के साथ सहायता प्राप्त करें</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Contact Information */}
          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-700 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2" />
                संपर्क जानकारी
              </CardTitle>
              <CardDescription>सहायता के लिए हमसे संपर्क करें</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">एडमिन नाम</p>
                      <p className="text-lg font-semibold text-blue-700">{contactInfo.adminName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">ईमेल</p>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-lg font-semibold text-green-700 hover:underline"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">फोन नंबर</p>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-lg font-semibold text-orange-700 hover:underline"
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
                      <p className="font-medium text-gray-700">कार्यालय का पता</p>
                      <p className="text-sm text-purple-700 leading-relaxed">{contactInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-700">अक्सर पूछे जाने वाले प्रश्न</CardTitle>
              <CardDescription>सामान्य प्रश्नों के उत्तर यहां देखें</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-orange-200 rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left hover:no-underline hover:text-orange-600">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Technical Support */}
          <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-green-700">तकनीकी सहायता</CardTitle>
              <CardDescription>तकनीकी समस्याओं के लिए सहायता</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                तकनीकी समस्याओं या पोर्टल के उपयोग के बारे में प्रश्नों के लिए, कृपया ऊपर दी गई संपर्क जानकारी का उपयोग करके हमारी
                सहायता टीम से संपर्क करें। हम सोमवार से शुक्रवार सुबह 9 बजे से शाम 6 बजे तक उपलब्ध हैं।
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(`mailto:${contactInfo.email}`, "_blank")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  ईमेल भेजें
                </Button>
                <Button
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                  onClick={() => window.open(`tel:${contactInfo.phone}`, "_blank")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  कॉल करें
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                मुख्य पेज पर वापस जाएं
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                लॉगिन करें
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
