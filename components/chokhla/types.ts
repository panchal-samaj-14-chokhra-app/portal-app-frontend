export interface ChokhlaProfile {
  id: string
  name: string
  adhyaksh: string
  contactNumber: string
  state: string
  district: string
  villageName: string
  createdDate?: string
  updatedDate?: string
}

export interface Village {
  id: string
  name: string
  villageMemberName: string
  mobileNumber: string
  age: number
  email: string
  tehsil: string
  district: string
  state: string
  isVillageHaveSchool: boolean
  isVillageHavePrimaryHealthCare: boolean
  isVillageHaveCommunityHall: boolean
  longitude?: number
  latitude?: number
}

export interface VillageFormData {
  name: string
  villageMemberName: string
  mobileNumber: string
  age: string
  email: string
  tehsil: string
  district: string
  state: string
  isVillageHaveSchool: boolean
  isVillageHavePrimaryHealthCare: boolean
  isVillageHaveCommunityHall: boolean
  longitude: string
  latitude: string
  password: string
  repeatPassword: string
}

export interface TabItem {
  key: string
  label: string
}

export interface SuccessData {
  user: {
    id: string
    fullName: string
    email: string
    globalRole: string
  }
  village: {
    id: string
    villageMemberName: string
  }
  password: string
}
