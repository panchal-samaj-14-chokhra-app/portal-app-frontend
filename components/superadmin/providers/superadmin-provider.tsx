"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import type { SuperAdminContextType, User, Village, Chokhla, Statistics, SuperAdminProfile } from "../types"
import { MOCK_STATISTICS } from "../constants"

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
  // State
  const [users, setUsers] = useState<User[]>([])
  const [villages, setVillages] = useState<Village[]>([])
  const [chokhlas, setChokhlas] = useState<Chokhla[]>([])
  const [statistics, setStatistics] = useState<Statistics>(MOCK_STATISTICS)
  const [profile, setProfile] = useState<SuperAdminProfile | null>(null)

  // Loading states
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isLoadingVillages, setIsLoadingVillages] = useState(true)
  const [isLoadingChokhlas, setIsLoadingChokhlas] = useState(true)
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(true)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  // Mock data
  const mockUsers: User[] = [
    {
      id: "1",
      name: "राजेश पटेल",
      email: "rajesh@example.com",
      role: "chokhla",
      status: "active",
      createdAt: "2024-01-15",
      lastLogin: "2024-01-20",
      chokhla: "अहमदाबाद चोखला",
    },
    {
      id: "2",
      name: "सुनीता शर्मा",
      email: "sunita@example.com",
      role: "village_admin",
      status: "active",
      createdAt: "2024-01-10",
      lastLogin: "2024-01-19",
      village: "रामपुर गांव",
    },
    {
      id: "3",
      name: "अमित गुप्ता",
      email: "amit@example.com",
      role: "chokhla",
      status: "pending",
      createdAt: "2024-01-18",
      chokhla: "सूरत चोखला",
    },
  ]

  const mockVillages: Village[] = [
    {
      id: "1",
      name: "रामपुर",
      state: "गुजरात",
      district: "अहमदाबाद",
      pincode: "380001",
      population: 2500,
      families: 450,
      chokhlaId: "1",
      chokhlaName: "अहमदाबाद चोखला",
      adminId: "2",
      adminName: "सुनीता शर्मा",
      status: "active",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
    },
    {
      id: "2",
      name: "श्यामपुर",
      state: "गुजरात",
      district: "सूरत",
      pincode: "395001",
      population: 1800,
      families: 320,
      chokhlaId: "2",
      chokhlaName: "सूरत चोखला",
      status: "active",
      createdAt: "2024-01-12",
      updatedAt: "2024-01-18",
    },
  ]

  const mockChokhlas: Chokhla[] = [
    {
      id: "1",
      name: "राजेश पटेल",
      email: "rajesh@example.com",
      phone: "+91 9876543210",
      state: "गुजरात",
      district: "अहमदाबाद",
      villages: 12,
      totalPopulation: 28500,
      status: "active",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-20",
    },
    {
      id: "2",
      name: "अमित गुप्ता",
      email: "amit@example.com",
      phone: "+91 9876543211",
      state: "गुजरात",
      district: "सूरत",
      villages: 8,
      totalPopulation: 19200,
      status: "pending",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-18",
    },
  ]

  const mockProfile: SuperAdminProfile = {
    id: "superadmin-1",
    name: "सुपर एडमिन",
    email: "superadmin@example.com",
    phone: "+91 9876543200",
    role: "superadmin",
    createdAt: "2024-01-01",
    lastLogin: "2024-01-20",
  }

  // Fetch functions
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUsers(mockUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("उपयोगकर्ता डेटा लोड करने में त्रुटि")
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const fetchVillages = async () => {
    try {
      setIsLoadingVillages(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setVillages(mockVillages)
    } catch (error) {
      console.error("Error fetching villages:", error)
      toast.error("गांव डेटा लोड करने में त्रुटि")
    } finally {
      setIsLoadingVillages(false)
    }
  }

  const fetchChokhlas = async () => {
    try {
      setIsLoadingChokhlas(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setChokhlas(mockChokhlas)
    } catch (error) {
      console.error("Error fetching chokhlas:", error)
      toast.error("चोखला डेटा लोड करने में त्रुटि")
    } finally {
      setIsLoadingChokhlas(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      setIsLoadingStatistics(true)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setStatistics(MOCK_STATISTICS)
    } catch (error) {
      console.error("Error fetching statistics:", error)
      toast.error("आंकड़े लोड करने में त्रुटि")
    } finally {
      setIsLoadingStatistics(false)
    }
  }

  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setProfile(mockProfile)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("प्रोफाइल लोड करने में त्रुटि")
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // CRUD operations
  const createUser = async (userData: Partial<User>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "village_admin",
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
        village: userData.village,
        chokhla: userData.chokhla,
      }
      setUsers((prev) => [...prev, newUser])
      toast.success("उपयोगकर्ता सफलतापूर्वक जोड़ा गया")
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error("उपयोगकर्ता जोड़ने में त्रुटि")
      throw error
    }
  }

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...userData } : user)))
      toast.success("उपयोगकर्ता सफलतापूर्वक अपडेट किया गया")
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("उपयोगकर्ता अपडेट करने में त्रुटि")
      throw error
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUsers((prev) => prev.filter((user) => user.id !== id))
      toast.success("उपयोगकर्ता सफलतापूर्वक हटाया गया")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("उपयोगकर्ता हटाने में त्रुटि")
      throw error
    }
  }

  const createVillage = async (villageData: Partial<Village>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const newVillage: Village = {
        id: Date.now().toString(),
        name: villageData.name || "",
        state: villageData.state || "",
        district: villageData.district || "",
        pincode: villageData.pincode || "",
        population: 0,
        families: 0,
        chokhlaId: villageData.chokhlaId || "",
        chokhlaName: chokhlas.find((c) => c.id === villageData.chokhlaId)?.name || "",
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setVillages((prev) => [...prev, newVillage])
      toast.success("गांव सफलतापूर्वक जोड़ा गया")
    } catch (error) {
      console.error("Error creating village:", error)
      toast.error("गांव जोड़ने में त्रुटि")
      throw error
    }
  }

  const updateVillage = async (id: string, villageData: Partial<Village>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setVillages((prev) =>
        prev.map((village) =>
          village.id === id
            ? { ...village, ...villageData, updatedAt: new Date().toISOString().split("T")[0] }
            : village,
        ),
      )
      toast.success("गांव सफलतापूर्वक अपडेट किया गया")
    } catch (error) {
      console.error("Error updating village:", error)
      toast.error("गांव अपडेट करने में त्रुटि")
      throw error
    }
  }

  const deleteVillage = async (id: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setVillages((prev) => prev.filter((village) => village.id !== id))
      toast.success("गांव सफलतापूर्वक हटाया गया")
    } catch (error) {
      console.error("Error deleting village:", error)
      toast.error("गांव हटाने में त्रुटि")
      throw error
    }
  }

  const createChokhla = async (chokhlaData: Partial<Chokhla>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const newChokhla: Chokhla = {
        id: Date.now().toString(),
        name: chokhlaData.name || "",
        email: chokhlaData.email || "",
        phone: chokhlaData.phone || "",
        state: chokhlaData.state || "",
        district: chokhlaData.district || "",
        villages: 0,
        totalPopulation: 0,
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setChokhlas((prev) => [...prev, newChokhla])
      toast.success("चोखला सफलतापूर्वक जोड़ा गया")
    } catch (error) {
      console.error("Error creating chokhla:", error)
      toast.error("चोखला जोड़ने में त्रुटि")
      throw error
    }
  }

  const updateChokhla = async (id: string, chokhlaData: Partial<Chokhla>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setChokhlas((prev) =>
        prev.map((chokhla) =>
          chokhla.id === id
            ? { ...chokhla, ...chokhlaData, updatedAt: new Date().toISOString().split("T")[0] }
            : chokhla,
        ),
      )
      toast.success("चोखला सफलतापूर्वक अपडेट किया गया")
    } catch (error) {
      console.error("Error updating chokhla:", error)
      toast.error("चोखला अपडेट करने में त्रुटि")
      throw error
    }
  }

  const deleteChokhla = async (id: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setChokhlas((prev) => prev.filter((chokhla) => chokhla.id !== id))
      toast.success("चोखला सफलतापूर्वक हटाया गया")
    } catch (error) {
      console.error("Error deleting chokhla:", error)
      toast.error("चोखला हटाने में त्रुटि")
      throw error
    }
  }

  const updateProfile = async (profileData: Partial<SuperAdminProfile>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProfile((prev) => (prev ? { ...prev, ...profileData } : null))
      toast.success("प्रोफाइल सफलतापूर्वक अपडेट की गई")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("प्रोफाइल अपडेट करने में त्रुटि")
      throw error
    }
  }

  // Initialize data
  useEffect(() => {
    fetchUsers()
    fetchVillages()
    fetchChokhlas()
    fetchStatistics()
    fetchProfile()
  }, [])

  const value: SuperAdminContextType = {
    // Data
    users,
    villages,
    chokhlas,
    statistics,
    profile,

    // Loading states
    isLoadingUsers,
    isLoadingVillages,
    isLoadingChokhlas,
    isLoadingStatistics,
    isLoadingProfile,

    // CRUD operations
    createUser,
    updateUser,
    deleteUser,
    createVillage,
    updateVillage,
    deleteVillage,
    createChokhla,
    updateChokhla,
    deleteChokhla,
    updateProfile,

    // Refresh functions
    refreshUsers: fetchUsers,
    refreshVillages: fetchVillages,
    refreshChokhlas: fetchChokhlas,
    refreshStatistics: fetchStatistics,
    refreshProfile: fetchProfile,
  }

  return <SuperAdminContext.Provider value={value}>{children}</SuperAdminContext.Provider>
}
