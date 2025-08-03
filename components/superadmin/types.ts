export interface Village {
  id: string
  name: string
  state: string
  district: string
  pincode: string
  totalFamilies: number
  totalMembers: number
  hasElectricity: boolean
  hasWaterSupply: boolean
  hasSchool: boolean
  hasHealthCenter: boolean
  hasRoadAccess: boolean
  createdAt: string
  updatedAt: string
}

export interface Chokhla {
  id: string
  firstName: string
  lastName: string
  mobileNumber: string
  email: string
  state: string
  district: string
  villages: Village[]
  totalVillages: number
  totalFamilies: number
  totalMembers: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "SUPER_ADMIN" | "ADMIN" | "CHOKHLA" | "USER"
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export interface Statistics {
  totalVillages: number
  totalChokhlas: number
  totalFamilies: number
  totalMembers: number
  activeUsers: number
  recentRegistrations: number
}

export interface ChokhlaFormData {
  firstName: string
  lastName: string
  mobileNumber: string
  email: string
  state: string
  district: string
  password: string
  confirmPassword: string
}

export interface ProfileData {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  lastLogin: string | null
  permissions: string[]
  sessionInfo: {
    ipAddress: string
    userAgent: string
    loginTime: string
  }
}
