"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import type { SuperAdminProfile, Village, Chokhla, User, Statistics, ChokhlaFormData, ProfileFormData } from "../types"

interface SuperAdminContextType {
  // State
  activeTab: string
  profile: SuperAdminProfile | null
  villages: Village[]
  choklas: Chokhla[]
  users: User[]
  statistics: Statistics | null

  // Loading states
  isLoadingProfile: boolean
  isLoadingVillages: boolean
  isLoadingChoklas: boolean
  isLoadingUsers: boolean
  isLoadingStatistics: boolean

  // Dialog states
  successDialog: {
    isOpen: boolean
    title: string
    message: string
    details?: Record<string, any>
  }
  errorDialog: {
    isOpen: boolean
    title: string
    message: string
    onRetry?: () => void
  }

  // Actions
  setActiveTab: (tab: string) => void
  handleCreateChokhla: (data: ChokhlaFormData) => Promise<void>
  handleUpdateProfile: (data: ProfileFormData) => Promise<void>
  handleToggleUserStatus: (id: string, isActive: boolean) => Promise<void>
  handleToggleChokhlaStatus: (id: string, isActive: boolean) => Promise<void>
  handleLogout: () => Promise<void>
  handleRefreshVillages: () => void
  handleRefreshChoklas: () => void
  handleRefreshUsers: () => void
  setSuccessDialog: (dialog: any) => void
  setErrorDialog: (dialog: any) => void
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

  // Load mock data on mount
  useEffect(() => {
    loadMockData()
  }, [])

  const loadMockData = () => {
    // Mock profile
    setProfile({
      id: "1",
      firstName: "राम",
      lastName: "पटेल",
      email: "admin@panchalsamaj.org",
      mobileNumber: "9876543210",
      role: "SUPERADMIN",
      isActive: true,
      loginCount: 45,
      lastLogin: new Date().toISOString(),
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    })
    setIsLoadingProfile(false)

    // Mock villages
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

    // Mock choklas
    setChoklas([
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
    setIsLoadingChoklas(false)

    // Mock users
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

    // Mock statistics
    setStatistics({
      totalVillages: 125,
      totalChoklas: 15,
      totalUsers: 450,
      totalFamilies: 2500,
      totalPopulation: 12500,
      activeVillages: 120,
      activeChoklas: 12,
      activeUsers: 425,
      recentRegistrations: 25,
      monthlyGrowth: {
        villages: 8.5,
        choklas: 12.3,
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
    setIsLoadingStatistics(false)
  }

  // Handle chokhla creation
  const handleCreateChokhla = async (data: ChokhlaFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

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
        message: "चोखला पंजीकृत करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
      })
    }
  }

  // Handle profile update
  const handleUpdateProfile = async (data: ProfileFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (profile) {
        const updatedProfile: SuperAdminProfile = {
          ...profile,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobileNumber: data.mobileNumber,
          updatedAt: new Date().toISOString(),
        }

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
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrorDialog({
        isOpen: true,
        title: "प्रोफाइल अपडेट में त्रुटि",
        message: "प्रोफाइल अपडेट करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
      })
    }
  }

  // Handle user status toggle
  const handleToggleUserStatus = async (id: string, isActive: boolean) => {
    try {
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
      await new Promise((resolve) => setTimeout(resolve, 500))
      window.location.href = "/login"
    } catch (error) {
      console.error("Error logging out:", error)
      toast.error("लॉग आउट करने में त्रुटि")
    }
  }

  // Refresh functions
  const handleRefreshVillages = () => {
    setIsLoadingVillages(true)
    setTimeout(() => setIsLoadingVillages(false), 1000)
  }

  const handleRefreshChoklas = () => {
    setIsLoadingChoklas(true)
    setTimeout(() => setIsLoadingChoklas(false), 1000)
  }

  const handleRefreshUsers = () => {
    setIsLoadingUsers(true)
    setTimeout(() => setIsLoadingUsers(false), 1000)
  }

  const value: SuperAdminContextType = {
    // State
    activeTab,
    profile,
    villages,
    choklas,
    users,
    statistics,

    // Loading states
    isLoadingProfile,
    isLoadingVillages,
    isLoadingChoklas,
    isLoadingUsers,
    isLoadingStatistics,

    // Dialog states
    successDialog,
    errorDialog,

    // Actions
    setActiveTab,
    handleCreateChokhla,
    handleUpdateProfile,
    handleToggleUserStatus,
    handleToggleChokhlaStatus,
    handleLogout,
    handleRefreshVillages,
    handleRefreshChoklas,
    handleRefreshUsers,
    setSuccessDialog,
    setErrorDialog,
  }

  return <SuperAdminContext.Provider value={value}>{children}</SuperAdminContext.Provider>
}
