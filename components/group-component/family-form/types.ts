import type { FamilyMember } from "./family-member" // Assuming FamilyMember is declared in another file

export interface FamilyData {
  // Identity and status
  mukhiyaName: string
  status: string
  economicStatus: string

  // Geolocation
  longitude?: number | null
  latitude?: number | null

  // Comments
  anyComment: string

  // Legacy family-level address fields (kept for backward compatibility where used)
  familyDistrict: string
  familyState: string
  familyPincode: string

  // Existing address text fields
  permanentAddress: string
  currentAddress: string

  // New address model fields (Prisma)
  permanentFamilyDistrict: string
  permanentFamilyState: string
  permanentFamilyPincode: string
  permanentFamilyVillage: string

  currentFamilyDistrict: string
  currentFamilyState: string
  currentFamilyPincode: string
  currentFamilyVillage: string

  // Members
  members: FamilyMember[]
}
