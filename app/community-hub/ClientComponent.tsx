import { ChokhlaSummary } from '@/lib/server-api/getChokhlas'
type Props = {
    chokhlas: ChokhlaSummary[]
}

import Image from "next/image"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card/card"
import { Users, MapPin, MapPinCheck, Contact, FileUser, MapPinPlus, FolderSync } from "lucide-react"
import ReloadButton from './ReloadClientButtonComponent'
import ChokhlaClientComponent from './ChokhlaCardComponent'

export default function ClientComponent({ chokhlas }: Props) {
    const totalFamilies = chokhlas.reduce((acc, c) => acc + c.familyCount, 0)
    const totalMembers = chokhlas.reduce((acc, c) => acc + c.memberCount, 0)
    const totalVillages = chokhlas.reduce((acc, c) => acc + c.villageCount, 0)
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
                    <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-[#B30000] mb-3 xs:mb-4 sm:mb-5 md:mb-6 leading-tight px-2">
                        जय श्री मां त्रिपुरा सुंदरी
                    </h2>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                        Know More About
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">

                        <span className="font-semibold text-orange-600"> Panchal Samaj 14 Chokhra ( पंचाल समाज 14 चोखरा)</span>

                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12 max-w-6xl mx-auto pb-10">
                    <Card className="bg-white/80 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-4 sm:p-6 text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-orange-600  rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <MapPinPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-2"> कुल चोखरे </h3>
                            <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-2">14</h3>

                        </CardContent>
                    </Card>
                    <Card className="bg-white/80 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-4 sm:p-6 text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <MapPinCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-2">कुल गांव</h3>
                            <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-2">{totalVillages}</h3>

                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-4 sm:p-6 text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Contact className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-2">कुल परिवार</h3>

                            <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-2">{totalFamilies}</h3>

                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
                        <CardContent className="p-4 sm:p-6 text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <FileUser className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-2">कुल परिवारो के सदस्य</h3>
                            <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-2">   {totalMembers}</h3>


                        </CardContent>
                    </Card>
                </div>

                {/* Main Card */}
                <div >
                    <Card className="">
                        <CardHeader className="text-center pb-4 sm:pb-6">
                            <div className="flex justify-center mb-4">
                                {/* <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg">
                                    <Database className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div> */}
                            </div>
                            <CardTitle className="text-xl sm:text-2xl md:text-3xl text-orange-700 mb-2">
                                Our Digitally Connected Demography (हमारी डिजिटल रूप से जुड़ी जनसंख्या की जानकारी)
                            </CardTitle>
                            <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                Explore, connect, and manage village and family data for the 2025 census.
                                <br className="hidden sm:block" />
                                <span className="text-orange-700 font-medium">Secure • Efficient • Comprehensive</span>
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6 sm:space-y-8">
                            {/* Features Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ChokhlaClientComponent chokhlas={chokhlas} />
                            </div>


                            {/* CTA Section */}
                            <div className="text-center space-y-4">

                                <ReloadButton />

                                <p className="text-xs sm:text-sm text-gray-500">
                                    🔄 ऊपर दिए गए बटन पर क्लिक करें और नवीनतम डेटा प्राप्त करें (Click the above button to fetch the latest data)
                                </p>

                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Info Cards */}

            </main >

            {/* Footer */}
            < footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 sm:py-8 mt-12 sm:mt-16" >
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
            </footer >
        </div >
    )
}
