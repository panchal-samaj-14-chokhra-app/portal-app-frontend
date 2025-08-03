export interface SuperAdminProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  role: "SUPERADMIN"
  isActive: boolean
  loginCount: number
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export interface Village {
  id: string
  name: string
  state: string
  district: string
  pincode: string
  hasElectricity: boolean
  hasWaterSupply: boolean
  hasSchool: boolean
  hasHealthCenter: boolean
  hasRoadAccess: boolean
  latitude?: number
  longitude?: number
  familyCount: number
  populationCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Chokhla {
  id: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  state: string
  district: string
  villageCount: number
  familyCount: number
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  role: "ADMIN" | "CHOKHLA" | "USER"
  state?: string
  district?: string
  village?: string
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export interface Statistics {
  totalVillages: number
  totalChoklas: number
  totalUsers: number
  totalFamilies: number
  totalPopulation: number
  activeVillages: number
  activeChoklas: number
  activeUsers: number
  recentRegistrations: number
  monthlyGrowth: {
    villages: number
    choklas: number
    users: number
    families: number
  }
  stateDistribution: Array<{
    state: string
    villages: number
    families: number
    population: number
  }>
  facilityStats: {
    electricity: number
    waterSupply: number
    school: number
    healthCenter: number
    roadAccess: number
  }
}

export interface ChokhlaFormData {
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  password: string
  confirmPassword: string
  state: string
  district: string
}

export interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}
