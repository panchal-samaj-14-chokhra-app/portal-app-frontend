export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  role: "SUPERADMIN" | "ADMIN" | "USER"
  state?: string
  district?: string
  village?: string
  isActive: boolean
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

export interface Statistics {
  totalUsers: number
  totalChokhlas: number
  totalVillages: number
  totalFamilies: number
  totalMembers: number
  activeUsers: number
  inactiveUsers: number
  pendingUsers: number
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: "user_created" | "village_added" | "family_registered" | "chokhla_created"
  description: string
  timestamp: string
  user: string
}

export interface SuperAdminContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
  users: User[]
  villages: Village[]
  chokhlas: Chokhla[]
  statistics: Statistics
  isLoading: boolean
  error: string | null
  refreshData: () => void

  // Dialog states
  showSuccessDialog: boolean
  showErrorDialog: boolean
  successMessage: string
  errorMessage: string
  setShowSuccessDialog: (show: boolean) => void
  setShowErrorDialog: (show: boolean) => void
  setSuccessMessage: (message: string) => void
  setErrorMessage: (message: string) => void
}

export interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
}

export interface UserFormData {
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  role: "ADMIN" | "USER"
  state: string
  district: string
  village?: string
}

export interface ChokhlaFormData {
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  state: string
  district: string
}

export interface VillageFormData {
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
}
