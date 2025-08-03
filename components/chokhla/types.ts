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
  latitude?: number
  longitude?: number
  createdAt: string
  updatedAt: string
}

export interface ChokhlaProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  state: string
  district: string
  address: string
  totalVillages: number
  totalFamilies: number
  totalMembers: number
  createdAt: string
  updatedAt: string
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

export interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  state: string
  district: string
  address: string
}
