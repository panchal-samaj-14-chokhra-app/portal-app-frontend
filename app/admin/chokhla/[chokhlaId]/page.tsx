"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { LogOut, ArrowLeft, Home, BarChart3, FileText, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Import custom components
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

const SIDEBAR_TABS = [
  { key: "village", label: "गांव प्रबंधन", icon: Home, shortLabel: "गांव" },
  { key: "statics", label: "आँकड़े", icon: BarChart3, shortLabel: "आँकड़े" },
  { key: "reports", label: "रिपोर्ट्स", icon: FileText, shortLabel: "रिपोर्ट" },
  { key: "profile", label: "चोखरा प्रोफ़ाइल", icon: User, shortLabel: "प्रोफ़ाइल" },
]

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // API hooks
  const { data: villages, isLoading } = useGetAllVillageswithChokhlaID(chokhlaId)
  const { data: chokhla, isLoading: isChokhlaLoading, error: chokhlaError } = useChokhlaDetails(chokhlaId)
  const { mutate: updateChokhla, isLoading: isUpdatingChokhla } = useUpdateChokhla(chokhlaId)
  const { mutate: createVillage, isLoading: isCreating } = useCreateVillage()

  // Form setup with validation
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
  const handleLogoutClick = () => setShowLogoutConfirm(true)
  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false)
    signOut({ callbackUrl: "/login" })
  }
  const handleLogoutCancel = () => setShowLogoutConfirm(false)

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

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
    setMobileMenuOpen(false)
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
  const renderActiveTab = () => {
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
        return <StatisticsView chokhla={chokhla} />
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

  const getCurrentTabLabel = () => {
    const currentTab = SIDEBAR_TABS.find((tab) => tab.key === activeTab)
    return currentTab?.label || "चोखरा प्रबंधन"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden bg-white/10 border-white/20 text-white hover:bg-white/20 flex-shrink-0"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-white p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b bg-gradient-to-r from-orange-500 to-orange-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Image
                            src="/images/main-logo.png"
                            alt="Panchal Samaj Logo"
                            width={40}
                            height={40}
                            className="rounded-full shadow-lg"
                          />
                          <div>
                            <h2 className="text-white font-bold text-lg">चोखरा प्रबंधन</h2>
                            <p className="text-orange-100 text-sm">{chokhla?.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <nav className="flex-1 p-4">
                      <div className="space-y-2">
                        {SIDEBAR_TABS.map((tab) => {
                          const Icon = tab.icon
                          return (
                            <Button
                              key={tab.key}
                              variant={activeTab === tab.key ? "default" : "ghost"}
                              onClick={() => handleTabChange(tab.key)}
                              className={`w-full justify-start text-left font-medium transition-all duration-200 ${
                                activeTab === tab.key
                                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-800"
                              }`}
                            >
                              <Icon className="w-5 h-5 mr-3" />
                              {tab.label}
                            </Button>
                          )
                        })}
                      </div>
                    </nav>
                    <div className="p-4 border-t">
                      <Button
                        onClick={handleLogoutClick}
                        variant="outline"
                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        लॉगआउट
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={40}
                height={40}
                className="sm:w-[50px] sm:h-[50px] rounded-full shadow-lg flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
                  <span className="hidden md:inline">{chokhla?.name || "चोखरा प्रबंधन"}</span>
                  <span className="md:hidden">{getCurrentTabLabel()}</span>
                </h1>
                <p className="text-orange-100 text-xs sm:text-sm truncate">स्वागत है, {session?.user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {userType === "SUPER_ADMIN" && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hidden md:flex text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  वापस जॉए
                </Button>
              )}
              <Button
                onClick={handleLogoutClick}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hidden md:flex text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                लॉगआउट
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Tab Navigation */}
      <div className="hidden md:block bg-white border-b shadow-sm">
        <div className="w-full px-4 lg:px-6">
          <Card className="bg-white/90 backdrop-blur-sm shadow-none border-0 rounded-none">
            <CardContent className="p-0">
              <nav className="flex overflow-x-auto">
                {SIDEBAR_TABS.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <Button
                      key={tab.key}
                      variant="ghost"
                      onClick={() => handleTabChange(tab.key)}
                      className={`flex-shrink-0 min-w-[140px] justify-center text-sm font-semibold transition-all duration-200 px-6 py-4 rounded-none border-b-2 ${
                        activeTab === tab.key
                          ? "border-orange-500 text-orange-600 bg-orange-50"
                          : "border-transparent text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </Button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="w-full max-w-full">{renderActiveTab()}</div>
      </main>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="sm:max-w-[420px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-700">
              <LogOut className="w-5 h-5" />
              लॉगआउट की पुष्टि करें
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              क्या आप वाकई लॉगआउट करना चाहते हैं? आपको दोबारा लॉगिन करना होगा।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleLogoutCancel} className="bg-gray-100 hover:bg-gray-200">
              रद्द करें
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutConfirm} className="bg-red-600 hover:bg-red-700 text-white">
              हां, लॉगआउट करें
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modals */}
      <SuccessModal open={showSuccessModal} onOpenChange={setShowSuccessModal} successData={successData} />
      <ErrorModal open={showErrorModal} onOpenChange={setShowErrorModal} errorMessage={errorMessage} />
    </div>
  )
}

export default Chokhla
