export interface User {
  id: string
  name: string
  email: string
  role: "superadmin" | "chokhla" | "village"
  status: "active" | "inactive" | "pending"
  createdAt: string
  lastLogin?: string
  village?: string
  chokhla?: string
}

export interface Village {
  id: string
  name: string
  chokhlaId: string
  chokhlaName: string
  totalFamilies: number
  totalMembers: number
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface Chokhla {
  id: string
  name: string
  email: string
  phone: string
  totalVillages: number
  totalFamilies: number
  totalMembers: number
  status: "active" | "inactive"
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
  name: string
  email: string
  phone: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UserFormData {
  name: string
  email: string
  role: "chokhla" | "village"
  village?: string
  chokhla?: string
}

export interface ChokhlasFormData {
  name: string
  email: string
  phone: string
}

export interface VillageFormData {
  name: string
  chokhlaId: string
}
