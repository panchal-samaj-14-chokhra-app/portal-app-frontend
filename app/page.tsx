"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Users, BarChart3, Shield, Globe } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/images/main-logo.png"
              alt="Panchal Samaj Logo"
              width={100}
              height={100}
              className="rounded-full shadow-lg mb-4"
            />
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">पंचाल समाज 14 चोखरा</h1>
            <p className="text-orange-100 text-lg md:text-xl">डिजिटल जनगणना पोर्टल 2025</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">आधुनिक जनगणना प्रबंधन प्रणाली</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            पंचाल समाज के सभी 14 चोखरा की संपूर्ण जनगणना और डेटा प्रबंधन के लिए एक एकीकृत डिजिटल प्लेटफॉर्म
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-lg px-8 py-3">
                लॉगिन करें
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/help">
              <Button
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-50 text-lg px-8 py-3 bg-transparent"
              >
                सहायता प्राप्त करें
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-blue-700">परिवार प्रबंधन</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                सभी परिवारों की संपूर्ण जानकारी का डिजिटल रिकॉर्ड और प्रबंधन
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-green-700">डेटा विश्लेषण</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">जनसंख्या आंकड़ों का विस्तृत विश्लेषण और रिपोर्ट जेनरेशन</CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-purple-700">सुरक्षित प्रणाली</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">उच्च स्तरीय सुरक्षा के साथ डेटा संरक्षण और गोपनीयता</CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-orange-700">व्यापक कवरेज</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">सभी 14 चोखरा और उनके गांवों का एकीकृत प्रबंधन</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold mb-2">14</p>
                <p className="text-orange-100">चोखरा</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2">168</p>
                <p className="text-orange-100">गांव</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2">25,000+</p>
                <p className="text-orange-100">परिवार</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2">1,28,000+</p>
                <p className="text-orange-100">जनसंख्या</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-orange-100 mb-4">© 2025 पंचाल समाज 14 चोखरा डिजिटल जनगणना। सभी अधिकार सुरक्षित।</p>
          <div className="flex justify-center space-x-6">
            <Link href="/help" className="text-orange-100 hover:text-white hover:underline">
              सहायता
            </Link>
            <Link href="/login" className="text-orange-100 hover:text-white hover:underline">
              लॉगिन
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
