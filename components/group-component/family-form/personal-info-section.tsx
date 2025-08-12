"use client"

import { User, Calendar, Phone, Mail } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MemberFormProps } from "./types"
import { relationOptions, bloodGroups, maritalStatusOptions } from "./constants"

export function PersonalInfoSection({ member, index, errors, onUpdateMember }: MemberFormProps) {
  const errorPrefix = `member_${index}_`

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-green-600" />
          <h4 className="font-semibold text-gray-800 hindi-text text-base sm:text-lg">व्यक्तिगत जानकारी</h4>
          {member.isMukhiya && <Badge className="bg-orange-100 text-orange-700 text-xs">मुखिया</Badge>}
        </div>

        <div className="space-y-4">
          {/* Name and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`firstName-${member.id}`} className="hindi-text text-sm font-medium">
                नाम <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`firstName-${member.id}`}
                value={member.firstName}
                onChange={(e) => onUpdateMember(member.id, "firstName", e.target.value)}
                placeholder="नाम दर्ज करें"
                className={`mt-1 text-sm ${errors[`${errorPrefix}firstName`] ? "border-red-500" : ""}`}
              />
              {errors[`${errorPrefix}firstName`] && (
                <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`${errorPrefix}firstName`]}</p>
              )}
            </div>

            <div>
              <Label htmlFor={`lastName-${member.id}`} className="hindi-text text-sm font-medium">
                उपनाम
              </Label>
              <Input
                id={`lastName-${member.id}`}
                value={member.lastName}
                onChange={(e) => onUpdateMember(member.id, "lastName", e.target.value)}
                placeholder="उपनाम दर्ज करें"
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor={`gender-${member.id}`} className="hindi-text text-sm font-medium">
                लिंग <span className="text-red-500">*</span>
              </Label>
              <Select
                value={member.gender}
                onValueChange={(value: "MALE" | "FEMALE" | "OTHER") => onUpdateMember(member.id, "gender", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="लिंग चुनें" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">पुरुष</SelectItem>
                  <SelectItem value="FEMALE">महिला</SelectItem>
                  <SelectItem value="OTHER">अन्य</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor={`gotra-${member.id}`} className="hindi-text text-sm font-medium">
                गोत्र
              </Label>
              <Input
                id={`gotra-${member.id}`}
                value={member.gotra}
                onChange={(e) => onUpdateMember(member.id, "gotra", e.target.value)}
                placeholder="गोत्र दर्ज करें"
                className="mt-1 text-sm"
              />
            </div>
            {member?.gender === 'FEMALE' && (
              <div>
                <Label htmlFor={`femaleGotra-${member.id}`} className="hindi-text text-sm font-medium">
                  द्वितीय गोत्र
                </Label>
                <Input
                  id={`femaleGotra-${member.id}`}
                  value={member.femaleGotra}
                  onChange={(e) => onUpdateMember(member.id, "femaleGotra", e.target.value)}
                  placeholder="द्वितीय गोत्र दर्ज करें (यदि कोई हो)"
                  className="mt-1 text-sm"
                />
              </div>
            )}
          </div>

          {/* Date of Birth and Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor={`dateOfBirth-${member.id}`} className="hindi-text text-sm font-medium">
                जन्म तिथि <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id={`dateOfBirth-${member.id}`}
                  type="date"
                  value={member.dateOfBirth}
                  onChange={(e) => onUpdateMember(member.id, "dateOfBirth", e.target.value)}
                  className={`pl-10 text-sm ${errors[`${errorPrefix}dateOfBirth`] ? "border-red-500" : ""}`}
                />
              </div>
              {errors[`${errorPrefix}dateOfBirth`] && (
                <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`${errorPrefix}dateOfBirth`]}</p>
              )}
            </div>

            <div>
              <Label className="hindi-text text-sm font-medium">आयु</Label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm text-gray-700">{member.age} वर्ष</div>
            </div>



            <div>
              <Label htmlFor={`relation-${member.id}`} className="hindi-text text-sm font-medium">
                रिश्ता <span className="text-red-500">*</span>
              </Label>
              <Select value={member.relation} onValueChange={(value) => onUpdateMember(member.id, "relation", value)}>
                <SelectTrigger className={`mt-1 ${errors[`${errorPrefix}relation`] ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="रिश्ता चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {relationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors[`${errorPrefix}relation`] && (
                <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`${errorPrefix}relation`]}</p>
              )}
            </div>
          </div>

          {/* Marital Status and Blood Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`maritalStatus-${member.id}`} className="hindi-text text-sm font-medium">
                वैवाहिक स्थिति
              </Label>
              <Select
                value={member.maritalStatus}
                onValueChange={(value) => onUpdateMember(member.id, "maritalStatus", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="वैवाहिक स्थिति चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {maritalStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`bloodGroup-${member.id}`} className="hindi-text text-sm font-medium">
                रक्त समूह
              </Label>
              <Select
                value={member.bloodGroup}
                onValueChange={(value) => onUpdateMember(member.id, "bloodGroup", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="रक्त समूह चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <h5 className="font-medium text-blue-800 hindi-text flex items-center gap-2">
              <Phone className="w-4 h-4" />
              संपर्क जानकारी
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`mobileNumber-${member.id}`} className="hindi-text text-sm font-medium">
                  मोबाइल नंबर
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id={`mobileNumber-${member.id}`}
                    type="tel"
                    value={member.mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                      onUpdateMember(member.id, "mobileNumber", value)
                    }}
                    placeholder="मोबाइल नंबर"
                    maxLength={10}
                    className={`pl-10 text-sm ${errors[`${errorPrefix}mobileNumber`] ? "border-red-500" : ""}`}
                  />
                </div>
                {errors[`${errorPrefix}mobileNumber`] && (
                  <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`${errorPrefix}mobileNumber`]}</p>
                )}
              </div>

              <div>
                <Label htmlFor={`email-${member.id}`} className="hindi-text text-sm font-medium">
                  ईमेल
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id={`email-${member.id}`}
                    type="email"
                    value={member.email}
                    onChange={(e) => onUpdateMember(member.id, "email", e.target.value)}
                    placeholder="ईमेल पता"
                    className={`pl-10 text-sm ${errors[`${errorPrefix}email`] ? "border-red-500" : ""}`}
                  />
                </div>
                {errors[`${errorPrefix}email`] && (
                  <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`${errorPrefix}email`]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Special Conditions */}
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`disability-${member.id}`}
                checked={member.disability}
                onCheckedChange={(checked) => onUpdateMember(member.id, "disability", checked)}
              />
              <Label htmlFor={`disability-${member.id}`} className="hindi-text text-sm cursor-pointer">
                विकलांगता है
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`isMukhiya-${member.id}`}
                checked={member.isMukhiya}
                onCheckedChange={(checked) => onUpdateMember(member.id, "isMukhiya", checked)}
              />
              <Label htmlFor={`isMukhiya-${member.id}`} className="hindi-text text-sm cursor-pointer font-medium">
                मुखिया है
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
