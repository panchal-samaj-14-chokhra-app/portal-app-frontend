"use client"

import type React from "react"

import { useState } from "react"
import { useCreateMember, useUpdatePerson } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { useParams } from "next/navigation"
import { UserCheck, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { MemberFormProps } from "./types"
import { PersonalInfoSection } from "./personal-info-section"
import { AddressInfoSection } from "./address-info-section"
import { EducationInfoSection } from "./education-info-section"
import { EmploymentInfoSection } from "./employment-info-section"
import { LivingStatusSection } from "./living-status-section"
import { HealthInfoSection } from "./health-info-section"
import { DigitalAccessSection } from "./digital-access-section"
import { initialMember } from "../family-form/constants"
import { useRouter } from "next/navigation"

interface ExtendedMemberFormProps extends Omit<MemberFormProps, "member" | "onUpdateMember" | "familyData"> {
  onRemoveMember: (memberId: string) => void
  membersCount: number
  fetchedData: any
}

export function MemberForm(props: ExtendedMemberFormProps) {
  const { index, errors, fetchedData } = props
  const [member, setMember] = useState(() => ({
    ...initialMember,
    ...fetchedData,
  }))

  const router = useRouter()
  const { mutate: updatePerson } = useUpdatePerson()

  const memberName =
    member.firstName || member.lastName ? `${member.firstName} ${member.lastName}`.trim() : `सदस्य ${index + 1}`

  const hasErrors = Object.keys(errors).some((key) => key.startsWith(`member_${index}_`))
  const [loading, setLoading] = useState(false)

  // Dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const { mutate: createMember } = useCreateMember()
  const params = useParams()
  const villageId = params?.villageId as string
  const familyId = params?.familyId || ""

  // Local update handler
  const handleUpdateMember = (field: string, value: any) => {
    setMember((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...member,
      villageId,
      familyId,
    }

    if (member.id) {
      // Update existing member
      updatePerson(
        { id: member.id, payload },
        {
          onSuccess: () => {
            setLoading(false)
            setShowSuccessDialog(true)
          },
          onError: (error: any) => {
            setLoading(false)
            setErrorMessage(error?.message || "सदस्य की जानकारी अपडेट करने में त्रुटि हुई")
            setShowErrorDialog(true)
          },
        },
      )
    } else {
      // Create new member
      createMember(payload, {
        onSuccess: () => {
          setLoading(false)
          setShowSuccessDialog(true)
        },
        onError: (error: any) => {
          setLoading(false)
          setErrorMessage(error?.message || "नया सदस्य जोड़ने में त्रुटि हुई")
          setShowErrorDialog(true)
        },
      })
    }
  }

  const handleSuccessClose = () => {
    setShowSuccessDialog(false)
    router.back()
  }

  const handleErrorClose = () => {
    setShowErrorDialog(false)
    setErrorMessage("")
  }

  // --- End of function logic, now return JSX ---
  return (
    <>
      <form className="border rounded-lg overflow-hidden p-4 bg-white" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between w-full mr-4">
          <div className="flex items-center gap-2">
            <span className="font-medium hindi-text text-sm sm:text-base">{memberName}</span>
            {member.isMukhiya && (
              <Badge className="bg-orange-100 text-orange-700 text-xs">
                <UserCheck className="w-3 h-3 mr-1" />
                मुखिया
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {member.age > 0 && (
              <Badge variant="outline" className="text-xs">
                {member.age} वर्ष
              </Badge>
            )}
            {member.relation && (
              <Badge variant="outline" className="text-xs">
                {member.relation}
              </Badge>
            )}
            {member.mobileNumber && (
              <Badge variant="outline" className="text-xs">
                📱 {member.mobileNumber}
              </Badge>
            )}
          </div>
        </div>

        {hasErrors && (
          <Alert className="border-red-200 bg-red-50 mt-4">
            <AlertDescription className="text-red-800 text-sm hindi-text">
              कृपया नीचे दी गई त्रुटियों को ठीक करें
            </AlertDescription>
          </Alert>
        )}

        {/* Personal Information */}
        <PersonalInfoSection
          member={member}
          index={index}
          errors={errors}
          onUpdateMember={(_, field, value) => handleUpdateMember(field, value)}
        />

        {/* Address Information */}
        <AddressInfoSection
          member={member}
          index={index}
          errors={errors}
          onUpdateMember={(_, field, value) => handleUpdateMember(field, value)}
        />

        {/* Education Information */}
        <EducationInfoSection
          member={member}
          index={index}
          errors={errors}
          onUpdateMember={(_, field, value) => handleUpdateMember(field, value)}
        />

        {/* Employment Information */}
        <EmploymentInfoSection
          member={member}
          index={index}
          errors={errors}
          onUpdateMember={(_, field, value) => handleUpdateMember(field, value)}
        />

        {/* Living Status */}
        <LivingStatusSection
          member={member}
          index={index}
          errors={errors}
          onUpdateMember={(_, field, value) => handleUpdateMember(field, value)}
        />

        {/* Health Information */}
        <HealthInfoSection
          member={member}
          index={index}
          errors={errors}
          onUpdateMember={(_, field, value) => handleUpdateMember(field, value)}
        />

        {/* Digital Access and Welfare */}
        <DigitalAccessSection
          member={member}
          index={index}
          errors={errors}
          onUpdateMember={(_, field, value) => handleUpdateMember(field, value)}
        />

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "सेव कर रहे हैं..." : member.id ? "अपडेट करें" : "सबमिट करें"}
          </Button>
        </div>
      </form>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <DialogTitle className="text-green-800 hindi-text">सफलतापूर्वक सेव हो गया!</DialogTitle>
            </div>
            <DialogDescription className="hindi-text text-gray-600">
              {member.id ? "सदस्य की जानकारी सफलतापूर्वक अपडेट हो गई है।" : "नया सदस्य सफलतापूर्वक जोड़ा गया है।"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleSuccessClose} className="bg-green-600 hover:bg-green-700">
              ठीक है
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-600" />
              <DialogTitle className="text-red-800 hindi-text">त्रुटि हुई!</DialogTitle>
            </div>
            <DialogDescription className="hindi-text text-gray-600">{errorMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={handleErrorClose}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
            >
              बंद करें
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
