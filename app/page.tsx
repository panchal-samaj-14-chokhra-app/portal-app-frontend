import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button/button"
import { Users, MapPin, Heart, Star, ChevronRight, Phone } from "lucide-react"

export default function CommunityHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">

      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 shadow-xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/images/main-logo.png"
              alt="पंचाल समाज लोगो"
              width={64}
              height={64}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white/40 shadow-lg"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">
                पंचाल समाज चौदह चौखरा
              </h1>
              <p className="text-orange-100 text-xs sm:text-sm mt-0.5">एकता · सेवा · प्रगति</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-14 sm:py-20 text-center px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            हमारे समाज में आपका स्वागत है
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            पंचाल समाज<br />
            <span className="text-orange-600">चौदह चौखरा</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            हमारी समाज की जड़ें, हमारी पहचान। एक मजबूत और संगठित समाज के निर्माण में सहभागी बनें।
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/community-hub">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg text-sm sm:text-base">
                समाज की जानकारी देखें
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full sm:w-auto border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold px-8 py-3 rounded-xl text-sm sm:text-base">
                <Users className="w-4 h-4 mr-2" />
                सदस्य लॉगिन
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 sm:py-14 px-4 bg-white/60">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-center text-xl sm:text-2xl font-bold text-gray-800 mb-8">हमारे मूल्य</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Heart, color: "from-rose-400 to-rose-500", title: "एकता", desc: "चौदह चौखरों के सभी परिवार एक सूत्र में बंधे हुए हैं। मिलकर हम सशक्त हैं।" },
              { icon: Users, color: "from-orange-400 to-orange-500", title: "सेवा", desc: "समाज के हर सदस्य की सहायता और उत्थान हमारा प्रथम कर्तव्य है।" },
              { icon: Star, color: "from-amber-400 to-amber-500", title: "प्रगति", desc: "शिक्षा, रोजगार और सामाजिक विकास में हम एक-दूसरे के साथ कदम-से-कदम मिलाकर चलते हैं।" },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 text-center hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">{title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chaukhra list */}
      <section className="py-10 sm:py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-xl sm:text-2xl font-bold text-gray-800 mb-2">चौदह चौखरे</h3>
          <p className="text-center text-gray-500 text-sm mb-8">हमारे समाज के चौदह प्रमुख चौखरे</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              "चौखरा १", "चौखरा २", "चौखरा ३", "चौखरा ४",
              "चौखरा ५", "चौखरा ६", "चौखरा ७", "चौखरा ८",
              "चौखरा ९", "चौखरा १०", "चौखरा ११", "चौखरा १२",
              "चौखरा १३", "चौखरा १४",
            ].map((name) => (
              <div key={name} className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-orange-100 hover:border-orange-300 transition-colors">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="text-sm text-gray-700 font-medium">{name}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">सटीक नाम एवं विवरण के लिए समाज कार्यालय से संपर्क करें</p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-10 sm:py-14 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
          <Image
            src="/images/main-logo.png"
            alt="लोगो"
            width={56}
            height={56}
            className="w-14 h-14 rounded-full mx-auto mb-4 border-2 border-white/30"
          />
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">समाज पोर्टल में लॉगिन करें</h3>
          <p className="text-orange-100 text-sm sm:text-base mb-6">
            परिवार पंजीकरण, जनगणना डेटा और समाज की पूरी जानकारी के लिए अपने खाते में प्रवेश करें।
          </p>
          <Link href="/login">
            <Button className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-10 py-3 rounded-xl shadow-lg text-base">
              लॉगिन करें
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-4 mt-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/images/main-logo.png"
              alt="लोगो"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-semibold text-white text-sm">पंचाल समाज चौदह चौखरा</span>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} पंचाल समाज चौदह चौखरा। सर्वाधिकार सुरक्षित।
          </p>
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <Link href="/community-hub" className="hover:text-orange-400 transition-colors">समाज जानकारी</Link>
            <span>·</span>
            <Link href="/login" className="hover:text-orange-400 transition-colors">लॉगिन</Link>
            <span>·</span>
            <Link href="/help" className="hover:text-orange-400 transition-colors">सहायता</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
