"use client"

import { Heart } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { MemberFormProps } from "./types"

export function HealthInfoSection({ member, index, errors, onUpdateMember }: MemberFormProps) {
  return (
    <div>
      <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text text-sm sm:text-base">
        <Heart className="w-4 h-4 mr-2" />
        स्वास्थ्य की जानकारी
      </h4>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`health-issues-${member.id}`}
              checked={member.hasHealthIssues}
              onCheckedChange={(checked) => onUpdateMember(member.id, "hasHealthIssues", checked)}
            />
            <Label htmlFor={`health-issues-${member.id}`} className="hindi-text text-sm">
              स्वास्थ्य समस्या है
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`vaccinated-${member.id}`}
              checked={member.isVaccinated}
              onCheckedChange={(checked) => onUpdateMember(member.id, "isVaccinated", checked)}
            />
            <Label htmlFor={`vaccinated-${member.id}`} className="hindi-text text-sm">
              टीकाकरण हुआ है
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`health-insurance-${member.id}`}
              checked={member.hasHealthInsurance}
              onCheckedChange={(checked) => onUpdateMember(member.id, "hasHealthInsurance", checked)}
            />
            <Label htmlFor={`health-insurance-${member.id}`} className="hindi-text text-sm">
              स्वास्थ्य बीमा है
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`futureHealthPolicy-${member.id}`}
              checked={member.isInterestedInFutureHealthPolicy}
              onCheckedChange={(checked) => onUpdateMember(member.id, "isInterestedInFutureHealthPolicy", checked)}
            />
            <Label htmlFor={`futureHealthPolicy-${member.id}`} className="hindi-text text-sm">
              भविष्य में स्वास्थ्य बीमा में रुचि
            </Label>
          </div>
        </div>
        {member.hasHealthIssues && (
          <div className="max-w-md">
            <Label className="hindi-text text-sm">पुरानी बीमारी (यदि कोई हो)</Label>
            <Input
              value={member.chronicDisease}
              onChange={(e) => onUpdateMember(member.id, "chronicDisease", e.target.value)}
              placeholder="बीमारी का नाम"
              className="mt-1 text-sm"
            />
          </div>
        )}
      </div>
    </div>
  )
}
