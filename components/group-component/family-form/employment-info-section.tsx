"use client"

import { Briefcase, MapPin, Building, Users, Globe } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MemberFormProps } from "./types"
import { useState, useEffect, useCallback } from "react"
import { countries, businessTypes, jobTypes, occupationTypes, statesAndDistricts } from "./constants"

export function EmploymentInfoSection({ member, index, errors, onUpdateMember }: MemberFormProps) {
  const [districts, setDistricts] = useState<string[]>([])

  // Memoize the update function to prevent infinite loops
  const updateMemberField = useCallback(
    (field: string, value: any) => {
      onUpdateMember(member.id, field as any, value)
    },
    [member.id, onUpdateMember],
  )

  // Handle state change and district updates
  useEffect(() => {
    const currentState = member.occupationState
    if (currentState && statesAndDistricts[currentState]) {
      const availableDistricts = statesAndDistricts[currentState]
      setDistricts(availableDistricts)

      // Only clear city if it's not in the new districts list
      const currentCity = member.occupationCity
      if (currentCity && !availableDistricts.includes(currentCity)) {
        updateMemberField("occupationCity", "")
      }
    } else {
      setDistricts([])
      if (member.occupationCity) {
        updateMemberField("occupationCity", "")
      }
    }
  }, [member.occupationState]) // Remove onUpdateMember and member.id from dependencies

  const isJobTypeRequired = ["private_job", "government_job", "intern"].includes(member.occupationType || "")
  const isProfessionalOrSelfEmployed = [
    "self_employed",
    "vendor",
    "artisan",
    "gig_worker",
    "retired",
    "professional",
    "freelancer",
    "domestic_worker",
  ].includes(member.occupationType || "")
  const isBusinessOrStartup = ["business", "startup_founder"].includes(member.occupationType || "")
  const showLocationFields = !member.incomeSourceCountry && (isJobTypeRequired || isBusinessOrStartup)

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-gray-800 hindi-text text-base sm:text-lg">रोजगार की जानकारी</h4>
        </div>

        <div className="space-y-6">
          {/* Employment Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">रोजगार की स्थिति</Label>
            <div className="flex flex-wrap gap-4">
              <CheckboxWithLabel
                id={`employed-${member.id}`}
                label="रोजगार में है"
                checked={member.isEmployed || false}
                onChange={(checked) => {
                  updateMemberField("isEmployed", checked)
                  if (checked) updateMemberField("isSeekingJob", false)
                }}
              />
              <CheckboxWithLabel
                id={`seekingJob-${member.id}`}
                label="रोजगार की तलाश में है"
                checked={member.isSeekingJob || false}
                onChange={(checked) => {
                  updateMemberField("isSeekingJob", checked)
                  if (checked) updateMemberField("isEmployed", false)
                }}
              />
            </div>

            {member.isEmployed && (
              <div className="mt-4">
                <CheckboxWithLabel
                  id={`incomeSourceCountry-${member.id}`}
                  label="आय का स्रोत विदेश में है"
                  checked={member.incomeSourceCountry || false}
                  onChange={(checked) => updateMemberField("incomeSourceCountry", checked)}
                />
              </div>
            )}
          </div>

          {/* Employment Details */}
          {member.isEmployed && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput
                  label="व्यवसाय का प्रकार"
                  value={member.occupationType}
                  options={occupationTypes}
                  onChange={(val) => updateMemberField("occupationType", val)}
                  placeholder="व्यवसाय चुनें"
                  required
                />

                {member.occupationType && (
                  <div>
                    <Label className="hindi-text text-sm font-medium">
                      मासिक आय <span className="text-red-500">*</span>
                      <span className="text-gray-500 font-normal"> (₹ में)</span>
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <Input
                        type="number"
                        min={0}
                        placeholder="10000"
                        className="pl-8 text-sm"
                        value={member.monthlyIncome || ""}
                        onChange={(e) => {
                          const value = Number.parseInt(e.target.value, 10)
                          updateMemberField("monthlyIncome", !isNaN(value) && value >= 0 ? value : 0)
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Job Type Specific Fields */}
              {isJobTypeRequired && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <Label className="font-medium text-blue-800">नौकरी की विस्तृत जानकारी</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectInput
                      label="नौकरी का प्रकार (प्रोफेशन)"
                      value={member.jobType}
                      options={jobTypes}
                      onChange={(val) => updateMemberField("jobType", val)}
                      placeholder="प्रोफेशन चुनें"
                    />

                    <div>
                      <Label className="hindi-text text-sm font-medium">पदनाम</Label>
                      <Input
                        className="mt-1 text-sm"
                        placeholder="जैसे: सीनियर डेवलपर, मैनेजर"
                        value={member.jobPosition || ""}
                        onChange={(e) => updateMemberField("jobPosition", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="hindi-text text-sm font-medium">कार्य अनुभव</Label>
                      <div className="relative mt-1">
                        <Input
                          type="number"
                          min={0}
                          className="text-sm pr-12"
                          placeholder="5"
                          value={member.workExperienceYears || ""}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value, 10)
                            updateMemberField("workExperienceYears", !isNaN(value) && value >= 0 ? value : 0)
                          }}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          वर्ष
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="hindi-text text-sm font-medium">संस्थान का नाम</Label>
                      <Input
                        className="mt-1 text-sm"
                        placeholder="कंपनी/संस्थान का नाम"
                        value={member.employerOrganizationName || ""}
                        onChange={(e) => updateMemberField("employerOrganizationName", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Professional/Self-Employed Fields */}
              {isProfessionalOrSelfEmployed && (
                <div className="bg-green-50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <Label className="font-medium text-green-800">व्यावसायिक जानकारी</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="hindi-text text-sm font-medium">कार्य अनुभव</Label>
                      <div className="relative mt-1">
                        <Input
                          type="number"
                          min={0}
                          className="text-sm pr-12"
                          placeholder="5"
                          value={member.workExperienceYears || ""}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value, 10)
                            updateMemberField("workExperienceYears", !isNaN(value) && value >= 0 ? value : 0)
                          }}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          वर्ष
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <CheckboxWithLabel
                        id={`businessRegistered-${member.id}`}
                        label="व्यवसाय पंजीकृत है"
                        checked={member.isBusinessRegistered || false}
                        onChange={(checked) => updateMemberField("isBusinessRegistered", checked)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Business/Startup Fields */}
              {isBusinessOrStartup && (
                <div className="bg-purple-50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-purple-600" />
                    <Label className="font-medium text-purple-800">व्यापारिक जानकारी</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="hindi-text text-sm font-medium">कंपनी/व्यापार का नाम</Label>
                      <Input
                        className="mt-1 text-sm"
                        placeholder="व्यापार का नाम दर्ज करें"
                        value={member.employerOrganizationName || ""}
                        onChange={(e) => updateMemberField("employerOrganizationName", e.target.value)}
                      />
                    </div>

                    <SelectInput
                      label="व्यवसाय प्रकार"
                      value={member.businessType}
                      onChange={(val) => updateMemberField("businessType", val)}
                      options={businessTypes}
                      placeholder="व्यवसाय प्रकार चुनें"
                    />

                    {member.businessType === "other" && (
                      <div>
                        <Label className="hindi-text text-sm font-medium">अन्य व्यवसाय प्रकार</Label>
                        <Input
                          className="mt-1 text-sm"
                          placeholder="व्यवसाय प्रकार दर्ज करें"
                          value={member.customBusinessType || ""}
                          onChange={(e) => updateMemberField("customBusinessType", e.target.value)}
                        />
                      </div>
                    )}

                    <div>
                      <Label className="hindi-text text-sm font-medium">कर्मचारियों की संख्या</Label>
                      <Input
                        type="number"
                        min={0}
                        className="mt-1 text-sm"
                        placeholder="10"
                        value={member.numberOfEmployees || ""}
                        onChange={(e) => {
                          const value = Number.parseInt(e.target.value, 10)
                          updateMemberField("numberOfEmployees", !isNaN(value) && value >= 0 ? value : 0)
                        }}
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <CheckboxWithLabel
                        id={`needsEmployees-${member.id}`}
                        label="कर्मचारियों की आवश्यकता है"
                        checked={member.needsEmployees || false}
                        onChange={(checked) => updateMemberField("needsEmployees", checked)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Location Fields */}
              {showLocationFields && (
                <div className="bg-orange-50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <Label className="font-medium text-orange-800">कार्यस्थल का स्थान</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectInput
                      label="राज्य"
                      value={member.occupationState}
                      options={Object.keys(statesAndDistricts).map((state) => ({ label: state, value: state }))}
                      onChange={(val) => updateMemberField("occupationState", val)}
                      placeholder="राज्य चुनें"
                    />

                    {districts.length > 0 && (
                      <SelectInput
                        label="जिला"
                        value={member.occupationCity}
                        options={districts.map((district) => ({ label: district, value: district }))}
                        onChange={(val) => updateMemberField("occupationCity", val)}
                        placeholder="जिला चुनें"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Foreign Income Source */}
              {member.incomeSourceCountry && (
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    <Label className="font-medium text-indigo-800">विदेशी आय स्रोत</Label>
                  </div>

                  <SelectInput
                    label="देश का नाम"
                    value={member.incomeSourceCountryName}
                    onChange={(val) => updateMemberField("incomeSourceCountryName", val)}
                    options={countries}
                    placeholder="देश चुनें"
                  />
                </div>
              )}
            </div>
          )}

          {/* Job Seeking Details */}
          {member.isSeekingJob && (
            <div className="bg-yellow-50 p-4 rounded-lg space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-yellow-600" />
                <Label className="font-medium text-yellow-800">रोजगार की तलाश</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput
                  label="इच्छित कार्य क्षेत्र"
                  value={member.jobSearchSector}
                  options={occupationTypes}
                  onChange={(val) => updateMemberField("jobSearchSector", val)}
                  placeholder="कार्य क्षेत्र चुनें"
                />

                {member.jobSearchSector === "other" && (
                  <div>
                    <Label className="hindi-text text-sm font-medium">अन्य कार्य क्षेत्र</Label>
                    <Input
                      className="mt-1 text-sm"
                      placeholder="अपना कार्य क्षेत्र दर्ज करें"
                      value={member.customJobSearchSector || ""}
                      onChange={(e) => updateMemberField("customJobSearchSector", e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label className="hindi-text text-sm font-medium">पसंदीदा कार्य क्षेत्र</Label>
                  <Input
                    className="mt-1 text-sm"
                    placeholder="जैसे: IT, Healthcare, Education"
                    value={member.preferredSector || ""}
                    onChange={(e) => updateMemberField("preferredSector", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <CheckboxWithLabel
                  id={`wantsToGoAbroad-${member.id}`}
                  label="विदेश जाने की इच्छा"
                  checked={member.wantsToGoAbroad || false}
                  onChange={(checked) => updateMemberField("wantsToGoAbroad", checked)}
                />

                <CheckboxWithLabel
                  id={`hasPassport-${member.id}`}
                  label="पासपोर्ट उपलब्ध है"
                  checked={member.hasPassport || false}
                  onChange={(checked) => updateMemberField("hasPassport", checked)}
                />
              </div>
            </div>
          )}

          {/* Status Badges */}
          {(member.isEmployed || member.isSeekingJob) && (
            <div className="flex flex-wrap gap-2">
              {member.isEmployed && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  रोजगार में
                </Badge>
              )}
              {member.isSeekingJob && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  नौकरी की तलाश में
                </Badge>
              )}
              {member.incomeSourceCountry && (
                <Badge variant="outline" className="border-blue-500 text-blue-700">
                  विदेशी आय
                </Badge>
              )}
              {member.isBusinessRegistered && (
                <Badge variant="outline" className="border-purple-500 text-purple-700">
                  पंजीकृत व्यापार
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function CheckboxWithLabel({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="hindi-text text-sm cursor-pointer">
        {label}
      </Label>
    </div>
  )
}

export function SelectInput({
  label,
  value,
  options,
  onChange,
  placeholder,
  required = false,
  disabled,
  id,
}: {
  label: string
  value?: string
  options: { label: string; value: string }[]
  onChange: (val: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  id?: string
}) {
  return (
    <div>
      <Label className="hindi-text text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select disabled={disabled} value={value || ""} onValueChange={onChange}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder={placeholder || "चुनें"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
