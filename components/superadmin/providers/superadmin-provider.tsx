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

  // Mock data for development - simulating API calls
  const loadMockData = () => {
    // Mock profile
    setTimeout(() => {
      setProfile({
        id: "1",
        firstName: "राम",
        lastName: "पटेल",
        email: "admin@panchalsamaj.org",
        mobileNumber: "9876543210",
        role: "SUPERADMIN",
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: new Date().toISOString(),
      })
      setIsLoadingProfile(false)
    }, 1000)

    // Mock villages
    setTimeout(() => {
      setVillages([
        {
          id: "1",
          name: "रामपुर",
          state: "गुजरात",
          district: "अहमदाबाद",
          pincode: "380001",
          hasElectricity: true,
          hasWaterSupply: true,
          hasSchool: true,
          hasHealthCenter: false,
          hasRoadAccess: true,
          latitude: 23.0225,
          longitude: 72.5714,
          familyCount: 150,
          populationCount: 750,
          isActive: true,
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z",
        },
        {
          id: "2",
          name: "श्यामपुर",
          state: "राजस्थान",
          district: "जयपुर",
          pincode: "302001",
          hasElectricity: true,
          hasWaterSupply: false,
          hasSchool: true,
          hasHealthCenter: true,
          hasRoadAccess: true,
          familyCount: 200,
          populationCount: 1000,
          isActive: true,
          createdAt: "2024-01-20T00:00:00Z",
          updatedAt: "2024-01-20T00:00:00Z",
        },
      ])
      setIsLoadingVillages(false)
    }, 1200)

    // Mock chokhlas
    setTimeout(() => {
      setChokhlas([
        {
          id: "1",
          firstName: "विकास",
          lastName: "शाह",
          email: "vikas@example.com",
          mobileNumber: "9876543211",
          state: "गुजरात",
          district: "अहमदाबाद",
          villageCount: 5,
          familyCount: 250,
          isActive: true,
          lastLogin: "2024-01-25T10:30:00Z",
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-25T10:30:00Z",
        },
        {
          id: "2",
          firstName: "प्रिया",
          lastName: "पटेल",
          email: "priya@example.com",
          mobileNumber: "9876543212",
          state: "राजस्थान",
          district: "जयपुर",
          villageCount: 3,
          familyCount: 180,
          isActive: false,
          lastLogin: null,
          createdAt: "2024-01-12T00:00:00Z",
          updatedAt: "2024-01-12T00:00:00Z",
        },
      ])
      setIsLoadingChokhlas(false)
    }, 1400)

    // Mock users
    setTimeout(() => {
      setUsers([
        {
          id: "1",
          firstName: "अमित",
          lastName: "गुप्ता",
          email: "amit@example.com",
          mobileNumber: "9876543213",
          role: "ADMIN",
          state: "गुजरात",
          district: "सूरत",
          isActive: true,
          lastLogin: "2024-01-24T15:45:00Z",
          createdAt: "2024-01-05T00:00:00Z",
          updatedAt: "2024-01-24T15:45:00Z",
        },
        {
          id: "2",
          firstName: "सुनीता",
          lastName: "शर्मा",
          email: "sunita@example.com",
          mobileNumber: "9876543214",
          role: "USER",
          state: "राजस्थान",
          district: "उदयपुर",
          village: "नंदगांव",
          isActive: true,
          lastLogin: "2024-01-23T09:20:00Z",
          createdAt: "2024-01-08T00:00:00Z",
          updatedAt: "2024-01-23T09:20:00Z",
        },
      ])
      setIsLoadingUsers(false)
    }, 1600)

    // Mock statistics
    setTimeout(() => {
      setStats({
        totalVillages: 125,
        totalChokhlas: 15,
        totalUsers: 450,
        totalFamilies: 2500,
        totalPopulation: 12500,
        activeVillages: 120,
        activeChokhlas: 12,
        activeUsers: 425,
        recentRegistrations: 25,
        monthlyGrowth: {
          villages: 8.5,
          chokhlas: 12.3,
          users: 15.7,
          families: 6.2,
        },
        stateDistribution: [
          { state: "गुजरात", villages: 75, families: 1500, population: 7500 },
          { state: "राजस्थान", villages: 50, families: 1000, population: 5000 },
        ],
        facilityStats: {
          electricity: 95,
          waterSupply: 80,
          school: 70,
          healthCenter: 45,
          roadAccess: 85,
        },
      })
      setIsLoadingStats(false)
    }, 1800)
  }

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true)
      // In production, this would be a real API call
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/profile`)
      // For now, using mock data
      loadMockData()
    } catch (error) {
      console.error("Error fetching profile:", error)
      setErrorMessage("प्रोफाइल की जानकारी लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
      setIsLoadingProfile(false)
    }
  }

  // Fetch villages data
  const fetchVillages = async () => {
    try {
      setIsLoadingVillages(true)
      // Mock implementation - in production this would be a real API call
      // Already handled in loadMockData()
    } catch (error) {
      console.error("Error fetching villages:", error)
      setErrorMessage("गांवों की सूची लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
      setIsLoadingVillages(false)
    }
  }

  // Fetch chokhlas data
  const fetchChokhlas = async () => {
    try {
      setIsLoadingChokhlas(true)
      // Mock implementation - in production this would be a real API call
      // Already handled in loadMockData()
    } catch (error) {
      console.error("Error fetching chokhlas:", error)
      setErrorMessage("चोखला की सूची लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
      setIsLoadingChokhlas(false)
    }
  }

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true)
      // Mock implementation - in production this would be a real API call
      // Already handled in loadMockData()
    } catch (error) {
      console.error("Error fetching users:", error)
      setErrorMessage("उपयोगकर्ताओं की सूची लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
      setIsLoadingUsers(false)
    }
  }

  // Fetch statistics data
  const fetchStats = async () => {
    try {
      setIsLoadingStats(true)
      // Mock implementation - in production this would be a real API call
      // Already handled in loadMockData()
    } catch (error) {
      console.error("Error fetching statistics:", error)
      setErrorMessage("आंकड़े लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
      setIsLoadingStats(false)
    }
  }

  // Handle village form submission
  const handleVillageSubmit = async (data: VillageFormData) => {
    try {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newVillage: Village = {
        id: Date.now().toString(),
        name: data.name,
        state: data.state,
        district: data.district,
        pincode: data.pincode,
        hasElectricity: data.hasElectricity,
        hasWaterSupply: data.hasWaterSupply,
        hasSchool: data.hasSchool,
        hasHealthCenter: data.hasHealthCenter,
        hasRoadAccess: data.hasRoadAccess,
        latitude: data.latitude,
        longitude: data.longitude,
        familyCount: 0,
        populationCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setVillages((prev) => [...prev, newVillage])

      setSuccessMessage("नया गांव सफलतापूर्वक जोड़ा गया है।")
      setShowSuccessDialog(true)

      setActiveView("villages")
      toast.success("गांव सफलतापूर्वक पंजीकृत हुआ")
    } catch (error) {
      console.error("Error creating village:", error)
      setErrorMessage("गांव पंजीकृत करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle chokhla form submission
  const handleChokhlaSubmit = async (data: ChokhlaFormData) => {
    try {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newChokhla: Chokhla = {
        id: Date.now().toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        state: data.state,
        district: data.district,
        villageCount: 0,
        familyCount: 0,
        isActive: true,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setChokhlas((prev) => [...prev, newChokhla])

      setSuccessMessage("नया चोखला सफलतापूर्वक जोड़ा गया है।")
      setShowSuccessDialog(true)

      setActiveView("chokhlas")
      toast.success("चोखला सफलतापूर्वक पंजीकृत हुआ")
    } catch (error) {
      console.error("Error creating chokhla:", error)
      setErrorMessage("चोखला पंजीकृत करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle user form submission
  const handleUserSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newUser: SuperAdminUser = {
        id: Date.now().toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        role: data.role,
        state: data.state,
        district: data.district,
        village: data.village,
        isActive: true,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setUsers((prev) => [...prev, newUser])

      setSuccessMessage("नया उपयोगकर्ता सफलतापूर्वक जोड़ा गया है।")
      setShowSuccessDialog(true)

      setActiveView("users")
      toast.success("उपयोगकर्ता सफलतापूर्वक जोड़ा गया")
    } catch (error) {
      console.error("Error creating user:", error)
      setErrorMessage("उपयोगकर्ता जोड़ने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle profile form submission
  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (profile) {
        const updatedProfile: SuperAdminUser = {
          ...profile,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobileNumber: data.mobileNumber,
          updatedAt: new Date().toISOString(),
        }

        setProfile(updatedProfile)

        setSuccessMessage("आपकी प्रोफाइल की जानकारी सफलतापूर्वक अपडेट हो गई है।")
        setShowSuccessDialog(true)

        toast.success("प्रोफाइल सफलतापूर्वक अपडेट हुई")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrorMessage("प्रोफाइल अपडेट करने में समस्या हुई है। कृपया पुनः प्रयास करें।")
      setShowErrorDialog(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadMockData()
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
