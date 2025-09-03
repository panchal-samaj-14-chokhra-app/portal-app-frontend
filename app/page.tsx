import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card/card"
import { Users, Shield, BarChart3, HelpCircle, ChevronRight, MapPin, Database } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 relative">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 sm:space-x-4 text-center">
              <div className="relative">
                <Image
                  src="/images/main-logo.png"
                  alt="Panchal Samaj Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-lg border-2 border-white/20"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="text-left">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                  पंचाल समाज 14 चोखरा
                </h1>
                <p className="text-orange-100 text-xs sm:text-sm md:text-lg font-medium">डिजिटल जनगणना 2025</p>
                <div className="flex items-center mt-1 text-orange-200">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-xs sm:text-sm">Digital Census Platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            Welcome to the Village Hub
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A comprehensive digital census and management platform designed for
            <span className="font-semibold text-orange-600"> Panchal Samaj 14 Chokhra</span>
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-white to-orange-50/50 border-orange-200 shadow-2xl backdrop-blur-sm">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg">
                  <Database className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl text-orange-700 mb-2">
                Digital Census Platform
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Explore, connect, and manage village and family data for the 2025 census.
                <br className="hidden sm:block" />
                <span className="text-orange-700 font-medium">Secure • Efficient • Comprehensive</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8">
              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-orange-100 shadow-sm">
                  <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Family Management</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Register and manage all family members with detailed information
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-orange-100 shadow-sm">
                  <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Secure Access</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Role-based access for Super Admin, Village, and Chokhla members
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-orange-100 shadow-sm">
                  <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Analytics & Reports</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Generate comprehensive reports and statistical analysis
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-orange-100 shadow-sm">
                  <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Support System</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Access help resources and technical support when needed
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl p-4 sm:p-6 border border-orange-200">
                <h3 className="font-bold text-base sm:text-lg text-orange-800 mb-3 sm:mb-4 text-center">
                  Platform Benefits
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center text-xs sm:text-sm text-orange-800">
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-orange-600 shrink-0" />
                    <span>Complete village and family data management system</span>
                  </li>
                  <li className="flex items-center text-xs sm:text-sm text-orange-800">
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-orange-600 shrink-0" />
                    <span>Secure authentication with role-based permissions</span>
                  </li>
                  <li className="flex items-center text-xs sm:text-sm text-orange-800">
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-orange-600 shrink-0" />
                    <span>Real-time data synchronization and backup</span>
                  </li>
                  <li className="flex items-center text-xs sm:text-sm text-orange-800">
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-orange-600 shrink-0" />
                    <span>Mobile-responsive design for all devices</span>
                  </li>
                </ul>
              </div>

              {/* CTA Section */}
              <div className="text-center space-y-4">
                <Link href="/community-hub" className="block">
                  <Button className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">

                    चोखरे की जनगणना की जानकारी देखें
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    लॉगिन करें (Login)
                  </Button>
                </Link>
                <p className="text-xs sm:text-sm text-gray-500">Secure access to your census dashboard</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 max-w-6xl mx-auto">
          <Card className="bg-white/80 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Database className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-2">Data Security</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Your data is protected with enterprise-grade security measures
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-2">Real-time Analytics</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Get instant insights with comprehensive reporting tools
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Get help whenever you need it with our dedicated support team
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 sm:py-8 mt-12 sm:mt-16">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold text-sm sm:text-base">पंचाल समाज 14 चोखरा</span>
            </div>
            <p className="text-orange-100 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              © 2025 पंचाल समाज 14 चोखरा डिजिटल जनगणना। सभी अधिकार सुरक्षित।
              <br className="hidden sm:block" />
              <span className="text-orange-200">Empowering communities through digital transformation</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-orange-200">
              <span>Secure Platform</span>
              <span>•</span>
              <span>Mobile Responsive</span>
              <span>•</span>
              <span>24/7 Available</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
