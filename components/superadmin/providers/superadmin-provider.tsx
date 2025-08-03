"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { SuperAdminContextType, User, Village, Chokhla, Statistics, SuperAdminProfile } from "../types"

const SuperAdminContext = createContext<SuperAdminContextType | null>(null)

export function useSuperAdmin() {
  const context = useContext(SuperAdminContext)
  if (!context) {
    throw new Error("useSuperAdmin must be used within SuperAdminProvider")
  }
  return context
}

// Mock data for development
const mockUsers: User[] = [
  {
    id: "1",
    name: "राहुल शर्मा",
    email: "rahul@example.com",
    role: "chokhla",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2024-01-20",
    phone: "+91 9876543210",
    chokhla: "मुंबई चोखला",
  },
  {
    id: "2",
    name: "प्रिया पटेल",
    email: "priya@example.com",
    role: "village",
    status: "active",
    createdAt: "2024-01-10",
    lastLogin: "2024-01-19",
    phone: "+91 9876543211",
    village: "अहमदाबाद",
  },
]

const mockVillages: Village[] = [
  {
    id: "1",
    name: "अहमदाबाद",
    state: "गुजरात",
    district: "अहमदाबाद",
    pincode: "380001",
    chokhlaId: "1",
    chokhlaName: "राहुल शर्मा",
    totalFamilies: 150,
    totalMembers: 600,
    hasElectricity: true,
    hasWaterSupply: true,
    hasSchool: true,
    hasHealthCenter: false,
    hasRoadAccess: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
]

const mockChokhlas: Chokhla[] = [
  {
    id: "1",
    firstName: "राहुल",
    lastName: "शर्मा",
    email: "rahul@example.com",
    mobileNumber: "+91 9876543210",
    state: "गुजरात",
    district: "अहमदाबाद",
    status: "active",
    totalVillages: 5,
    totalFamilies: 750,
    totalMembers: 3000,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    lastLogin: "2024-01-20",
  },
]

const mockStatistics: Statistics = {
  totalUsers: 25,
  totalChokhlas: 5,
  totalVillages: 15,
  totalFamilies: 1250,
  totalMembers: 5000,
  activeUsers: 20,
  pendingUsers: 5,
  recentRegistrations: 8,
  villagesByState: {
    गुजरात: 8,
    राजस्थान: 4,
    महाराष्ट्र: 3,
  },
  usersByRole: {
    chokhla: 5,
    village: 18,
    superadmin: 2,
  },
  monthlyGrowth: [
    { month: "जनवरी", users: 15, villages: 8, families: 800 },
    { month: "फरवरी", users: 20, villages: 12, families: 1000 },
    { month: "मार्च", users: 25, villages: 15, families: 1250 },
  ],
}

const mockProfile: SuperAdminProfile = {
  id: "admin-1",
  name: "सुपर एडमिन",
  email: "admin@panchalsociety.org",
  role: "superadmin",
  createdAt: "2024-01-01",
  lastLogin: "2024-01-20",
  permissions: ["all"],
}

interface SuperAdminProviderProps {
  children: React.ReactNode
}

export function SuperAdminProvider({ children }: SuperAdminProviderProps) {
  // State
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [villages, setVillages] = useState<Village[]>(mockVillages)
  const [chokhlas, setChokhlas] = useState<Chokhla[]>(mockChokhlas)
  const [statistics, setStatistics] = useState<Statistics>(mockStatistics)
  const [profile, setProfile] = useState<SuperAdminProfile | null>(mockProfile)

  // Loading states
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isLoadingVillages, setIsLoadingVillages] = useState(false)
  const [isLoadingChokhlas, setIsLoadingChokhlas] = useState(false)
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  // Refresh functions
  const refreshUsers = useCallback(async () => {
    setIsLoadingUsers(true)
    try {
      // In real app, fetch from API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUsers(mockUsers)
    } catch (error) {
      console.error("Error refreshing users:", error)
    } finally {
      setIsLoadingUsers(false)
    }
  }, [])

  const refreshVillages = useCallback(async () => {
    setIsLoadingVillages(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setVillages(mockVillages)
    } catch (error) {
      console.error("Error refreshing villages:", error)
    } finally {
      setIsLoadingVillages(false)
    }
  }, [])

  const refreshChokhlas = useCallback(async () => {
    setIsLoadingChokhlas(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setChokhlas(mockChokhlas)
    } catch (error) {
      console.error("Error refreshing chokhlas:", error)
    } finally {
      setIsLoadingChokhlas(false)
    }
  }, [])

  const refreshStatistics = useCallback(async () => {
    setIsLoadingStatistics(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStatistics(mockStatistics)
    } catch (error) {
      console.error("Error refreshing statistics:", error)
    } finally {
      setIsLoadingStatistics(false)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    setIsLoadingProfile(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProfile(mockProfile)
    } catch (error) {
      console.error("Error refreshing profile:", error)
    } finally {
      setIsLoadingProfile(false)
    }
  }, [])

  // CRUD operations
  const createUser = useCallback(async (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "village",
      status: userData.status || "pending",
      createdAt: new Date().toISOString().split("T")[0],
      phone: userData.phone,
      village: userData.village,
      chokhla: userData.chokhla,
    }
    setUsers((prev) => [...prev, newUser])
  }, [])

  const updateUser = useCallback(async (id: string, userData: Partial<User>) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...userData } : user)))
  }, [])

  const deleteUser = useCallback(async (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id))
  }, [])

  const createVillage = useCallback(async (villageData: Partial<Village>) => {
    const newVillage: Village = {
      id: Date.now().toString(),
      name: villageData.name || "",
      state: villageData.state || "",
      district: villageData.district || "",
      pincode: villageData.pincode || "",
      chokhlaId: villageData.chokhlaId || "",
      chokhlaName: villageData.chokhlaName || "",
      totalFamilies: villageData.totalFamilies || 0,
      totalMembers: villageData.totalMembers || 0,
      hasElectricity: villageData.hasElectricity || false,
      hasWaterSupply: villageData.hasWaterSupply || false,
      hasSchool: villageData.hasSchool || false,
      hasHealthCenter: villageData.hasHealthCenter || false,
      hasRoadAccess: villageData.hasRoadAccess || false,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      latitude: villageData.latitude,
      longitude: villageData.longitude,
    }
    setVillages((prev) => [...prev, newVillage])
  }, [])

  const updateVillage = useCallback(async (id: string, villageData: Partial<Village>) => {
    setVillages((prev) =>
      prev.map((village) =>
        village.id === id ? { ...village, ...villageData, updatedAt: new Date().toISOString().split("T")[0] } : village,
      ),
    )
  }, [])

  const deleteVillage = useCallback(async (id: string) => {
    setVillages((prev) => prev.filter((village) => village.id !== id))
  }, [])

  const createChokhla = useCallback(async (chokhlaData: Partial<Chokhla>) => {
    const newChokhla: Chokhla = {
      id: Date.now().toString(),
      firstName: chokhlaData.firstName || "",
      lastName: chokhlaData.lastName || "",
      email: chokhlaData.email || "",
      mobileNumber: chokhlaData.mobileNumber || "",
      state: chokhlaData.state || "",
      district: chokhlaData.district || "",
      status: chokhlaData.status || "pending",
      totalVillages: chokhlaData.totalVillages || 0,
      totalFamilies: chokhlaData.totalFamilies || 0,
      totalMembers: chokhlaData.totalMembers || 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setChokhlas((prev) => [...prev, newChokhla])
  }, [])

  const updateChokhla = useCallback(async (id: string, chokhlaData: Partial<Chokhla>) => {
    setChokhlas((prev) =>
      prev.map((chokhla) =>
        chokhla.id === id ? { ...chokhla, ...chokhlaData, updatedAt: new Date().toISOString().split("T")[0] } : chokhla,
      ),
    )
  }, [])

  const deleteChokhla = useCallback(async (id: string) => {
    setChokhlas((prev) => prev.filter((chokhla) => chokhla.id !== id))
  }, [])

  const contextValue: SuperAdminContextType = {
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

    // Refresh functions
    refreshUsers,
    refreshVillages,
    refreshChokhlas,
    refreshStatistics,
    refreshProfile,

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
  }

  return <SuperAdminContext.Provider value={contextValue}>{children}</SuperAdminContext.Provider>
}
