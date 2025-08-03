"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import type {
  SuperAdminUser,
  Village,
  Chokhla,
  SuperAdminStats,
  VillageFormData,
  ChokhlaFormData,
  UserFormData,
  ProfileFormData,
} from "../types"

interface DialogState {
  isOpen: boolean
  title: string
  message: string
  details?: Record<string, any>
  onRetry?: () => void
}

interface SuperAdminContextType {
  // State
  activeTab: string
  setActiveTab: (tab: string) => void

  // Data
  profile: SuperAdminUser | null
  villages: Village[]
  chokhlas: Chokhla[]
  users: SuperAdminUser[]
  stats: SuperAdminStats | null

  // Loading states
  isLoadingProfile: boolean
  isLoadingVillages: boolean
  isLoadingChokhlas: boolean
  isLoadingUsers: boolean
  isLoadingStats: boolean
  isSubmitting: boolean

  // Dialog states
  successDialog: DialogState
  errorDialog: DialogState
  setSuccessDialog: (dialog: DialogState) => void
  setErrorDialog: (dialog: DialogState) => void

  // Actions
  handleVillageSubmit: (data: VillageFormData) => Promise<void>
  handleChokhlaSubmit: (data: ChokhlaFormData) => Promise<void>
  handleUserSubmit: (data: UserFormData) => Promise<void>
  handleProfileSubmit: (data: ProfileFormData) => Promise<void>

  // Data fetching
  fetchProfile: () => Promise<void>
  fetchVillages: () => Promise<void>
  fetchChokhlas: () => Promise<void>
  fetchUsers: () => Promise<void>
  fetchStats: () => Promise<void>
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined)

export function useSuperAdmin() {
  const context = useContext(SuperAdminContext)
  if (context === undefined) {
    throw new Error("useSuperAdmin must be used within a SuperAdminProvider")
  }
  return context
}

interface SuperAdminProviderProps {
  children: ReactNode
}

export function SuperAdminProvider({ children }: SuperAdminProviderProps) {
  // State management
  const [activeTab, setActiveTab] = useState("dashboard")
  const [profile, setProfile] = useState<SuperAdminUser | null>(null)
  const [villages, setVillages] = useState<Village[]>([])
  const [chokhlas, setChokhlas] = useState<Chokhla[]>([])
  const [users, setUsers] = useState<SuperAdminUser[]>([])
  const [stats, setStats] = useState<SuperAdminStats | null>(null)

  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingVillages, setIsLoadingVillages] = useState(true)
  const [isLoadingChokhlas, setIsLoadingChokhlas] = useState(true)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dialog states
  const [successDialog, setSuccessDialog] = useState<DialogState>({
    isOpen: false,
    title: "",
    message: "",
  })

  const [errorDialog, setErrorDialog] = useState<DialogState>({
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

  // Fetch chokhlas data
  const fetchChokhlas = async () => {
    try {
      setIsLoadingChokhlas(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/chokhlas`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setChokhlas(data)
    } catch (error) {
      console.error("Error fetching chokhlas:", error)
      setErrorDialog({
        isOpen: true,
        title: "चोखला की सूची लोड करने में त्रुटि",
        message: "चोखला की जानकारी लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: fetchChokhlas,
      })
    } finally {
      setIsLoadingChokhlas(false)
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
        title: "उपयोगकर्ताओं की सूची लोड करने में त्रुटि",
        message: "उपयोगकर्ताओं की जानकारी लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: fetchUsers,
      })
    } finally {
      setIsLoadingUsers(false)
    }
  }

  // Fetch statistics data
  const fetchStats = async () => {
    try {
      setIsLoadingStats(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/statistics`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching statistics:", error)
      setErrorDialog({
        isOpen: true,
        title: "आंकड़े लोड करने में त्रुटि",
        message: "आंकड़ों की जानकारी लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: fetchStats,
      })
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Handle village form submission
  const handleVillageSubmit = async (data: VillageFormData) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/villages`, {
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

      const newVillage = await response.json()
      setVillages((prev) => [...prev, newVillage])

      setSuccessDialog({
        isOpen: true,
        title: "गांव सफलतापूर्वक पंजीकृत हुआ",
        message: "नया गांव सफलतापूर्वक जोड़ा गया है।",
        details: {
          "गांव का नाम": data.name,
          राज्य: data.state,
          जिला: data.district,
          पिनकोड: data.pincode,
        },
      })

      setActiveTab("villages")
      toast.success("गांव सफलतापूर्वक पंजीकृत हुआ")
    } catch (error) {
      console.error("Error creating village:", error)
      setErrorDialog({
        isOpen: true,
        title: "गांव पंजीकरण में त्रुटि",
        message: error instanceof Error ? error.message : "गांव पंजीकृत करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: () => handleVillageSubmit(data),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle chokhla form submission
  const handleChokhlaSubmit = async (data: ChokhlaFormData) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/chokhlas`, {
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
      setChokhlas((prev) => [...prev, newChokhla])

      setSuccessDialog({
        isOpen: true,
        title: "चोखला सफलतापूर्वक पंजीकृत हुआ",
        message: "नया चोखला सफलतापूर्वक जोड़ा गया है।",
        details: {
          नाम: `${data.firstName} ${data.lastName}`,
          मोबाइल: data.mobileNumber,
          स्थान: `${data.district}, ${data.state}`,
        },
      })

      setActiveTab("chokhlas")
      toast.success("चोखला सफलतापूर्वक पंजीकृत हुआ")
    } catch (error) {
      console.error("Error creating chokhla:", error)
      setErrorDialog({
        isOpen: true,
        title: "चोखला पंजीकरण में त्रुटि",
        message: error instanceof Error ? error.message : "चोखला पंजीकृत करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: () => handleChokhlaSubmit(data),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle user form submission
  const handleUserSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/users`, {
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

      const newUser = await response.json()
      setUsers((prev) => [...prev, newUser])

      setSuccessDialog({
        isOpen: true,
        title: "उपयोगकर्ता सफलतापूर्वक जोड़ा गया",
        message: "नया उपयोगकर्ता सफलतापूर्वक जोड़ा गया है।",
        details: {
          नाम: `${data.firstName} ${data.lastName}`,
          ईमेल: data.email,
          भूमिका: data.role,
        },
      })

      setActiveTab("users")
      toast.success("उपयोगकर्ता सफलतापूर्वक जोड़ा गया")
    } catch (error) {
      console.error("Error creating user:", error)
      setErrorDialog({
        isOpen: true,
        title: "उपयोगकर्ता जोड़ने में त्रुटि",
        message: error instanceof Error ? error.message : "उपयोगकर्ता जोड़ने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: () => handleUserSubmit(data),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle profile form submission
  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)
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
        },
      })

      toast.success("प्रोफाइल सफलतापूर्वक अपडेट हुई")
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrorDialog({
        isOpen: true,
        title: "प्रोफाइल अपडेट में त्रुटि",
        message: error instanceof Error ? error.message : "प्रोफाइल अपडेट करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: () => handleProfileSubmit(data),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchProfile()
    fetchVillages()
    fetchChokhlas()
    fetchUsers()
    fetchStats()
  }, [])

  const contextValue: SuperAdminContextType = {
    // State
    activeTab,
    setActiveTab,

    // Data
    profile,
    villages,
    chokhlas,
    users,
    stats,

    // Loading states
    isLoadingProfile,
    isLoadingVillages,
    isLoadingChokhlas,
    isLoadingUsers,
    isLoadingStats,
    isSubmitting,

    // Dialog states
    successDialog,
    errorDialog,
    setSuccessDialog,
    setErrorDialog,

    // Actions
    handleVillageSubmit,
    handleChokhlaSubmit,
    handleUserSubmit,
    handleProfileSubmit,

    // Data fetching
    fetchProfile,
    fetchVillages,
    fetchChokhlas,
    fetchUsers,
    fetchStats,
  }

  return <SuperAdminContext.Provider value={contextValue}>{children}</SuperAdminContext.Provider>
}
