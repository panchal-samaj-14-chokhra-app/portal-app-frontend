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

  // Address details
  permanentAddress: string
  currentAddress: string
  state: string
  district: string
  pincode: string
  village: string
  isCurrentAddressInIndia: boolean
  currentCountry: string

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
  occupationType?: string
  employmentStatus?: string
  monthlyIncome?: number
  incomeSourceCountry: boolean
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
  sizeOfBusiness?: string
  businessRegistration?: boolean
  willingToHirePeople?: boolean
  occupationState?: string
  occupationCity?: string
  preferredJobLocation?: string
  isOpenToRelocate?: boolean
  workingHoursPerWeek?: number
  hasAdditionalSkills?: boolean

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
  familyDistrict: string
  familyState: string
  familyPincode: string
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
