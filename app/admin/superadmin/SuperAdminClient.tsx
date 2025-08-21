"use client"
import { useState } from "react"
import {
  useAllVillages,
  useAllChokhlas,
  useCreateChokhla,
  useGetAllUserList,
  useToggleUserStatus,
  useRegisterUser,
} from "@/data-hooks/mutation-query/useQueryAndMutation"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import { LogOut, Home, Building2, BarChart3, Users, User, Menu } from "lucide-react"
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

// Import components
import VillageManagement from "@/components/superadmin/village-management"
import ChokhlaManagement from "@/components/superadmin/chokhla-management"
import UserManagement from "@/components/superadmin/user-management"
import StatisticsView from "@/components/superadmin/statistics-view"
import ProfileView from "@/components/superadmin/profile-view"
import AddChokhlaForm from "@/components/superadmin/add-chokhla-form"
import SuccessModal from "@/components/superadmin/success-modal"
import ErrorModal from "@/components/superadmin/error-modal"
import AddUserForm from "@/components/superadmin/add-user-form"

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

interface SuperAdminClientProps {
  session: any
}

export default function SuperAdminClient({ session }: SuperAdminClientProps) {
  const [activeTab, setActiveTab] = useState("village")
  const [openChokhlaModal, setOpenChokhlaModal] = useState(false)
  const [openAddUserModal, setOpenAddUserModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

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
  const { mutate: registerUser, isLoading: creatingUser, isError, error } = useRegisterUser()
  const { mutate, isLoading: loading } = useToggleUserStatus()
  const { data: userData } = useSession()

  const handleChokhlaSubmit = (formData: any) => {
    setIsSubmitting(true)
    createChokhla(formData, {
      onSuccess: (data) => {
        const { chokhla, user } = data
        setCreatedData({
          chokhlaId: chokhla.id,
          userId: user.id,
          password: formData.password,
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

  const handleUserSubmit = (formData: any) => {
    registerUser(formData, {
      onSuccess: (data) => {
        if (!data?.userId) {
          setErrorMessage("सर्वर से उपयोगकर्ता जानकारी प्राप्त नहीं हुई")
          setShowErrorModal(true)
          return
        }

        setCreatedData({
          chokhlaId: formData.choklaId,
          userId: data.userId,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
          role: formData.globalRole,
        })

        setOpenAddUserModal(false)
        setShowSuccessModal(true)
      },
      onError: (error: any) => {
        console.error("Registration error:", error)
        setErrorMessage(error?.message || "उपयोगकर्ता पंजीकरण में त्रुटि हुई")
        setShowErrorModal(true)
      },
    })
  }

  const handleToggleActive = (userId: string, current: boolean) => {
    const action = current ? "deactivate" : "activate"

    const confirmToggle = window.confirm(`Are you sure you want to ${action} this user?`)
    if (!confirmToggle) return

    mutate(userId, {
      onSuccess: (data) => {
        window.alert(data?.message || `User successfully ${action}d.`)
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.error || error.message || "Something went wrong"
        window.alert(`Error: ${errorMessage}`)
      },
    })
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false)
    signOut({ callbackUrl: "/login" })
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false)
  }

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
    setMobileMenuOpen(false)
  }

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
            onAddUser={() => setOpenAddUserModal(true)}
            users={users || []}
            isLoading={usersLoading}
            error={usersError || loading ? "डेटा लोड करने में त्रुटि" : null}
            onToggleActive={handleToggleActive}
          />
        )
      case "profile":
        return <ProfileView userData={userData} />
      default:
        return null
    }
  }

  const getCurrentTabLabel = () => {
    const currentTab = SIDEBAR_TABS.find((tab) => tab.key === activeTab)
    return currentTab?.label || "सुपर एडमिन पैनल"
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
                            <h2 className="text-white font-bold text-lg">पंचाल समाज</h2>
                            <p className="text-orange-100 text-sm">सुपर एडमिन पैनल</p>
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
                  <span className="hidden md:inline">पंचाल समाज 14 चोखरा - सुपर एडमिन</span>
                  <span className="md:hidden">{getCurrentTabLabel()}</span>
                </h1>
                <p className="text-orange-100 text-xs sm:text-sm truncate">स्वागत है, {userData?.user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
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
      <AddChokhlaForm
        isOpen={openChokhlaModal}
        onClose={() => setOpenChokhlaModal(false)}
        onSubmit={handleChokhlaSubmit}
        isSubmitting={isSubmitting}
      />

      <AddUserForm
        isOpen={openAddUserModal}
        onClose={() => setOpenAddUserModal(false)}
        onSubmit={handleUserSubmit}
        isSubmitting={creatingUser}
        chokhlaList={chokhlas || []}
        villages={villages?.data || []}
      />

      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} data={createdData} />

      <ErrorModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} message={errorMessage} />
    </div>
  )
}
