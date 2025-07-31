"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "./components/sidebar"
import { StatsCards } from "./components/stats-cards"
import { ChartsSection } from "./components/charts-section"
import { ModulesGrid } from "./components/modules-grid"
import { ArrowLeft, Home } from "lucide-react"
import { NavigationBreadcrumb } from "./components/navigation-breadcrumb"
import { FloatingNav } from "./components/floating-nav"
import { FamilyRegistrationForm } from "./components/family-registration-form"
import { VillageManagement } from "./components/village-management"

export default function Dashboard() {
  const searchParams = useSearchParams()
  const chokhra = searchParams.get("chokhra") || "लोहारिया"
  const [activeModule, setActiveModule] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="flex">
        <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />

        <main className="flex-1 ml-64">
          {/* Header */}
          <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Image src="/images/main-logo.png" alt="Logo" width={50} height={50} className="rounded-full" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">{chokhra} चोखरा</h1>
                    <p className="text-orange-100">डैशबोर्ड</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-300 text-white hover:bg-orange-400 bg-orange-500/20"
                    onClick={() => (window.location.href = "/")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    होम पेज
                  </Button>
                  <Badge className="bg-green-500 text-white">ऑनलाइन</Badge>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-6">
            <NavigationBreadcrumb
              currentModule={activeModule}
              onNavigate={setActiveModule}
              onHome={() => (window.location.href = "/")}
            />

            {activeModule === "dashboard" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-gray-800">डैशबोर्ड ओवरव्यू</h2>
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600">रिपोर्ट डाउनलोड करें</Button>
                </div>

                <StatsCards />
                <ChartsSection />
                <ModulesGrid setActiveModule={setActiveModule} />
              </div>
            )}

            {activeModule !== "dashboard" && (
              <>
                {activeModule === "families" && (
                  <FamilyRegistrationForm chokhra={chokhra} onBack={() => setActiveModule("dashboard")} />
                )}

                {activeModule === "villages" && (
                  <VillageManagement chokhra={chokhra} onBack={() => setActiveModule("dashboard")} />
                )}

                {activeModule !== "dashboard" && activeModule !== "families" && activeModule !== "villages" && (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-orange-100 to-white p-8 rounded-lg border border-orange-200 max-w-2xl mx-auto">
                      <h3 className="text-2xl font-bold text-orange-700 mb-4">{getModuleTitle(activeModule)}</h3>
                      <p className="text-gray-600 mb-6">यह मॉड्यूल विकसित किया जा रहा है। जल्द ही उपलब्ध होगा।</p>
                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          onClick={() => setActiveModule("dashboard")}
                          className="bg-gradient-to-r from-orange-500 to-orange-600"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          डैशबोर्ड पर वापस जाएं
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => (window.location.href = "/")}
                          className="border-orange-200 text-orange-600 hover:bg-orange-50"
                        >
                          <Home className="w-4 h-4 mr-2" />
                          होम पेज
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <FloatingNav
            onHome={() => (window.location.href = "/")}
            onDashboard={() => setActiveModule("dashboard")}
            onRefresh={() => window.location.reload()}
          />
        </main>
      </div>
    </div>
  )
}

function getModuleTitle(module: string) {
  const titles: Record<string, string> = {
    chokhras: "चोखरा प्रबंधन",
    villages: "गांव प्रबंधन",
    families: "परिवार प्रबंधन",
    members: "सदस्य प्रबंधन",
    admins: "एडमिन प्रबंधन",
    schemes: "योजना प्रबंधन",
  }
  return titles[module] || "मॉड्यूल"
}
