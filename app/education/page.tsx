"use client"

import { GraduationCap, BookOpen, School, Trophy, Users, Clock } from "lucide-react"
import PageHeader from "@/components/ui/PageHeader"

const COMING_SOON_FEATURES = [
  { icon: School,       title: "विद्यालय निर्देशिका",      desc: "समाज के सदस्यों के विद्यालय एवं शिक्षण संस्थान" },
  { icon: Trophy,       title: "मेधावी छात्र सम्मान",      desc: "बोर्ड परीक्षा में उत्कृष्ट प्रदर्शन करने वाले छात्र" },
  { icon: BookOpen,     title: "छात्रवृत्ति जानकारी",       desc: "सरकारी एवं समाज द्वारा दी जाने वाली छात्रवृत्तियां" },
  { icon: Users,        title: "शिक्षक परिचय",              desc: "समाज के प्रतिष्ठित शिक्षकों की जानकारी" },
  { icon: GraduationCap, title: "उच्च शिक्षा मार्गदर्शन",  desc: "कॉलेज, प्रवेश परीक्षा एवं करियर से संबंधित जानकारी" },
]

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-orange-50/30">
      <PageHeader
        title="शिक्षा पोर्टल"
        subtitle="Education Portal"
        icon={GraduationCap}
        backHref="/"
      />

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Coming Soon Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200 p-8 sm:p-12 text-center shadow-sm mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-500 shadow-lg mb-5">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <div className="inline-flex items-center gap-2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <Clock className="w-3.5 h-3.5" />
            जल्द आ रहा है
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mt-2">
            समाज शिक्षा पोर्टल
          </h1>
          <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            पंचाल समाज चौदह चौखरा के सभी शिक्षा संबंधी जानकारियां एक ही जगह। यह पोर्टल जल्द ही आपके लिए उपलब्ध होगा।
          </p>
        </div>

        {/* Features Preview */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700">आने वाली सुविधाएं</h2>
          <p className="text-sm text-gray-400">इस पोर्टल में ये सब शामिल होगा</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {COMING_SOON_FEATURES.map((f) => (
            <div key={f.title}
              className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-orange-100 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{f.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 rounded-2xl bg-white border border-orange-100 p-6 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            शिक्षा पोर्टल से संबंधित सुझाव देने के लिए संपर्क करें
          </p>
          <p className="mt-1 font-semibold text-orange-700 text-sm">समाज कार्यकारिणी</p>
        </div>
      </main>
    </div>
  )
}
