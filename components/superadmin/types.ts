export interface User {
  id: string
  email: string
  fullName: string
  globalRole: string
  isActive: boolean
  createdAt: string
}

export interface Village {
  id: string
  name: string
  villageMemberName: string
  district: string
  state: string
}

export interface Chokhla {
  id: string
  name: string
  adhyaksh: string
  contactNumber: string
  state: string
  district: string
  villageName: string
}

export interface ChokhlaFormData {
  name: string
  adhyaksh: string
  contactNumber: string
  state: string
  district: string
  villageName: string
  email: string
  password: string
  repeatPassword: string
}

export interface CreatedChokhlaData {
  chokhlaId: string
  userId: string
  email: string
  fullName: string
  role: string
  password: string
}

export interface FormErrors {
  name?: string
  adhyaksh?: string
  contactNumber?: string
  state?: string
  district?: string
  villageName?: string
  email?: string
  password?: string
  repeatPassword?: string
}

export type TabKey = "village" | "chokhla" | "statics" | "user" | "profile"
