"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Trash2, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { MemberFormProps } from "./types"
import { PersonalInfoSection } from "./personal-info-section"
import { AddressInfoSection } from "./address-info-section"
import { EducationInfoSection } from "./education-info-section"
import { EmploymentInfoSection } from "./employment-info-section"
import { LivingStatusSection } from "./living-status-section"
import { HealthInfoSection } from "./health-info-section"
import { DigitalAccessSection } from "./digital-access-section"

interface ExtendedMemberFormProps extends MemberFormProps {
  onRemoveMember: (memberId: string) => void
  membersCount: number
}

export function MemberForm({
  member,
  index,
  errors,
  onUpdateMember,
  onCopyFamilyAddress,
  familyData,
  onRemoveMember,
  membersCount,
}: ExtendedMemberFormProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0)

  const memberName =
    member.firstName || member.lastName ? `${member.firstName} ${member.lastName}`.trim() : `सदस्य ${index + 1}`

  const hasErrors = Object.keys(errors).some((key) => key.startsWith(`member_${index}_`))

  const handleRemove = () => {
    if (member.isMukhiya) {
      alert("मुखिया को हटाया नहीं जा सकता। पहले किसी और को मुखिया बनाएं।")
      return
    }

    if (membersCount <= 1) {
      alert("कम से कम एक सदस्य होना आवश्यक है")
      return
    }

    if (confirm(`क्या आप ${memberName} को हटाना चाहते हैं?`)) {
      onRemoveMember(member.id)
    }
  }

  return (
    <AccordionItem value={member.id} className="border rounded-lg overflow-hidden">
      <AccordionTrigger
        className="px-4 py-3 hover:no-underline bg-gray-50 hover:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between w-full mr-4">
          <div className="flex items-center gap-3">
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

          <div className="flex items-center gap-2">
            {hasErrors && (
              <Badge variant="destructive" className="text-xs">
                त्रुटि
              </Badge>
            )}

            {membersCount > 1 && !member.isMukhiya && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-0 pb-0">
        <div className="p-4 space-y-6">
          {hasErrors && (
            <Alert className="border-red-200 bg-red-50">
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
            onUpdateMember={onUpdateMember}
            onCopyFamilyAddress={onCopyFamilyAddress}
            familyData={familyData}
          />

          {/* Address Information */}
          <AddressInfoSection
            member={member}
            index={index}
            errors={errors}
            onUpdateMember={onUpdateMember}
            onCopyFamilyAddress={onCopyFamilyAddress}
            familyData={familyData}
          />

          {/* Education Information */}
          <EducationInfoSection
            member={member}
            index={index}
            errors={errors}
            onUpdateMember={onUpdateMember}
            onCopyFamilyAddress={onCopyFamilyAddress}
            familyData={familyData}
          />

          {/* Employment Information */}
          <EmploymentInfoSection
            member={member}
            index={index}
            errors={errors}
            onUpdateMember={onUpdateMember}
            onCopyFamilyAddress={onCopyFamilyAddress}
            familyData={familyData}
          />

          {/* Living Status */}
          <LivingStatusSection
            member={member}
            index={index}
            errors={errors}
            onUpdateMember={onUpdateMember}
            onCopyFamilyAddress={onCopyFamilyAddress}
            familyData={familyData}
          />

          {/* Health Information */}
          <HealthInfoSection
            member={member}
            index={index}
            errors={errors}
            onUpdateMember={onUpdateMember}
            onCopyFamilyAddress={onCopyFamilyAddress}
            familyData={familyData}
          />

          {/* Digital Access and Welfare */}
          <DigitalAccessSection
            member={member}
            index={index}
            errors={errors}
            onUpdateMember={onUpdateMember}
            onCopyFamilyAddress={onCopyFamilyAddress}
            familyData={familyData}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
