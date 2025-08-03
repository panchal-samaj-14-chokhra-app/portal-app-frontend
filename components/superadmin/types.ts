export interface User {
  id: string
  name: string
  email: string
  role: "superadmin" | "chokhla" | "village_admin"
  status: "active" | "inactive" | "pending"
  createdAt: string
  lastLogin?: string
  village?: string
  chokhla?: string
}

export interface Village {
  id: string
  name: string
  state: string
  district: string
  pincode: string
  population: number
  families: number
  chokhlaId: string
  chokhlaName: string
  adminId?: string
  adminName?: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface Chokhla {
  id: string
  name: string
  email: string
  phone: string
  state: string
  district: string
  villages: number
  totalPopulation: number
  status: "active" | "inactive" | "pending"
  createdAt: string
  updatedAt: string
}

export interface Statistics {
  totalUsers: number
  totalVillages: number
  totalChokhlas: number
  totalPopulation: number
  activeUsers: number
  pendingUsers: number
  recentRegistrations: number
  monthlyGrowth: number
}

export interface SuperAdminProfile {
  id: string
  name: string
  email: string
  phone: string
  role: "superadmin"
  createdAt: string
  lastLogin: string
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

  // CRUD operations
  createUser: (userData: Partial<User>) => Promise<void>
  updateUser: (id: string, userData: Partial<User>) => Promise<void>
  deleteUser: (id: string) => Promise<void>

  createVillage: (villageData: Partial<Village>) => Promise<void>
  updateVillage: (id: string, villageData: Partial<Village>) => Promise<void>
  deleteVillage: (id: string) => Promise<void>

  createChokhla: (chokhlaData: Partial<Chokhla>) => Promise<void>
  updateChokhla: (id: string, chokhlaData: Partial<Chokhla>) => Promise<void>
  deleteChokhla: (id: string) => Promise<void>

  updateProfile: (profileData: Partial<SuperAdminProfile>) => Promise<void>

  // Refresh functions
  refreshUsers: () => Promise<void>
  refreshVillages: () => Promise<void>
  refreshChokhlas: () => Promise<void>
  refreshStatistics: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export interface UserFormData {
  name: string
  email: string
  role: "chokhla" | "village_admin"
  village?: string
  chokhla?: string
}

export interface VillageFormData {
  name: string
  state: string
  district: string
  pincode: string
  chokhlaId: string
}

export interface ChokhlaFormData {
  name: string
  email: string
  phone: string
  state: string
  district: string
}

export interface ProfileFormData {
  name: string
  email: string
  phone: string
}
