"use client"

import { Smartphone, Wifi, CreditCard, Users, Heart } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MemberFormProps } from "./types"
import { welfareSchemeOptions } from "./constants"

export function DigitalAccessSection({ member, index, errors, onUpdateMember }: MemberFormProps) {
  const handleWelfareSchemeChange = (scheme: string, checked: boolean) => {
    const currentSchemes = Array.isArray(member.welfareSchemes) ? member.welfareSchemes : []
    let updatedSchemes: string[]

    if (checked) {
      updatedSchemes = [...currentSchemes, scheme]
    } else {
      updatedSchemes = currentSchemes.filter((s) => s !== scheme)
    }

    onUpdateMember(member.id, "welfareSchemes", updatedSchemes)
  }

  return (
    <Card className="border-l-4 border-l-cyan-500">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-cyan-600" />
          <h4 className="font-semibold text-gray-800 hindi-text text-base sm:text-lg">डिजिटल पहुंच और कल्याण</h4>
        </div>

        <div className="space-y-6">
          {/* Digital Access */}
          <div className="bg-cyan-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="w-4 h-4 text-cyan-600" />
              <h5 className="font-medium text-cyan-800 hindi-text">डिजिटल सुविधाएं</h5>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`hasSmartphone-${member.id}`}
                  checked={member.hasSmartphone}
                  onCheckedChange={(checked) => onUpdateMember(member.id, "hasSmartphone", checked)}
                />
                <Label htmlFor={`hasSmartphone-${member.id}`} className="hindi-text text-sm cursor-pointer">
                  स्मार्टफोन है
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`hasInternet-${member.id}`}
                  checked={member.hasInternet}
                  onCheckedChange={(checked) => onUpdateMember(member.id, "hasInternet", checked)}
                />
                <Label htmlFor={`hasInternet-${member.id}`} className="hindi-text text-sm cursor-pointer">
                  इंटरनेट की सुविधा है
                </Label>
              </div>
            </div>
          </div>

          {/* Banking Services */}
          <div className="bg-green-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-green-600" />
              <h5 className="font-medium text-green-800 hindi-text">बैंकिंग सेवाएं</h5>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`hasBankAccount-${member.id}`}
                  checked={member.hasBankAccount}
                  onCheckedChange={(checked) => onUpdateMember(member.id, "hasBankAccount", checked)}
                />
                <Label htmlFor={`hasBankAccount-${member.id}`} className="hindi-text text-sm cursor-pointer">
                  बैंक खाता है
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`hasJanDhan-${member.id}`}
                  checked={member.hasJanDhan}
                  onCheckedChange={(checked) => onUpdateMember(member.id, "hasJanDhan", checked)}
                />
                <Label htmlFor={`hasJanDhan-${member.id}`} className="hindi-text text-sm cursor-pointer">
                  जन धन खाता है
                </Label>
              </div>
            </div>
          </div>

          {/* Welfare Schemes */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h5 className="font-medium text-blue-800 hindi-text">सरकारी योजनाओं का लाभ</h5>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {welfareSchemeOptions.map((scheme) => (
                <div key={scheme.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`welfare-${scheme.value}-${member.id}`}
                    checked={Array.isArray(member.welfareSchemes) && member.welfareSchemes.includes(scheme.value)}
                    onCheckedChange={(checked) => handleWelfareSchemeChange(scheme.value, !!checked)}
                  />
                  <Label htmlFor={`welfare-${scheme.value}-${member.id}`} className="hindi-text text-sm cursor-pointer">
                    {scheme.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Social Interests */}
          <div className="bg-pink-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-pink-600" />
              <h5 className="font-medium text-pink-800 hindi-text">सामाजिक रुचियां</h5>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`isInterestedInFutureSamuhikVivah-${member.id}`}
                checked={member.isInterestedInFutureSamuhikVivah}
                onCheckedChange={(checked) => onUpdateMember(member.id, "isInterestedInFutureSamuhikVivah", checked)}
              />
              <Label
                htmlFor={`isInterestedInFutureSamuhikVivah-${member.id}`}
                className="hindi-text text-sm cursor-pointer"
              >
                भविष्य में सामूहिक विवाह में रुचि है
              </Label>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            {member.hasSmartphone && (
              <Badge variant="default" className="bg-cyan-100 text-cyan-800">
                <Smartphone className="w-3 h-3 mr-1" />
                स्मार्टफोन
              </Badge>
            )}
            {member.hasInternet && (
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                <Wifi className="w-3 h-3 mr-1" />
                इंटरनेट
              </Badge>
            )}
            {member.hasBankAccount && (
              <Badge variant="outline" className="border-green-500 text-green-700">
                <CreditCard className="w-3 h-3 mr-1" />
                बैंक खाता
              </Badge>
            )}
            {member.hasJanDhan && (
              <Badge variant="outline" className="border-orange-500 text-orange-700">
                जन धन खाता
              </Badge>
            )}
            {Array.isArray(member.welfareSchemes) && member.welfareSchemes.length > 0 && (
              <Badge variant="outline" className="border-purple-500 text-purple-700">
                <Users className="w-3 h-3 mr-1" />
                {member.welfareSchemes.length} योजनाओं का लाभ
              </Badge>
            )}
            {member.isInterestedInFutureSamuhikVivah && (
              <Badge variant="outline" className="border-pink-500 text-pink-700">
                <Heart className="w-3 h-3 mr-1" />
                सामूहिक विवाह में रुचि
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
