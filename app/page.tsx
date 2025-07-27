import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={60}
                height={60}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">पंचाल समाज 14 चोखरा</h1>
                <p className="text-orange-100 text-sm md:text-lg">डिजिटल जनगणना 2025</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex flex-col items-center">
        <Card className="max-w-xl w-full bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-orange-700">Welcome to the Village Hub</CardTitle>
            <CardDescription>
              This application is a digital census and management platform for Panchal Samaj 14 Chokhra. <br />
              <span className="text-orange-700 font-medium">Explore, connect, and manage village and family data for the 2025 census.</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <ul className="text-left list-disc pl-6 text-orange-800 mb-4">
              <li>View and manage all registered villages and families</li>
              <li>Administer census data securely and efficiently</li>
              <li>Support for Super Admin, Village, and Chokhla members</li>
              <li>Access help and support resources</li>
            </ul>
            <Link href="/login">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-lg py-6">
                लॉगिन करें (Login)
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-orange-100">© 2025 पंचाल समाज 14 चोखरा डिजिटल जनगणना। सभी अधिकार सुरक्षित।</p>
        </div>
      </footer>
    </div>
  );
}
