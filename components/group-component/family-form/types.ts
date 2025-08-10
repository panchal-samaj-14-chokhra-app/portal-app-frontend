export interface FamilyMember {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  age: number
  gender: "MALE" | "FEMALE" | "OTHER"
  relation: string
  maritalStatus: string
  gotra: string
  disability: boolean
  bloodGroup: string
  mobileNumber: string
  email: string

  // Legacy address fields (kept for backward compatibility where still used)
  permanentAddress: string
  currentAddress: string
  state: string
  district: string
  pincode: string
  village: string
  isCurrentAddressInIndia: boolean
  currentCountry: string

  // New Person address fields (Prisma)
  personPermanentAddress: string
  personPermanentState: string
  personPermanentDistrict: string
  personPermanentPincode: string
  personPermanentVillage: string

  personCurrentAddress: string
  personCurrentState: string
  personCurrentDistrict: string
  personCurrentPincode: string
  personCurrentVillage: string

  // Educational Details
  isStudent: boolean
  educationLevel: string
  classCompleted: string
  currentClass?: string
  collegeCourse: string
  institutionName: string
  enrollmentStatus?: string
  schoolName?: string
  higherEducationType?: string
  currentEducationCity?: string
  currentEducationCountry?: string
  isHelpRequiredFromSamaj: boolean
  isCurrentlyEnrolled?: boolean
  dropoutReason?: string
  educationMode?: string
  isStudyingAbroad?: boolean
  scholarshipReceived?: boolean
  scholarshipDetails?: string
  boardOrUniversity?: string
  yearOfPassing?: number
  fieldOfStudy?: string

  // Employment details
  isEmployed: boolean
  isSeekingJob?: boolean
  occupationType?: string
  employmentStatus?: string
  monthlyIncome?: number
  incomeSourceCountry: boolean
  incomeSourceCountryName?: string
  countryName?: string
  jobCategory?: string
  employerOrganizationName?: string
  isGovernmentJob?: boolean
  jobPosition?: string
  jobType?: string
  workExperienceYears?: number
  isSelfEmployed?: boolean
  selfEmployedJobType?: string
  nameOfBusiness?: string
  businessCategory?: string
  businessType?: string
  customBusinessType?: string
  numberOfEmployees?: number
  sizeOfBusiness?: string
  businessRegistration?: boolean
  isBusinessRegistered?: boolean
  willingToHirePeople?: boolean
  needsEmployees?: boolean
  occupationState?: string
  occupationCity?: string
  preferredJobLocation?: string
  preferredSector?: string
  isOpenToRelocate?: boolean
  workingHoursPerWeek?: number
  hasAdditionalSkills?: boolean
  jobSearchSector?: string
  customJobSearchSector?: string
  wantsToGoAbroad?: boolean
  hasPassport?: boolean

  // Living status
  livestock: string
  landOwned: number
  houseType: string
  houseOwnership: string
  hasElectricity: boolean
  waterSource: string
  hasToilet: boolean
  cookingFuel: string

  // Health issues
  hasHealthIssues: boolean
  chronicDisease: string
  isVaccinated: boolean
  hasHealthInsurance: boolean
  isInterestedInFutureHealthPolicy: boolean

  // Welfare schemes and survey
  hasSmartphone: boolean
  hasInternet: boolean
  hasBankAccount: boolean
  hasJanDhan: boolean
  isMukhiya: boolean
  welfareSchemes: string[]
  isInterestedInFutureSamuhikVivah: boolean
  vehicleType: "NONE" | "BICYCLE" | "MOTORCYCLE" | "CAR" | "TRUCK" | "OTHER"
}

export interface FamilyData {
  mukhiyaName: string
  currentAddress: string
  permanentAddress: string
  status: string
  economicStatus: string
  longitude?: number | null
  latitude?: number | null
  anyComment: string

  // Legacy family-level fields (kept for compatibility)
  familyDistrict: string
  familyState: string
  familyPincode: string

  // New family-level address fields (likely added in your Prisma Family model)
  permanentFamilyDistrict?: string
  permanentFamilyState?: string
  permanentFamilyPincode?: string
  permanentFamilyVillage?: string
  currentFamilyDistrict?: string
  currentFamilyState?: string
  currentFamilyPincode?: string
  currentFamilyVillage?: string

  members: FamilyMember[]
}

export interface FamilyFormProps {
  mode: "add" | "edit"
  familyId?: string
  onSuccess?: () => void
}

export interface MemberFormProps {
  member: FamilyMember
  index: number
  errors: Record<string, string>
  onUpdateMember: (memberId: string, field: keyof FamilyMember, value: any) => void
  onCopyFamilyAddress: (memberId: string) => void
  familyData: FamilyData
}
