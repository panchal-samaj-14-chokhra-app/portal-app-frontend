"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { SuperAdminContextType, User, Village, Chokhla, Statistics } from "../types"

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined)

export function useSuperAdmin() {
  const context = useContext(SuperAdminContext)
  if (!context) {
    throw new Error("useSuperAdmin must be used within a SuperAdminProvider")
  }
  return context
}

interface SuperAdminProviderProps {
  children: React.ReactNode
}

export function SuperAdminProvider({ children }: SuperAdminProviderProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [users, setUsers] = useState<User[]>([])
  const [villages, setVillages] = useState<Village[]>([])
  const [chokhlas, setChokhlas] = useState<Chokhla[]>([])
  const [statistics, setStatistics] = useState<Statistics>({
    totalUsers: 0,
    totalChokhlas: 0,
    totalVillages: 0,
    totalFamilies: 0,
    totalMembers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    pendingUsers: 0,
    recentActivity: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Mock data loading
  useEffect(() => {
    loadMockData()
  }, [])

  const loadMockData = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock users data
      const mockUsers: User[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "chokhla",
          status: "active",
          createdAt: "2024-01-15",
          lastLogin: "2024-01-20",
          chokhla: "North Region",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "village",
          status: "active",
          createdAt: "2024-01-10",
          lastLogin: "2024-01-19",
          village: "Village A",
        },
      ]

      // Mock villages data
      const mockVillages: Village[] = [
        {
          id: "1",
          name: "Village A",
          chokhlaId: "1",
          chokhlaName: "North Region",
          totalFamilies: 150,
          totalMembers: 600,
          status: "active",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-20",
        },
        {
          id: "2",
          name: "Village B",
          chokhlaId: "1",
          chokhlaName: "North Region",
          totalFamilies: 200,
          totalMembers: 800,
          status: "active",
          createdAt: "2024-01-05",
          updatedAt: "2024-01-18",
        },
      ]

      // Mock chokhlas data
      const mockChokhlas: Chokhla[] = [
        {
          id: "1",
          name: "North Region",
          email: "north@example.com",
          phone: "+1234567890",
          totalVillages: 5,
          totalFamilies: 750,
          totalMembers: 3000,
          status: "active",
          createdAt: "2023-12-01",
          updatedAt: "2024-01-20",
        },
      ]

      // Mock statistics
      const mockStatistics: Statistics = {
        totalUsers: mockUsers.length,
        totalChokhlas: mockChokhlas.length,
        totalVillages: mockVillages.length,
        totalFamilies: mockVillages.reduce((sum, v) => sum + v.totalFamilies, 0),
        totalMembers: mockVillages.reduce((sum, v) => sum + v.totalMembers, 0),
        activeUsers: mockUsers.filter((u) => u.status === "active").length,
        inactiveUsers: mockUsers.filter((u) => u.status === "inactive").length,
        pendingUsers: mockUsers.filter((u) => u.status === "pending").length,
        recentActivity: [
          {
            id: "1",
            type: "user_created",
            description: "New user John Doe created",
            timestamp: "2024-01-20T10:30:00Z",
            user: "System",
          },
          {
            id: "2",
            type: "village_added",
            description: "Village B added to North Region",
            timestamp: "2024-01-19T15:45:00Z",
            user: "Admin",
          },
        ],
      }

      setUsers(mockUsers)
      setVillages(mockVillages)
      setChokhlas(mockChokhlas)
      setStatistics(mockStatistics)
      setError(null)
    } catch (err) {
      setError("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = () => {
    loadMockData()
  }

  const value: SuperAdminContextType = {
    activeTab,
    setActiveTab,
    users,
    villages,
    chokhlas,
    statistics,
    isLoading,
    error,
    refreshData,
    showSuccessDialog,
    showErrorDialog,
    successMessage,
    errorMessage,
    setShowSuccessDialog,
    setShowErrorDialog,
    setSuccessMessage,
    setErrorMessage,
  }

  return <SuperAdminContext.Provider value={value}>{children}</SuperAdminContext.Provider>
}
