import type { FamilyData, FamilyMember } from "./types"

export const calculateAge = (dateOfBirth: string): number => {
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

export const validateForm = (familyData: FamilyData, isDraft = false): Record<string, string> => {
  const newErrors: Record<string, string> = {}

  // For draft, we can be more lenient with validation
  if (!isDraft) {
    // Check if there's exactly one Mukhiya
    const mukhiyaCount = familyData.members.filter((m) => m.isMukhiya).length
    if (mukhiyaCount === 0) {
      newErrors.mukhiya = "कम से कम एक मुखिया होना आवश्यक है"
    } else if (mukhiyaCount > 1) {
      newErrors.mukhiya = "केवल एक मुखिया हो सकता है"
    }

    // Check for unique mobile numbers
    const mobileNumbers = familyData.members.map((m) => m.mobileNumber).filter(Boolean)
    const duplicateMobile = mobileNumbers.find((num, index) => mobileNumbers.indexOf(num) !== index)
    if (duplicateMobile) {
      newErrors.mobile = `मोबाइल नंबर ${duplicateMobile} डुप्लिकेट है`
    }

    // Check required fields for each member
    familyData.members.forEach((member, index) => {
      if (!member.firstName.trim()) {
        newErrors[`member-${index}-firstName`] = "पहला नाम आवश्यक है"
      }
      if (!member.lastName.trim()) {
        newErrors[`member-${index}-lastName`] = "अंतिम नाम आवश्यक है"
      }
      if (!member.dateOfBirth) {
        newErrors[`member-${index}-dob`] = "जन्म तिथि आवश्यक है"
      }
    })

    // Check economic status is selected
    if (!familyData.economicStatus) {
      newErrors.economicStatus = "आर्थिक स्थिति का चयन आवश्यक है"
    }
  }

  // Validate format for filled fields (both draft and final)
  familyData.members.forEach((member, index) => {
    if (member.mobileNumber && !/^[6-9]\d{9}$/.test(member.mobileNumber)) {
      newErrors[`member-${index}-mobile`] = "वैध मोबाइल नंबर दर्ज करें"
    }
    if (member.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
      newErrors[`member-${index}-email`] = "वैध ईमेल पता दर्ज करें"
    }
    if (member.dateOfBirth) {
      const birthDate = new Date(member.dateOfBirth)
      const today = new Date()
      if (birthDate > today) {
        newErrors[`member-${index}-dob`] = "जन्म तिथि भविष्य में नहीं हो सकती"
      }
    }
    if (member.pincode && !/^\d{6}$/.test(member.pincode)) {
      newErrors[`member-${index}-pincode`] = "पिनकोड 6 अंकों का होना चाहिए"
    }
  })

  // Validate family pincode
  if (familyData.familyPincode && !/^\d{6}$/.test(familyData.familyPincode)) {
    newErrors.familyPincode = "पिनकोड 6 अंकों का होना चाहिए"
  }

  // Business validation for members with business occupation
  familyData.members.forEach((member, index) => {
    if (member.occupationType === "business") {
      if (!member.nameOfBusiness?.trim()) {
        newErrors[`member-${index}-businessName`] = "व्यापार का नाम आवश्यक है"
      }
      if (!member.businessCategory) {
        newErrors[`member-${index}-businessCategory`] = "व्यापार की श्रेणी आवश्यक है"
      }
      if (!member.sizeOfBusiness) {
        newErrors[`member-${index}-businessSize`] = "व्यापार का आकार आवश्यक है"
      }
    }
  })

  return newErrors
}

export const transformMembersForAPI = (members: FamilyMember[]) => {
  return members.map((member) => ({
    firstName: member.firstName,
    lastName: member.lastName,
    dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString() : null,
    age: member.age,
    gender: member.gender,
    relation: member.isMukhiya ? "Mukhiya" : member.relation,
    maritalStatus:
      member.maritalStatus === "unmarried"
        ? "Unmarried"
        : member.maritalStatus === "married"
          ? "Married"
          : member.maritalStatus === "widowed"
            ? "Widowed"
            : member.maritalStatus === "divorced"
              ? "Divorced"
              : member.maritalStatus === "separated"
                ? "Separated"
                : member.maritalStatus === "engaged"
                  ? "Engaged"
                  : member.maritalStatus === "remarried"
                    ? "Remarried"
                    : member.maritalStatus,
    gotra: member.gotra,
    disability: member.disability,
    bloodGroup: member.bloodGroup,
    mobileNumber: member.mobileNumber,
    email: member.email,
    permanentAddress: member.permanentAddress,
    currentAddress: member.currentAddress,
    state: member.state,
    district: member.district,
    pincode: member.pincode,
    village: member.village,
    isCurrentAddressInIndia: member.isCurrentAddressInIndia,
    currentCountry: member.currentCountry,
    isStudent: member.isStudent,
    educationLevel:
      member.educationLevel === "illiterate"
        ? "Illiterate"
        : member.educationLevel === "primary"
          ? "Primary"
          : member.educationLevel === "middle"
            ? "Middle"
            : member.educationLevel === "secondary"
              ? "Secondary"
              : member.educationLevel === "higher_secondary"
                ? "Higher Secondary"
                : member.educationLevel === "undergraduate"
                  ? "Graduate"
                  : member.educationLevel === "postgraduate"
                    ? "Post Graduate"
                    : member.educationLevel === "doctorate"
                      ? "Doctorate"
                      : member.educationLevel === "diploma"
                        ? "Diploma"
                        : member.educationLevel === "certificate"
                          ? "Certificate"
                          : member.educationLevel,
    classCompleted: member.classCompleted,
    currentClass: member.currentClass || null,
    collegeCourse: member.collegeCourse,
    institutionName: member.institutionName,
    enrollmentStatus: member.enrollmentStatus || null,
    schoolName: member.schoolName || null,
    higherEducationType: member.higherEducationType || null,
    currentEducationCity: member.currentEducationCity || null,
    currentEducationCountry: member.currentEducationCountry || null,
    isHelpRequiredFromSamaj: member.isHelpRequiredFromSamaj,
    isCurrentlyEnrolled: member.isCurrentlyEnrolled || false,
    dropoutReason: member.dropoutReason || null,
    educationMode: member.educationMode || null,
    isStudyingAbroad: member.isStudyingAbroad,
    scholarshipReceived: member.scholarshipReceived,
    scholarshipDetails: member.scholarshipDetails || null,
    boardOrUniversity: member.boardOrUniversity || null,
    yearOfPassing: member.yearOfPassing || null,
    fieldOfStudy: member.fieldOfStudy || null,
    isEmployed: member.isEmployed,
    occupationType: member.occupationType || null,
    employmentStatus: member.employmentStatus || null,
    monthlyIncome: member.monthlyIncome || null,
    incomeSourceCountry: member.incomeSourceCountry,
    countryName: member.countryName || null,
    jobCategory: member.jobCategory || null,
    employerOrganizationName: member.employerOrganizationName || null,
    isGovernmentJob: member.isGovernmentJob,
    jobPosition: member.jobPosition || null,
    jobType: member.jobType || null,
    workExperienceYears: member.workExperienceYears || null,
    isSelfEmployed: member.isSelfEmployed,
    selfEmployedJobType: member.selfEmployedJobType || null,
    nameOfBusiness: member.nameOfBusiness || null,
    businessCategory: member.businessCategory || null,
    sizeOfBusiness: member.sizeOfBusiness || null,
    businessRegistration: member.businessRegistration,
    willingToHirePeople: member.willingToHirePeople,
    occupationState: member.occupationState || null,
    occupationCity: member.occupationCity || null,
    preferredJobLocation: member.preferredJobLocation || null,
    isOpenToRelocate: member.isOpenToRelocate,
    workingHoursPerWeek: member.workingHoursPerWeek || null,
    hasAdditionalSkills: member.hasAdditionalSkills,
    livestock: member.livestock,
    landOwned: member.landOwned,
    houseType:
      member.houseType === "kutcha"
        ? "Kutcha"
        : member.houseType === "pucca"
          ? "Pucca"
          : member.houseType === "semi_pucca"
            ? "Semi Pucca"
            : member.houseType,
    houseOwnership:
      member.houseOwnership === "owned"
        ? "Owned"
        : member.houseOwnership === "rented"
          ? "Rented"
          : member.houseOwnership === "family"
            ? "Family"
            : member.houseOwnership === "government"
              ? "Government"
              : member.houseOwnership,
    hasElectricity: member.hasElectricity,
    waterSource:
      member.waterSource === "tap"
        ? "Tap"
        : member.waterSource === "well"
          ? "Well"
          : member.waterSource === "hand_pump"
            ? "Hand Pump"
            : member.waterSource === "borewell"
              ? "Borewell"
              : member.waterSource === "river"
                ? "River"
                : member.waterSource,
    hasToilet: member.hasToilet,
    cookingFuel:
      member.cookingFuel === "lpg"
        ? "LPG"
        : member.cookingFuel === "firewood"
          ? "Firewood"
          : member.cookingFuel === "kerosene"
            ? "Kerosene"
            : member.cookingFuel === "cow_dung"
              ? "Cow Dung"
              : member.cookingFuel === "coal"
                ? "Coal"
                : member.cookingFuel,
    hasHealthIssues: member.hasHealthIssues,
    chronicDisease: member.chronicDisease,
    isVaccinated: member.isVaccinated,
    hasHealthInsurance: member.hasHealthInsurance,
    isInterestedInFutureHealthPolicy: member.isInterestedInFutureHealthPolicy,
    hasSmartphone: member.hasSmartphone,
    hasInternet: member.hasInternet,
    hasBankAccount: member.hasBankAccount,
    hasJanDhan: member.hasJanDhan,
    isMukhiya: member.isMukhiya,
    welfareSchemes: member.welfareSchemes,
    isInterestedInFutureSamuhikVivah: member.isInterestedInFutureSamuhikVivah,
    vehicleType: member.vehicleType,
  }))
}
