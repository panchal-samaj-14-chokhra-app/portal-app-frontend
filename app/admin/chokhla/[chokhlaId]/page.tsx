"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { LogOut, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import custom components
import { NavigationSidebar } from "@/components/chokhla/navigation-sidebar"
import { VillageManagement } from "@/components/chokhla/village-management"
import { ProfileManagement } from "@/components/chokhla/profile-management"
import { StatisticsView } from "@/components/chokhla/statistics-view"
import { ReportsView } from "@/components/chokhla/reports-view"
import { SuccessModal } from "@/components/chokhla/success-modal"
import { ErrorModal } from "@/components/chokhla/error-modal"

// Import hooks
import {
  useCreateVillage,
  useChokhlaDetails,
  useUpdateChokhla,
  useGetAllVillageswithChokhlaID,
} from "@/data-hooks/mutation-query/useQueryAndMutation"

function Chokhla() {
  const { data: session } = useSession()
  const router = useRouter()
  const chokhlaId = useParams().chokhlaId as string

  // State management
  const [activeTab, setActiveTab] = useState("village")
  const [open, setOpen] = useState(false)
  const [editProfile, setEditProfile] = useState(false)
  const [profileForm, setProfileForm] = useState<any>(null)
  const [successData, setSuccessData] = useState<null | any>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showErrorModal, setShowErrorModal] = useState(false)

  // API hooks
  const { data: villages, isLoading } = useGetAllVillageswithChokhlaID(chokhlaId)
  const { data: chokhla, isLoading: isChokhlaLoading, error: chokhlaError } = useChokhlaDetails(chokhlaId)
  const { mutate: updateChokhla, isLoading: isUpdatingChokhla } = useUpdateChokhla(chokhlaId)
  const { mutate: createVillage, isLoading: isCreating } = useCreateVillage()

  // Form setup
  const form = useForm({
    mode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      villageMemberName: "",
      mobileNumber: "",
      age: "",
      email: "",
      tehsil: "",
      district: "",
      state: "",
      isVillageHaveSchool: false,
      isVillageHavePrimaryHealthCare: false,
      isVillageHaveCommunityHall: false,
      longitude: "",
      latitude: "",
      password: "",
      repeatPassword: "",
    },
  })

  // Computed values
  const userType = useMemo(() => session?.user?.role, [session?.user?.role])

  // Effects
  useEffect(() => {
    if (chokhla && !editProfile) {
      setProfileForm({
        name: chokhla.name || "",
        adhyaksh: chokhla.adhyaksh || "",
        contactNumber: chokhla.contactNumber || "",
        state: chokhla.state || "",
        district: chokhla.district || "",
        villageName: chokhla.villageName || "",
      })
    }
  }, [chokhla, editProfile])

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => setShowSuccessModal(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessModal])

  // Event handlers
  const handleBack = () => router.back()
  const handleLogout = () => signOut({ callbackUrl: "/login" })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
  }

  const handleProfileSave = () => {
    updateChokhla(profileForm, {
      onSuccess: () => setEditProfile(false),
    })
  }

  const handleVillageView = (villageId: string) => {
    router.push(`/admin/village/${villageId}?chakolaId=${chokhlaId}`)
  }

  const onSubmit = (data: any) => {
    const plainPassword = data.password
    createVillage(
      {
        ...data,
        age: data.age ? Number(data.age) : null,
        longitude: data.longitude ? Number(data.longitude) : null,
        latitude: data.latitude ? Number(data.latitude) : null,
        chakola: { connect: { id: chokhlaId } },
      },
      {
        onSuccess: (res) => {
          setSuccessData({ ...res, password: plainPassword })
          setShowSuccessModal(true)
          setOpen(false)
          form.reset()
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || error?.message || "कुछ गलत हो गया। कृपया पुनः प्रयास करें।"
          setErrorMessage(message)
          setShowErrorModal(true)
        },
      },
    )
  }

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "village":
        return (
          <VillageManagement
            villages={villages}
            isLoading={isLoading}
            userType={userType}
            chokhlaId={chokhlaId}
            onVillageView={handleVillageView}
            open={open}
            onOpenChange={setOpen}
            form={form}
            onSubmit={onSubmit}
            isCreating={isCreating}
          />
        )
      case "statics":
        return <StatisticsView />
      case "reports":
        return <ReportsView />
      case "profile":
        return (
          <ProfileManagement
            chokhla={chokhla}
            isChokhlaLoading={isChokhlaLoading}
            chokhlaError={chokhlaError}
            editProfile={editProfile}
            setEditProfile={setEditProfile}
            profileForm={profileForm}
            handleProfileChange={handleProfileChange}
            handleProfileSave={handleProfileSave}
            isUpdatingChokhla={isUpdatingChokhla}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Enhanced Navbar */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src="/images/main-logo.png"
                  alt="Panchal Samaj Logo"
                  width={48}
                  height={48}
                  className="rounded-full shadow-lg ring-2 ring-white/20"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">पंचाल समाज 14 चोखरा</h1>
                <p className="text-orange-100 text-sm">चौकला प्रबंधन पैनल</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {userType === "SUPER_ADMIN" && (
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                  onClick={handleBack}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  वापस
                </Button>
              )}
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                लॉगआउट
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <NavigationSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <section className="flex-1 min-w-0">{renderTabContent()}</section>
        </div>
      </main>

      {/* Modals */}
      <SuccessModal open={showSuccessModal} onOpenChange={setShowSuccessModal} successData={successData} />
      <ErrorModal open={showErrorModal} onOpenChange={setShowErrorModal} errorMessage={errorMessage} />
    </div>
  )
}

export default Chokhla
