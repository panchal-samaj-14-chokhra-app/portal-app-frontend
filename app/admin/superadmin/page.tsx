"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { SuperAdminHeader } from "@/components/superadmin/superadmin-header"
import { SuperAdminSidebar } from "@/components/superadmin/superadmin-sidebar"
import { VillageManagement } from "@/components/superadmin/village-management"
import { ChokhlaManagement } from "@/components/superadmin/chokhla-management"
import { UserManagement } from "@/components/superadmin/user-management"
import { ProfileManagement } from "@/components/superadmin/profile-management"
import { StatisticsManagement } from "@/components/superadmin/statistics-management"
import { SuccessDialog } from "@/components/superadmin/success-dialog"
import { ErrorDialog } from "@/components/superadmin/error-dialog"
import type {
  SuperAdminProfile,
  Village,
  Chokhla,
  User,
  Statistics,
  ChokhlaFormData,
  ProfileFormData,
} from "@/components/superadmin/types"

export default function SuperAdminPage() {
  // State management
  const [activeTab, setActiveTab] = useState("statistics")
  const [profile, setProfile] = useState<SuperAdminProfile | null>(null)
  const [villages, setVillages] = useState<Village[]>([])
  const [choklas, setChoklas] = useState<Chokhla[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)

  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingVillages, setIsLoadingVillages] = useState(true)
  const [isLoadingChoklas, setIsLoadingChoklas] = useState(true)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(true)

  // Dialog states
  const [successDialog, setSuccessDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    details?: Record<string, any>
  }>({
    isOpen: false,
    title: "",
    message: "",
  })

  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onRetry?: () => void
  }>({
    isOpen: false,
    title: "",
    message: "",
  })

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/profile`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      setErrorDialog({
        isOpen: true,
        title: "प्रोफाइल लोड करने में त्रुटि",
        message: "प्रोफाइल की जानकारी लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: fetchProfile,
      })
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // Fetch villages data
  const fetchVillages = async () => {
    try {
      setIsLoadingVillages(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/villages`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setVillages(data)
    } catch (error) {
      console.error("Error fetching villages:", error)
      setErrorDialog({
        isOpen: true,
        title: "गांवों की सूची लोड करने में त्रुटि",
        message: "गांवों की जानकारी लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: fetchVillages,
      })
    } finally {
      setIsLoadingVillages(false)
    }
  }

  // Fetch choklas data
  const fetchChoklas = async () => {
    try {
      setIsLoadingChoklas(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/choklas`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setChoklas(data)
    } catch (error) {
      console.error("Error fetching choklas:", error)
      setErrorDialog({
        isOpen: true,
        title: "चोखला सूची लोड करने में त्रुटि",
        message: "चोखला की जानकारी लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: fetchChoklas,
      })
    } finally {
      setIsLoadingChoklas(false)
    }
  }

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/users`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      setErrorDialog({
        isOpen: true,
        title: "उपयोगकर्ता सूची लोड करने में त्रुटि",
        message: "उपयोगकर्ता की जानकारी लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: fetchUsers,
      })
    } finally {
      setIsLoadingUsers(false)
    }
  }

  // Fetch statistics data
  const fetchStatistics = async () => {
    try {
      setIsLoadingStatistics(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/statistics`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setStatistics(data)
    } catch (error) {
      console.error("Error fetching statistics:", error)
      setErrorDialog({
        isOpen: true,
        title: "आंकड़े लोड करने में त्रुटि",
        message: "आंकड़े लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: fetchStatistics,
      })
    } finally {
      setIsLoadingStatistics(false)
    }
  }

  // Handle chokhla creation
  const handleCreateChokhla = async (data: ChokhlaFormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/choklas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const newChokhla = await response.json()
      setChoklas((prev) => [...prev, newChokhla])

      setSuccessDialog({
        isOpen: true,
        title: "चोखला सफलतापूर्वक पंजीकृत हुआ",
        message: "नया चोखला खाता सफलतापूर्वक बनाया गया है।",
        details: {
          नाम: `${data.firstName} ${data.lastName}`,
          ईमेल: data.email,
          मोबाइल: data.mobileNumber,
          स्थान: `${data.district}, ${data.state}`,
        },
      })

      toast.success("चोखला सफलतापूर्वक पंजीकृत हुआ")
    } catch (error) {
      console.error("Error creating chokhla:", error)
      setErrorDialog({
        isOpen: true,
        title: "चोखला पंजीकरण में त्रुटि",
        message: error instanceof Error ? error.message : "चोखला पंजीकृत करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
      })
    }
  }

  // Handle profile update
  const handleUpdateProfile = async (data: ProfileFormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)

      setSuccessDialog({
        isOpen: true,
        title: "प्रोफाइल सफलतापूर्वक अपडेट हुई",
        message: "आपकी प्रोफाइल की जानकारी सफलतापूर्वक अपडेट हो गई है।",
        details: {
          नाम: `${data.firstName} ${data.lastName}`,
          ईमेल: data.email,
          मोबाइल: data.mobileNumber,
        },
      })

      toast.success("प्रोफाइल सफलतापूर्वक अपडेट हुई")
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrorDialog({
        isOpen: true,
        title: "प्रोफाइल अपडेट में त्रुटि",
        message: error instanceof Error ? error.message : "प्रोफाइल अपडेट करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
      })
    }
  }

  // Handle user status toggle
  const handleToggleUserStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/users/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, isActive } : user)))

      toast.success(`उपयोगकर्ता ${isActive ? "सक्रिय" : "निष्क्रिय"} किया गया`)
    } catch (error) {
      console.error("Error toggling user status:", error)
      toast.error("उपयोगकर्ता स्थिति बदलने में त्रुटि")
    }
  }

  // Handle chokhla status toggle
  const handleToggleChokhlaStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/choklas/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setChoklas((prev) => prev.map((chokhla) => (chokhla.id === id ? { ...chokhla, isActive } : chokhla)))

      toast.success(`चोखला ${isActive ? "सक्रिय" : "निष्क्रिय"} किया गया`)
    } catch (error) {
      console.error("Error toggling chokhla status:", error)
      toast.error("चोखला स्थिति बदलने में त्रुटि")
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Redirect to login page
      window.location.href = "/login"
    } catch (error) {
      console.error("Error logging out:", error)
      toast.error("लॉग आउट करने में त्रुटि")
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchProfile()
    fetchVillages()
    fetchChoklas()
    fetchUsers()
    fetchStatistics()
  }, [])

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "statistics":
        return <StatisticsManagement statistics={statistics} isLoading={isLoadingStatistics} />

      case "villages":
        return <VillageManagement villages={villages} isLoading={isLoadingVillages} onRefresh={fetchVillages} />

      case "choklas":
        return (
          <ChokhlaManagement
            choklas={choklas}
            isLoading={isLoadingChoklas}
            onRefresh={fetchChoklas}
            onCreateChokhla={handleCreateChokhla}
            onToggleStatus={handleToggleChokhlaStatus}
          />
        )

      case "users":
        return (
          <UserManagement
            users={users}
            isLoading={isLoadingUsers}
            onRefresh={fetchUsers}
            onToggleStatus={handleToggleUserStatus}
          />
        )

      case "profile":
        return (
          <ProfileManagement profile={profile} isLoading={isLoadingProfile} onUpdateProfile={handleUpdateProfile} />
        )

      default:
        return <StatisticsManagement statistics={statistics} isLoading={isLoadingStatistics} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SuperAdminHeader profile={profile} isLoading={isLoadingProfile} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <SuperAdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{renderContent()}</div>
        </div>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={successDialog.isOpen}
        onClose={() => setSuccessDialog({ ...successDialog, isOpen: false })}
        title={successDialog.title}
        message={successDialog.message}
        details={successDialog.details}
      />

      {/* Error Dialog */}
      <ErrorDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ ...errorDialog, isOpen: false })}
        title={errorDialog.title}
        message={errorDialog.message}
        onRetry={errorDialog.onRetry}
      />
    </div>
  )
}
