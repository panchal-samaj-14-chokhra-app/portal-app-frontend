import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"
import { Users, MapPin, BarChart3, Shield, Smartphone, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900 hindi-text">पंचाल समाज जनगणना पोर्टल</h1>
                <p className="text-sm text-gray-600 hindi-text">14 छकड़ा समुदाय प्रबंधन प्रणाली</p>
              </div>
            </div>
            <Button asChild size="lg">
              <Link href="/login">
                <span className="hindi-text">लॉगिन करें</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4 hindi-text">
            डिजिटल इंडिया पहल
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 hindi-text">
            समुदाय का डिजिटल
            <span className="gradient-bg bg-clip-text text-transparent"> भविष्य</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto hindi-text">
            पंचाल समाज के 14 छकड़ा समुदाय के लिए एक व्यापक जनगणना और प्रबंधन प्रणाली। परिवारों का पंजीकरण, सदस्य प्रबंधन, और सामुदायिक
            विकास के लिए डेटा-संचालित समाधान।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href="/dashboard">
                <BarChart3 className="mr-2 h-5 w-5" />
                <span className="hindi-text">डैशबोर्ड देखें</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
              <Link href="/login">
                <Users className="mr-2 h-5 w-5" />
                <span className="hindi-text">पंजीकरण करें</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 hindi-text">मुख्य विशेषताएं</h3>
            <p className="text-gray-600 max-w-2xl mx-auto hindi-text">
              आधुनिक तकनीक के साथ पारंपरिक समुदायिक मूल्यों को जोड़ने वाला एक संपूर्ण समाधान
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="hindi-text">परिवार प्रबंधन</CardTitle>
                <CardDescription className="hindi-text">
                  संपूर्ण परिवारिक जानकारी का डिजिटल रिकॉर्ड और प्रबंधन
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 hindi-text">
                  <li>• सदस्य पंजीकरण और अपडेट</li>
                  <li>• पारिवारिक संबंधों का ट्रैकिंग</li>
                  <li>• सरकारी योजनाओं की जानकारी</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="hindi-text">गांव प्रशासन</CardTitle>
                <CardDescription className="hindi-text">14 छकड़ा गांवों का केंद्रीकृत प्रबंधन और निगरानी</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 hindi-text">
                  <li>• गांव-वार डेटा विश्लेषण</li>
                  <li>• जनसंख्या रिपोर्ट</li>
                  <li>• विकास परियोजना ट्रैकिंग</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="hindi-text">डेटा एनालिटिक्स</CardTitle>
                <CardDescription className="hindi-text">समुदायिक विकास के लिए डेटा-संचालित अंतर्दृष्टि</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 hindi-text">
                  <li>• जनसांख्यिकीय विश्लेषण</li>
                  <li>• शिक्षा और स्वास्थ्य रिपोर्ट</li>
                  <li>• आर्थिक सूचकांक</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="hindi-text">सुरक्षा और गोपनीयता</CardTitle>
                <CardDescription className="hindi-text">उच्च स्तरीय डेटा सुरक्षा और गोपनीयता सुरक्षा</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 hindi-text">
                  <li>• एन्क्रिप्टेड डेटा स्टोरेज</li>
                  <li>• भूमिका-आधारित पहुंच</li>
                  <li>• ऑडिट ट्रेल</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="hindi-text">मोबाइल फ्रेंडली</CardTitle>
                <CardDescription className="hindi-text">सभी डिवाइस पर उपयोग के लिए अनुकूलित डिजाइन</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 hindi-text">
                  <li>• रेस्पॉन्सिव डिजाइन</li>
                  <li>• ऑफलाइन सपोर्ट</li>
                  <li>• तेज़ लोडिंग</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="hindi-text">बहुभाषी सपोर्ट</CardTitle>
                <CardDescription className="hindi-text">हिंदी और अंग्रेजी में उपलब्ध इंटरफेस</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 hindi-text">
                  <li>• देवनागरी स्क्रिप्ट सपोर्ट</li>
                  <li>• स्थानीय भाषा में रिपोर्ट</li>
                  <li>• सांस्कृतिक संदर्भ</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 gradient-bg text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4 hindi-text">समुदायिक आंकड़े</h3>
            <p className="text-white/80 max-w-2xl mx-auto hindi-text">पंचाल समाज के 14 छकड़ा समुदाय की वर्तमान स्थिति</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">14</div>
              <div className="text-white/80 hindi-text">छकड़ा गांव</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-white/80 hindi-text">पंजीकृत परिवार</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">12,000+</div>
              <div className="text-white/80 hindi-text">समुदायिक सदस्य</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-white/80 hindi-text">डिजिटलीकरण</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl hindi-text">आज ही शुरू करें</CardTitle>
              <CardDescription className="text-lg hindi-text">
                अपने परिवार का पंजीकरण करें और समुदायिक विकास में योगदान दें
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8 py-3">
                  <Link href="/login">
                    <Users className="mr-2 h-5 w-5" />
                    <span className="hindi-text">अभी पंजीकरण करें</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                  <Link href="/dashboard">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    <span className="hindi-text">डेमो देखें</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/images/main-logo.png"
                  alt="Panchal Samaj Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="font-bold hindi-text">पंचाल समाज</span>
              </div>
              <p className="text-gray-400 text-sm hindi-text">14 छकड़ा समुदाय का डिजिटल भविष्य</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 hindi-text">त्वरित लिंक</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/dashboard" className="hover:text-white hindi-text">
                    डैशबोर्ड
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white hindi-text">
                    लॉगिन
                  </Link>
                </li>
                <li>
                  <Link href="/routes/admin" className="hover:text-white hindi-text">
                    एडमिन पैनल
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 hindi-text">सहायता</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white hindi-text">
                    उपयोगकर्ता गाइड
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hindi-text">
                    तकनीकी सहायता
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hindi-text">
                    संपर्क करें
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 hindi-text">संपर्क जानकारी</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="hindi-text">ईमेल: info@panchalsamaj.org</p>
                <p className="hindi-text">फोन: +91 98765 43210</p>
                <p className="hindi-text">पता: राजस्थान, भारत</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p className="hindi-text">© 2024 पंचाल समाज जनगणना पोर्टल। सभी अधिकार सुरक्षित।</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
