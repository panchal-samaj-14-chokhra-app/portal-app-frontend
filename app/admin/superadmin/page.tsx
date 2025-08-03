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
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import components
import NavigationSidebar from "@/components/superadmin/navigation-sidebar"
import VillageManagement from "@/components/superadmin/village-management"
import ChokhlaManagement from "@/components/superadmin/chokhla-management"
import UserManagement from "@/components/superadmin/user-management"
import StatisticsView from "@/components/superadmin/statistics-view"
import ProfileView from "@/components/superadmin/profile-view"
import AddChokhlaForm from "@/components/superadmin/add-chokhla-form"
import SuccessModal from "@/components/superadmin/success-modal"
import ErrorModal from "@/components/superadmin/error-modal"

const TABS = [
  { key: "village", label: "गांव प्रबंधन" },
  { key: "chokhla", label: "चौकला प्रबंधन" },
  { key: "statics", label: "आँकड़े" },
  { key: "user", label: "यूज़र प्रबंधन" },
  { key: "profile", label: "सुपर एडमिन प्रोफ़ाइल" },
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
        setErrorMessage(error?.message || "चौकला जोड़ने में त्रुटि हुई")
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
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/main-logo.png"
              alt="Panchal Samaj Logo"
              width={44}
              height={44}
              className="rounded-full shadow-lg ring-2 ring-white/20"
            />
            <span className="text-xl md:text-2xl font-bold text-white drop-shadow-sm">पंचाल समाज 14 चोखरा</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              लॉगआउट
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <NavigationSidebar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        <section className="flex-1 min-w-0">{renderActiveTab()}</section>
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
