import type { FamilyData, FamilyMember } from "./types"

export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return Math.max(0, age)
}

export function validateForm(familyData: FamilyData, isDraft = false): Record<string, string> {
  const errors: Record<string, string> = {}

  // Family level validations
  if (!isDraft) {
    if (!familyData.economicStatus) {
      errors.economicStatus = "आर्थिक स्थिति चुनना आवश्यक है"
    }

    if (!familyData.permanentAddress.trim()) {
      errors.permanentAddress = "स्थायी पता आवश्यक है"
    }

    if (!familyData.currentAddress.trim()) {
      errors.currentAddress = "वर्तमान पता आवश्यक है"
    }

    if (familyData.familyPincode && !/^\d{6}$/.test(familyData.familyPincode)) {
      errors.familyPincode = "पिनकोड 6 अंकों का होना चाहिए"
    }
  }

  // Member validations
  const mukhiyaCount = familyData.members.filter((m) => m.isMukhiya).length
  if (mukhiyaCount === 0) {
    errors.mukhiya = "कम से कम एक मुखिया चुनना आवश्यक है"
  } else if (mukhiyaCount > 1) {
    errors.mukhiya = "केवल एक मुखिया हो सकता है"
  }

  // Mobile number validation
  const mobileNumbers = familyData.members.map((m) => m.mobileNumber).filter((mobile) => mobile && mobile.trim())

  const duplicateMobiles = mobileNumbers.filter((mobile, index) => mobileNumbers.indexOf(mobile) !== index)

  if (duplicateMobiles.length > 0) {
    errors.mobile = "मोबाइल नंबर दोहराए नहीं जा सकते"
  }

  // Individual member validations
  familyData.members.forEach((member, index) => {
    const prefix = `member_${index}_`

    if (!isDraft) {
      if (!member.firstName.trim()) {
        errors[`${prefix}firstName`] = "नाम आवश्यक है"
      }

      if (!member.dateOfBirth) {
        errors[`${prefix}dateOfBirth`] = "जन्म तिथि आवश्यक है"
      }

      if (!member.relation) {
        errors[`${prefix}relation`] = "रिश्ता चुनना आवश्यक है"
      }
    }

    // Mobile number format validation
    if (member.mobileNumber && !/^\d{10}$/.test(member.mobileNumber)) {
      errors[`${prefix}mobileNumber`] = "मोबाइल नंबर 10 अंकों का होना चाहिए"
    }

    // Email validation
    if (member.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
      errors[`${prefix}email`] = "ईमेल का प्रारूप सही नहीं है"
    }

    // Pincode validation
    if (member.pincode && !/^\d{6}$/.test(member.pincode)) {
      errors[`${prefix}pincode`] = "पिनकोड 6 अंकों का होना चाहिए"
    }

    // Employment validations
    if (member.isEmployed && !member.occupationType) {
      errors[`${prefix}occupationType`] = "व्यवसाय का प्रकार चुनना आवश्यक है"
    }

    if (member.isEmployed && (!member.monthlyIncome || member.monthlyIncome <= 0)) {
      errors[`${prefix}monthlyIncome`] = "मासिक आय दर्ज करना आवश्यक है"
    }
  })

  return errors
}

export function transformMembersForAPI(members: FamilyMember[]) {
  return members.map((member) => ({
    ...member,
    age: member.age || calculateAge(member.dateOfBirth),
    welfareSchemes: Array.isArray(member.welfareSchemes) ? member.welfareSchemes : [],
    monthlyIncome: member.monthlyIncome || 0,
    landOwned: member.landOwned || 0,
    workExperienceYears: member.workExperienceYears || 0,
    numberOfEmployees: member.numberOfEmployees || 0,
    workingHoursPerWeek: member.workingHoursPerWeek || 0,
    yearOfPassing: member.yearOfPassing || null,
  }))
}

export function transformAPIDataToMembers(apiMembers: any[]): FamilyMember[] {
  return apiMembers.map((member) => ({
    id: member.id || `member-${Date.now()}-${Math.random()}`,
    firstName: member.firstName || "",
    lastName: member.lastName || "",
    dateOfBirth: member.dateOfBirth || "",
    age: member.age || 0,
    gender: member.gender || "MALE",
    relation: member.relation || "",
    maritalStatus: member.maritalStatus || "",
    gotra: member.gotra || "",
    disability: Boolean(member.disability),
    bloodGroup: member.bloodGroup || "",
    mobileNumber: member.mobileNumber || "",
    email: member.email || "",
    permanentAddress: member.permanentAddress || "",
    currentAddress: member.currentAddress || "",
    state: member.state || "",
    district: member.district || "",
    pincode: member.pincode || "",
    village: member.village || "",
    isCurrentAddressInIndia: Boolean(member.isCurrentAddressInIndia ?? true),
    currentCountry: member.currentCountry || "भारत",
    isStudent: Boolean(member.isStudent),
    educationLevel: member.educationLevel || "",
    classCompleted: member.classCompleted || "",
    currentClass: member.currentClass || "",
    collegeCourse: member.collegeCourse || "",
    institutionName: member.institutionName || "",
    enrollmentStatus: member.enrollmentStatus || "",
    schoolName: member.schoolName || "",
    higherEducationType: member.higherEducationType || "",
    currentEducationCity: member.currentEducationCity || "",
    currentEducationCountry: member.currentEducationCountry || "",
    isHelpRequiredFromSamaj: Boolean(member.isHelpRequiredFromSamaj),
    isCurrentlyEnrolled: Boolean(member.isCurrentlyEnrolled),
    dropoutReason: member.dropoutReason || "",
    educationMode: member.educationMode || "",
    isStudyingAbroad: Boolean(member.isStudyingAbroad),
    scholarshipReceived: Boolean(member.scholarshipReceived),
    scholarshipDetails: member.scholarshipDetails || "",
    boardOrUniversity: member.boardOrUniversity || "",
    yearOfPassing: member.yearOfPassing || undefined,
    fieldOfStudy: member.fieldOfStudy || "",
    isEmployed: Boolean(member.isEmployed),
    isSeekingJob: Boolean(member.isSeekingJob),
    occupationType: member.occupationType || "",
    employmentStatus: member.employmentStatus || "",
    monthlyIncome: Number(member.monthlyIncome) || 0,
    incomeSourceCountry: Boolean(member.incomeSourceCountry),
    incomeSourceCountryName: member.incomeSourceCountryName || "",
    countryName: member.countryName || "",
    jobCategory: member.jobCategory || "",
    employerOrganizationName: member.employerOrganizationName || "",
    isGovernmentJob: Boolean(member.isGovernmentJob),
    jobPosition: member.jobPosition || "",
    jobType: member.jobType || "",
    workExperienceYears: Number(member.workExperienceYears) || 0,
    isSelfEmployed: Boolean(member.isSelfEmployed),
    selfEmployedJobType: member.selfEmployedJobType || "",
    nameOfBusiness: member.nameOfBusiness || "",
    businessCategory: member.businessCategory || "",
    businessType: member.businessType || "",
    customBusinessType: member.customBusinessType || "",
    numberOfEmployees: Number(member.numberOfEmployees) || 0,
    sizeOfBusiness: member.sizeOfBusiness || "",
    businessRegistration: Boolean(member.businessRegistration),
    isBusinessRegistered: Boolean(member.isBusinessRegistered),
    willingToHirePeople: Boolean(member.willingToHirePeople),
    needsEmployees: Boolean(member.needsEmployees),
    occupationState: member.occupationState || "",
    occupationCity: member.occupationCity || "",
    preferredJobLocation: member.preferredJobLocation || "",
    preferredSector: member.preferredSector || "",
    isOpenToRelocate: Boolean(member.isOpenToRelocate),
    workingHoursPerWeek: Number(member.workingHoursPerWeek) || 0,
    hasAdditionalSkills: Boolean(member.hasAdditionalSkills),
    jobSearchSector: member.jobSearchSector || "",
    customJobSearchSector: member.customJobSearchSector || "",
    wantsToGoAbroad: Boolean(member.wantsToGoAbroad),
    hasPassport: Boolean(member.hasPassport),
    livestock: member.livestock || "",
    landOwned: Number(member.landOwned) || 0,
    houseType: member.houseType || "",
    houseOwnership: member.houseOwnership || "",
    hasElectricity: Boolean(member.hasElectricity),
    waterSource: member.waterSource || "",
    hasToilet: Boolean(member.hasToilet),
    cookingFuel: member.cookingFuel || "",
    hasHealthIssues: Boolean(member.hasHealthIssues),
    chronicDisease: member.chronicDisease || "",
    isVaccinated: Boolean(member.isVaccinated),
    hasHealthInsurance: Boolean(member.hasHealthInsurance),
    isInterestedInFutureHealthPolicy: Boolean(member.isInterestedInFutureHealthPolicy),
    hasSmartphone: Boolean(member.hasSmartphone),
    hasInternet: Boolean(member.hasInternet),
    hasBankAccount: Boolean(member.hasBankAccount),
    hasJanDhan: Boolean(member.hasJanDhan),
    isMukhiya: Boolean(member.isMukhiya),
    welfareSchemes: Array.isArray(member.welfareSchemes) ? member.welfareSchemes : [],
    isInterestedInFutureSamuhikVivah: Boolean(member.isInterestedInFutureSamuhikVivah),
    vehicleType: member.vehicleType || "NONE",
  }))
}
