"use client"
import { useState } from "react"
import {
  useAllVillages,
  useAllChokhlas,
  useCreateChokhla,
  useGetAllUserList,
} from "@/data-hooks/mutation-query/useQueryAndMutation"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import { LogOut, Home, Building2, BarChart3, Users, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Import components
import VillageManagement from "@/components/superadmin/village-management"
import ChokhlaManagement from "@/components/superadmin/chokhla-management"
import UserManagement from "@/components/superadmin/user-management"
import StatisticsView from "@/components/superadmin/statistics-view"
import ProfileView from "@/components/superadmin/profile-view"
import AddChokhlaForm from "@/components/superadmin/add-chokhla-form"
import SuccessModal from "@/components/superadmin/success-modal"
import ErrorModal from "@/components/superadmin/error-modal"

const SIDEBAR_TABS = [
  { key: "village", label: "गांव प्रबंधन", icon: Home, shortLabel: "गांव" },
  { key: "chokhla", label: "चोखरा प्रबंधन", icon: Building2, shortLabel: "चोखरा" },
  { key: "statics", label: "आँकड़े", icon: BarChart3, shortLabel: "आँकड़े" },
  { key: "user", label: "यूज़र प्रबंधन", icon: Users, shortLabel: "यूज़र" },
  { key: "profile", label: "सुपर एडमिन प्रोफ़ाइल", icon: User, shortLabel: "प्रोफ़ाइल" },
]

interface CreatedData {
  chokhlaId: string
  userId: string
  email: string
  fullName: string
  role: string
  password: string
}

function SuperAdmin() {
  const [activeTab, setActiveTab] = useState("village")
  const [openChokhlaModal, setOpenChokhlaModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [createdData, setCreatedData] = useState<CreatedData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Data hooks
  const { data: villages, isLoading: isVillagesLoading } = useAllVillages()
  const { data: chokhlas, isLoading: isChokhlasLoading } = useAllChokhlas()
  const { data: users, isLoading: usersLoading, error: usersError } = useGetAllUserList()
  const { mutate: createChokhla } = useCreateChokhla()

  const router = useRouter()
  const { data: userData } = useSession()

  const handleChokhlaSubmit = (formData: any) => {
    setIsSubmitting(true)
    createChokhla(formData, {
      onSuccess: (data) => {
        const { chokhla, user } = data
        setCreatedData({
          chokhlaId: chokhla.id,
          userId: user.id,
          password: user.passwordHash,
          email: user.email,
          fullName: user.fullName,
          role: user.globalRole,
        })
        setOpenChokhlaModal(false)
        setShowSuccessModal(true)
        setIsSubmitting(false)
      },
      onError: (error: any) => {
        setErrorMessage(error?.message || "चोखरा जोड़ने में त्रुटि हुई")
        setShowErrorModal(true)
        setIsSubmitting(false)
      },
    })
  }

  const handleToggleActive = (userId: string, current: boolean) => {
    console.log("Toggle user active status:", userId, current)
    // Implement toggle functionality here
  }

  const handleLogout = () => signOut({ callbackUrl: "/login" })

  const renderActiveTab = () => {
    switch (activeTab) {
      case "village":
        return <VillageManagement villages={villages?.data || []} isLoading={isVillagesLoading} />
      case "chokhla":
        return (
          <ChokhlaManagement
            chokhlas={chokhlas || []}
            isLoading={isChokhlasLoading}
            onAddChokhla={() => setOpenChokhlaModal(true)}
          />
        )
      case "statics":
        return <StatisticsView />
      case "user":
        return (
          <UserManagement
            users={users || []}
            isLoading={usersLoading}
            error={usersError ? "डेटा लोड करने में त्रुटि" : null}
            onToggleActive={handleToggleActive}
          />
        )
      case "profile":
        return <ProfileView userData={userData} />
      default:
        return null
    }
  }

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
                width={50}
                height={50}
                className="rounded-full shadow-lg"
              />
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-white truncate">पंचाल समाज 14 चोखरा - सुपर एडमिन</h1>
                <p className="text-orange-100 text-sm truncate">स्वागत है, {userData?.user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                लॉगआउट
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 mb-6 lg:mb-0">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50 p-4">
              <nav className="flex overflow-x-auto lg:flex-col gap-2 pb-2 lg:pb-0 scrollbar-hide">
                {SIDEBAR_TABS.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <Button
                      key={tab.key}
                      variant={activeTab === tab.key ? "default" : "ghost"}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-shrink-0 min-w-[100px] lg:w-full justify-center lg:justify-start text-sm font-semibold transition-all duration-200 px-3 py-2 ${
                        activeTab === tab.key
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                          : "text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2 lg:mr-3 flex-shrink-0" />
                      <span className="truncate">
                        <span className="lg:hidden">{tab.shortLabel}</span>
                        <span className="hidden lg:inline">{tab.label}</span>
                      </span>
                    </Button>
                  )
                })}
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <section className="flex-1 min-w-0">{renderActiveTab()}</section>
        </div>
      </main>

      {/* Modals */}
      <AddChokhlaForm
        isOpen={openChokhlaModal}
        onClose={() => setOpenChokhlaModal(false)}
        onSubmit={handleChokhlaSubmit}
        isSubmitting={isSubmitting}
      />

      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} data={createdData} />

      <ErrorModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} message={errorMessage} />
    </div>
  )
}

export default SuperAdmin
