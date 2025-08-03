"use client"

import { useState, useEffect } from "react"
import type { SuperAdminProfile, Village, Chokhla, User, Statistics } from "../types"

export function useSuperAdminData() {
  const [profile, setProfile] = useState<SuperAdminProfile | null>(null)
  const [villages, setVillages] = useState<Village[]>([])
  const [choklas, setChoklas] = useState<Chokhla[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)

  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingVillages, setIsLoadingVillages] = useState(true)
  const [isLoadingChoklas, setIsLoadingChoklas] = useState(true)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(true)

  const loadData = async () => {
    try {
      // In a real app, these would be actual API calls
      await Promise.all([loadProfile(), loadVillages(), loadChoklas(), loadUsers(), loadStatistics()])
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const loadProfile = async () => {
    setIsLoadingProfile(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

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
  }

  const loadVillages = async () => {
    setIsLoadingVillages(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

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
  }

  const loadChoklas = async () => {
    setIsLoadingChoklas(true)
    await new Promise((resolve) => setTimeout(resolve, 600))

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
  }

  const loadUsers = async () => {
    setIsLoadingUsers(true)
    await new Promise((resolve) => setTimeout(resolve, 700))

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
  }

  const loadStatistics = async () => {
    setIsLoadingStatistics(true)
    await new Promise((resolve) => setTimeout(resolve, 400))

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

  useEffect(() => {
    loadData()
  }, [])

  return {
    profile,
    villages,
    choklas,
    users,
    statistics,
    isLoadingProfile,
    isLoadingVillages,
    isLoadingChoklas,
    isLoadingUsers,
    isLoadingStatistics,
    setProfile,
    setVillages,
    setChoklas,
    setUsers,
    setStatistics,
    refreshProfile: loadProfile,
    refreshVillages: loadVillages,
    refreshChoklas: loadChoklas,
    refreshUsers: loadUsers,
    refreshStatistics: loadStatistics,
  }
}
