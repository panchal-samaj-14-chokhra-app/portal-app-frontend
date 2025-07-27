import request from "@/config/request"

// Define proper interfaces for API responses and requests
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
  longitude: number
  latitude: number
  choklaId: string
  chakolaName?: string
  createdDate: string
  updatedDate: string
  families?: Family[]
  genderCount: {
    MALE: number
    FEMALE: number
    OTHER: number
  }
}

export interface Family {
  id: string
  mukhiyaName: string
  currentAddress: string
  permanentAddress: string
  economicStatus: string
  status: string
  villageId: string
  contactNumber?: string
  createdAt: string
  updatedAt: string
  createdDate: string
  updatedDate: string
  verificationStatus: string
  Person: Person[]
  genderCount: {
    MALE: number
    FEMALE: number
    OTHER: number
  }
}

export interface Person {
  id: string
  fullName: string
  name: string
  aadhaarNumber: string
  dateOfBirth: string
  age: number
  gender: "MALE" | "FEMALE" | "OTHER"
  relation: string
  maritalStatus: string
  religion: string
  caste: string
  disability: boolean
  bloodGroup: string
  mobileNumber: string
  email: string
  permanentAddress: string
  currentAddress: string
  isCurrentAddressInIndia: boolean
  currentCountry: string
  village: string
  pincode: string
  district: string
  state: string
  isStudent: boolean
  educationLevel: string
  classCompleted: string
  currentClass: string
  collegeCourse: string
  institutionName: string
  enrollmentStatus: string
  dropoutReason?: string
  schoolName?: string
  higherEducationType: string
  isEmployed: boolean
  occupation: string
  monthlyIncome: number
  incomeSource: string
  isIncomeSourceInIndia: boolean
  incomeSourceCountry: string
  serviceType: string
  landOwned: number
  livestock: string
  houseType: string
  houseOwnership: string
  hasElectricity: boolean
  waterSource: string
  hasToilet: boolean
  cookingFuel: string
  hasHealthIssues: boolean
  chronicDisease?: string
  isVaccinated: boolean
  welfareSchemes: string[]
  hasHealthInsurance: boolean
  hasSmartphone: boolean
  hasInternet: boolean
  hasBankAccount: boolean
  hasJanDhan: boolean
  isMukhiya: boolean
  familyId: string
}

export interface Chokhla {
  id: string
  name: string
  adhyaksh: string
  contactNumber: string
  state: string
  district: string
  villageName: string
  createdDate: string
  updatedDate: string
  villages?: Village[]
}

export interface User {
  id: string
  email: string
  fullName: string
  globalRole: string
  isActive: boolean
  createdAt: string
  choklaId?: string
  villageId?: string
}

export interface CreateFamilyPayload {
  currentAddress: string
  permanentAddress: string
  economicStatus: string
  status: "draft" | "submitted"
  mukhiyaName: string
  villageId: string
  chakolaId: string
  members: Omit<Person, "id" | "familyId">[]
}

export interface CreateVillagePayload {
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
  longitude: number
  latitude: number
  password: string
  repeatPassword: string
  chakola: {
    connect: {
      id: string
    }
  }
}

export interface CreateChokhlaPayload {
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

export interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

export const getApiCall = async (): Promise<ApiResponse<any>> => {
  const { data } = await request.get("/")
  return { data }
}

export const createFamily = async (payload: CreateFamilyPayload): Promise<ApiResponse<Family>> => {
  const { data } = await request.post("/family/create", payload)
  return { data }
}

export const updateFamily = async (id: string, payload: Partial<CreateFamilyPayload>): Promise<ApiResponse<Family>> => {
  const { data } = await request.put(`/family/${id}`, payload)
  return { data }
}

export const getFamilyDetails = async (id: string): Promise<Family> => {
  const { data } = await request.get(`/family/${id}`)
  return data
}

export const deleteFamilyWithId = async (id: string): Promise<ApiResponse<void>> => {
  const { data } = await request.delete(`/family/delete/${id}`)
  return data
}

export const getVillageDetails = async (id: string): Promise<Village> => {
  const { data } = await request.get(`/village/${id}`)
  return data
}

export const getAllVillages = async (): Promise<ApiResponse<Village[]>> => {
  const { data } = await request.get("/village")
  return data
}

export const getAllVillagesWithChokhlaID = async (chokhlaID: string): Promise<Village[]> => {
  const { data } = await request.get(`chokhla/getvillage/${chokhlaID}`)
  return data
}

export const createVillage = async (payload: CreateVillagePayload): Promise<ApiResponse<Village>> => {
  const { data } = await request.post("/village/create", payload)
  return data
}

export const getChokhlaDetails = async (id: string): Promise<Chokhla> => {
  const { data } = await request.get(`/chokhla/${id}`)
  return data
}

export const updateChokhla = async (id: string, payload: Partial<Chokhla>): Promise<ApiResponse<Chokhla>> => {
  const { data } = await request.put(`/chokhla/${id}`, payload)
  return data
}

export const getAllChokhlas = async (): Promise<Chokhla[]> => {
  const { data } = await request.get("/chokhla")
  return data
}

export const createChokhla = async (payload: CreateChokhlaPayload): Promise<ApiResponse<Chokhla>> => {
  const { data } = await request.post("/chokhla/create", payload)
  return data
}

export const getAlluserList = async (): Promise<User[]> => {
  const { data } = await request.get("/api/auth/users")
  return data
}
