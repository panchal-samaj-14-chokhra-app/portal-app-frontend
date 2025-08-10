export interface FamilyData {
  // Existing properties
  permanentAddress?: string
  currentAddress?: string

  // New address fields (Prisma model updates)
  permanentFamilyDistrict?: string
  permanentFamilyState?: string
  permanentFamilyPincode?: string
  currentFamilyDistrict?: string
  currentFamilyState?: string
  currentFamilyPincode?: string

  // Additional properties can be added here
}
