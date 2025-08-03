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
  phone?: string
}

export interface Village {
  id: string
  name: string
  state: string
  district: string
  pincode: string
  chokhlaId: string
  chokhlaName: string
  totalFamilies: number
  totalMembers: number
  hasElectricity: boolean
  hasWaterSupply: boolean
  hasSchool: boolean
  hasHealthCenter: boolean
  hasRoadAccess: boolean
  createdAt: string
  updatedAt: string
  latitude?: number
  longitude?: number
}

export interface Chokhla {
  id: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  state: string
  district: string
  status: "active" | "inactive" | "pending"
  totalVillages: number
  totalFamilies: number
  totalMembers: number
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface Statistics {
  totalUsers: number
  totalChokhlas: number
  totalVillages: number
  totalFamilies: number
  totalMembers: number
  activeUsers: number
  pendingUsers: number
  recentRegistrations: number
  villagesByState: Record<string, number>
  usersByRole: Record<string, number>
  monthlyGrowth: Array<{
    month: string
    users: number
    villages: number
    families: number
  }>
}

export interface SuperAdminProfile {
  id: string
  name: string
  email: string
  role: "superadmin"
  createdAt: string
  lastLogin: string
  permissions: string[]
}

export interface DialogState {
  isOpen: boolean
  title: string
  message: string
  details?: Record<string, any>
  onRetry?: () => void
}

export interface SuperAdminContextType {
  // Data
  users: User[]
  villages: Village[]
  chokhlas: Chokhla[]
  statistics: Statistics
  profile: SuperAdminProfile | null

  // Loading states
  isLoadingUsers: boolean
  isLoadingVillages: boolean
  isLoadingChokhlas: boolean
  isLoadingStatistics: boolean
  isLoadingProfile: boolean

  // Actions
  refreshUsers: () => Promise<void>
  refreshVillages: () => Promise<void>
  refreshChokhlas: () => Promise<void>
  refreshStatistics: () => Promise<void>
  refreshProfile: () => Promise<void>

  // User management
  createUser: (userData: Partial<User>) => Promise<void>
  updateUser: (id: string, userData: Partial<User>) => Promise<void>
  deleteUser: (id: string) => Promise<void>

  // Village management
  createVillage: (villageData: Partial<Village>) => Promise<void>
  updateVillage: (id: string, villageData: Partial<Village>) => Promise<void>
  deleteVillage: (id: string) => Promise<void>

  // Chokhla management
  createChokhla: (chokhlaData: Partial<Chokhla>) => Promise<void>
  updateChokhla: (id: string, chokhlaData: Partial<Chokhla>) => Promise<void>
  deleteChokhla: (id: string) => Promise<void>
}

export type TabType = "dashboard" | "users" | "villages" | "chokhlas" | "statistics" | "profile"

export interface SidebarItem {
  id: TabType
  label: string
  icon: string
  description?: string
}
