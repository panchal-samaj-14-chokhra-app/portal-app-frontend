"use client"

import { Heart, Shield, Pill, Activity } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MemberFormProps } from "./types"

export function HealthInfoSection({ member, index, errors, onUpdateMember }: MemberFormProps) {
  return (
    <Card className="border-l-4 border-l-red-500">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-600" />
          <h4 className="font-semibold text-gray-800 hindi-text text-base sm:text-lg">स्वास्थ्य की जानकारी</h4>
        </div>

        <div className="space-y-6">
          {/* Health Status */}
          <div className="bg-red-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-red-600" />
              <h5 className="font-medium text-red-800 hindi-text">स्वास्थ्य स्थिति</h5>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`hasHealthIssues-${member.id}`}
                checked={member.hasHealthIssues}
                onCheckedChange={(checked) => onUpdateMember(member.id, "hasHealthIssues", checked)}
              />
              <Label htmlFor={`hasHealthIssues-${member.id}`} className="hindi-text text-sm cursor-pointer">
                कोई स्वास्थ्य समस्या है
              </Label>
            </div>

            {member.hasHealthIssues && (
              <div>
                <Label htmlFor={`chronicDisease-${member.id}`} className="hindi-text text-sm font-medium">
                  पुरानी बीमारी का विवरण
                </Label>
                <Textarea
                  id={`chronicDisease-${member.id}`}
                  value={member.chronicDisease}
                  onChange={(e) => onUpdateMember(member.id, "chronicDisease", e.target.value)}
                  placeholder="बीमारी का नाम और विवरण"
                  className="mt-1 min-h-[60px] text-sm"
                  rows={2}
                />
              </div>
            )}
          </div>

          {/* Vaccination Status */}
          <div className="bg-green-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Pill className="w-4 h-4 text-green-600" />
              <h5 className="font-medium text-green-800 hindi-text">टीकाकरण की स्थिति</h5>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`isVaccinated-${member.id}`}
                checked={member.isVaccinated}
                onCheckedChange={(checked) => onUpdateMember(member.id, "isVaccinated", checked)}
              />
              <Label htmlFor={`isVaccinated-${member.id}`} className="hindi-text text-sm cursor-pointer">
                पूर्ण टीकाकरण हो चुका है
              </Label>
            </div>
          </div>

          {/* Health Insurance */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <h5 className="font-medium text-blue-800 hindi-text">स्वास्थ्य बीमा</h5>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`hasHealthInsurance-${member.id}`}
                  checked={member.hasHealthInsurance}
                  onCheckedChange={(checked) => onUpdateMember(member.id, "hasHealthInsurance", checked)}
                />
                <Label htmlFor={`hasHealthInsurance-${member.id}`} className="hindi-text text-sm cursor-pointer">
                  स्वास्थ्य बीमा है
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`isInterestedInFutureHealthPolicy-${member.id}`}
                  checked={member.isInterestedInFutureHealthPolicy}
                  onCheckedChange={(checked) => onUpdateMember(member.id, "isInterestedInFutureHealthPolicy", checked)}
                />
                <Label
                  htmlFor={`isInterestedInFutureHealthPolicy-${member.id}`}
                  className="hindi-text text-sm cursor-pointer"
                >
                  भविष्य में स्वास्थ्य बीमा में रुचि है
                </Label>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            {member.hasHealthIssues && (
              <Badge variant="destructive" className="bg-red-100 text-red-800">
                <Heart className="w-3 h-3 mr-1" />
                स्वास्थ्य समस्या
              </Badge>
            )}
            {member.isVaccinated && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Pill className="w-3 h-3 mr-1" />
                टीकाकरण पूर्ण
              </Badge>
            )}
            {member.hasHealthInsurance && (
              <Badge variant="outline" className="border-blue-500 text-blue-700">
                <Shield className="w-3 h-3 mr-1" />
                स्वास्थ्य बीमा
              </Badge>
            )}
            {member.isInterestedInFutureHealthPolicy && (
              <Badge variant="outline" className="border-purple-500 text-purple-700">
                बीमा में रुचि
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
