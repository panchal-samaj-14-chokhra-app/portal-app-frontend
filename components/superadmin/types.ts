export interface SuperAdminProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  role: "SUPER_ADMIN"
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLogin?: string
  loginCount: number
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
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  role: "SUPER_ADMIN" | "CHOKHLA" | "VILLAGE_ADMIN"
  state?: string
  district?: string
  village?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface Statistics {
  totalVillages: number
  totalChoklas: number
  totalFamilies: number
  totalPopulation: number
  activeUsers: number
  recentRegistrations: number
  completionRate: number
  growthRate: number
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
