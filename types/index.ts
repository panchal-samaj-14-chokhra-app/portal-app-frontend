import type React from "react"
// Core entity types
export interface User {
  id: string
  email: string
  name: string
  role: "superadmin" | "admin" | "user"
  token?: string
  choklaId?: string
  villageId?: string
  createdAt?: string
  updatedAt?: string
}

export interface Person {
  id: string
  name: string
  age: number
  gender: "male" | "female" | "other"
  relation: string
  education?: string
  occupation?: string
  maritalStatus?: "single" | "married" | "divorced" | "widowed"
  phone?: string
  email?: string
  familyId: string
  createdAt?: string
  updatedAt?: string
}

export interface Family {
  id: string
  headName: string
  address: string
  phone?: string
  email?: string
  villageId: string
  village?: Village
  members: Person[]
  totalMembers: number
  createdAt?: string
  updatedAt?: string
}

export interface Village {
  id: string
  name: string
  code: string
  choklaId: string
  chokhla?: Chokhla
  families: Family[]
  totalFamilies: number
  totalMembers: number
  createdAt?: string
  updatedAt?: string
}

export interface Chokhla {
  id: string
  name: string
  code: string
  villages: Village[]
  totalVillages: number
  totalFamilies: number
  totalMembers: number
  createdAt?: string
  updatedAt?: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form payload types
export interface CreatePersonPayload {
  name: string
  age: number
  gender: "male" | "female" | "other"
  relation: string
  education?: string
  occupation?: string
  maritalStatus?: "single" | "married" | "divorced" | "widowed"
  phone?: string
  email?: string
}

export interface CreateFamilyPayload {
  headName: string
  address: string
  phone?: string
  email?: string
  villageId: string
  members: CreatePersonPayload[]
}

export interface CreateVillagePayload {
  name: string
  code: string
  choklaId: string
}

export interface CreateChokhlaPayload {
  name: string
  code: string
}

export interface UpdateFamilyPayload extends Partial<CreateFamilyPayload> {
  id: string
}

export interface UpdatePersonPayload extends Partial<CreatePersonPayload> {
  id: string
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

// Form state types
export interface FormErrors {
  [key: string]: string | undefined
}

export interface FormState<T> {
  data: T
  errors: FormErrors
  isSubmitting: boolean
  isValid: boolean
}

// Table types
export interface TableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  onSort?: (key: string, direction: "asc" | "desc") => void
  onRowClick?: (row: T) => void
}

// Statistics types
export interface DashboardStats {
  totalChokhlas: number
  totalVillages: number
  totalFamilies: number
  totalMembers: number
  recentFamilies: Family[]
  villageStats: {
    villageId: string
    villageName: string
    familyCount: number
    memberCount: number
  }[]
}

// Request types
export interface FamilyRequest {
  id: string
  type: "create" | "update" | "delete"
  status: "pending" | "approved" | "rejected"
  familyData: CreateFamilyPayload | UpdateFamilyPayload
  requestedBy: string
  requestedAt: string
  reviewedBy?: string
  reviewedAt?: string
  comments?: string
}

// Chanda (donation) types
export interface ChandaRecord {
  id: string
  familyId: string
  family: Family
  amount: number
  year: number
  status: "paid" | "pending" | "overdue"
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export interface ChandaSummary {
  totalCollected: number
  totalPending: number
  totalOverdue: number
  villageWiseBreakdown: {
    villageId: string
    villageName: string
    collected: number
    pending: number
    overdue: number
  }[]
}
