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

export type ActiveView = "dashboard" | "villages" | "chokhlas" | "users" | "statistics" | "profile"

interface DialogState {
  isOpen: boolean
  title: string
  message: string
  details?: Record<string, any>
  onRetry?: () => void
}

interface SuperAdminContextType {
  // State
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void

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
  showSuccessDialog: boolean
  setShowSuccessDialog: (show: boolean) => void
  showErrorDialog: boolean
  setShowErrorDialog: (show: boolean) => void

  // Messages
  successMessage: string
  setSuccessMessage: (message: string) => void
  errorMessage: string
  setErrorMessage: (message: string) => void

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
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")
  const [profile, setProfile] = useState<SuperAdminUser | null>(null)
  const [villages, setVillages] = useState<Village[]>([])
  const [chokhlas, setChokhlas] = useState<Chokhla[]>([])
  const [users, setUsers] = useState<SuperAdminUser[]>([])
  const [stats, setStats] = useState<SuperAdminStats | null>(null)

  // Dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingVillages, setIsLoadingVillages] = useState(true)
  const [isLoadingChokhlas, setIsLoadingChokhlas] = useState(true)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true)
      setIsLoading(true)
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
      setSuccessMessage("आपकी प्रोफाइल की जानकारी सफलतापूर्वक लोड हो गई है।")
      setShowSuccessDialog(true)
    } catch (error) {
      console.error("Error fetching profile:", error)
      setErrorMessage("प्रोफाइल की जानकारी लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
    } finally {
      setIsLoadingProfile(false)
      setIsLoading(false)
    }
  }

  // Fetch villages data
  const fetchVillages = async () => {
    try {
      setIsLoadingVillages(true)
      setIsLoading(true)
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
      setSuccessMessage("गांवों की सूची सफलतापूर्वक लोड हो गई है।")
      setShowSuccessDialog(true)
    } catch (error) {
      console.error("Error fetching villages:", error)
      setErrorMessage("गांवों की सूची लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
    } finally {
      setIsLoadingVillages(false)
      setIsLoading(false)
    }
  }

  // Fetch chokhlas data
  const fetchChokhlas = async () => {
    try {
      setIsLoadingChokhlas(true)
      setIsLoading(true)
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
      setSuccessMessage("चोखला की सूची सफलतापूर्वक लोड हो गई है।")
      setShowSuccessDialog(true)
    } catch (error) {
      console.error("Error fetching chokhlas:", error)
      setErrorMessage("चोखला की सूची लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
    } finally {
      setIsLoadingChokhlas(false)
      setIsLoading(false)
    }
  }

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true)
      setIsLoading(true)
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
      setSuccessMessage("उपयोगकर्ताओं की सूची सफलतापूर्वक लोड हो गई है।")
      setShowSuccessDialog(true)
    } catch (error) {
      console.error("Error fetching users:", error)
      setErrorMessage("उपयोगकर्ताओं की सूची लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
    } finally {
      setIsLoadingUsers(false)
      setIsLoading(false)
    }
  }

  // Fetch statistics data
  const fetchStats = async () => {
    try {
      setIsLoadingStats(true)
      setIsLoading(true)
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
      setSuccessMessage("आंकड़े सफलतापूर्वक लोड हो गए हैं।")
      setShowSuccessDialog(true)
    } catch (error) {
      console.error("Error fetching statistics:", error)
      setErrorMessage("आंकड़े लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
    } finally {
      setIsLoadingStats(false)
      setIsLoading(false)
    }
  }

  // Handle village form submission
  const handleVillageSubmit = async (data: VillageFormData) => {
    try {
      setIsSubmitting(true)
      setIsLoading(true)
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

      setSuccessMessage("नया गांव सफलतापूर्वक जोड़ा गया है।")
      setShowSuccessDialog(true)

      setActiveView("villages")
      toast.success("गांव सफलतापूर्वक पंजीकृत हुआ")
    } catch (error) {
      console.error("Error creating village:", error)
      setErrorMessage(error instanceof Error ? error.message : "गांव पंजीकृत करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  // Handle chokhla form submission
  const handleChokhlaSubmit = async (data: ChokhlaFormData) => {
    try {
      setIsSubmitting(true)
      setIsLoading(true)
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

      setSuccessMessage("नया चोखला सफलतापूर्वक जोड़ा गया है।")
      setShowSuccessDialog(true)

      setActiveView("chokhlas")
      toast.success("चोखला सफलतापूर्वक पंजीकृत हुआ")
    } catch (error) {
      console.error("Error creating chokhla:", error)
      setErrorMessage(error instanceof Error ? error.message : "चोखला पंजीकृत करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  // Handle user form submission
  const handleUserSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true)
      setIsLoading(true)
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

      setSuccessMessage("नया उपयोगकर्ता सफलतापूर्वक जोड़ा गया है।")
      setShowSuccessDialog(true)

      setActiveView("users")
      toast.success("उपयोगकर्ता सफलतापूर्वक जोड़ा गया")
    } catch (error) {
      console.error("Error creating user:", error)
      setErrorMessage(error instanceof Error ? error.message : "उपयोगकर्ता जोड़ने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  // Handle profile form submission
  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)
      setIsLoading(true)
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

      setSuccessMessage("आपकी प्रोफाइल की जानकारी सफलतापूर्वक अपडेट हो गई है।")
      setShowSuccessDialog(true)

      toast.success("प्रोफाइल सफलतापूर्वक अपडेट हुई")
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrorMessage(error instanceof Error ? error.message : "प्रोफाइल अपडेट करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
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
    activeView,
    setActiveView,

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
    isLoading,

    // Dialog states
    showSuccessDialog,
    setShowSuccessDialog,
    showErrorDialog,
    setShowErrorDialog,

    // Messages
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,

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
