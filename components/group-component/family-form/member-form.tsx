"use client"

import { User, Trash2 } from "lucide-react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion/accordion"
import { Badge } from "@/components/ui/badge/badge"
import { Button } from "@/components/ui/button/button"
import { UserCheck } from "lucide-react"
import { PersonalInfoSection } from "./personal-info-section"
import { AddressInfoSection } from "./address-info-section"
import { EducationInfoSection } from "./education-info-section"
import { EmploymentInfoSection } from "./employment-info-section"
import { LivingStatusSection } from "./living-status-section"
import { HealthInfoSection } from "./health-info-section"
import { DigitalAccessSection } from "./digital-access-section"
import type { MemberFormProps } from "./types"

interface MemberFormComponentProps extends MemberFormProps {
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
}: MemberFormComponentProps) {
  return (
    <AccordionItem key={member.id} value={member.id} className="border rounded-lg">
      <AccordionTrigger className="mobile-accordion-trigger hover:no-underline">
        <div className="flex items-center justify-between w-full mr-2 sm:mr-4 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <User className="w-4 h-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-sm sm:text-base truncate">
                    {member.firstName && member.lastName
                      ? `${member.firstName} ${member.lastName}`
                      : `सदस्य ${index + 1}`}
                  </span>
                  {member.isMukhiya && (
                    <Badge className="bg-orange-100 text-orange-700 text-xs w-fit">
                      <UserCheck className="w-3 h-3 mr-1" />
                      <span className="hindi-text">मुखिया</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {member.age > 0 && (
              <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                {member.age} वर्ष
              </Badge>
            )}
            {member.gender && (
              <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                {member.gender === "MALE" ? "पुरुष" : member.gender === "FEMALE" ? "महिला" : "अन्य"}
              </Badge>
            )}
            {membersCount > 1 && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveMember(member.id)
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 touch-target p-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-3 sm:px-4 pb-4">
        <div className="space-y-6">
          <PersonalInfoSection
            member={member}
            index={index}
            errors={errors}
            onUpdateMember={onUpdateMember}
            onCopyFamilyAddress={onCopyFamilyAddress}
            familyData={familyData}
          />

          <AddressInfoSection
            member={member}
            index={index}
            errors={errors}
            onUpdateMember={onUpdateMember}
            onCopyFamilyAddress={onCopyFamilyAddress}
            familyData={familyData}
          />

          <EducationInfoSection
            member={member}
            index={index}
            errors={errors}
            onUpdateMember={onUpdateMember}
            onCopyFamilyAddress={onCopyFamilyAddress}
            familyData={familyData}
          />

          <EmploymentInfoSection
            member={member}
            index={index}
            errors={errors}
            onUpdateMember={onUpdateMember}
            onCopyFamilyAddress={onCopyFamilyAddress}
            familyData={familyData}
          />

          <LivingStatusSection
            member={member}
            index={index}
            errors={errors}
            onUpdateMember={onUpdateMember}
            onCopyFamilyAddress={onCopyFamilyAddress}
            familyData={familyData}
          />

          <HealthInfoSection
            member={member}
            index={index}
            errors={errors}
            onUpdateMember={onUpdateMember}
            onCopyFamilyAddress={onCopyFamilyAddress}
            familyData={familyData}
          />

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
