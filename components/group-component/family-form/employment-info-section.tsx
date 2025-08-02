"use client"

import { Briefcase } from "lucide-react"
import { Label } from "@/components/ui/label/label"
import { Input } from "@/components/ui/input/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/select"
import { Checkbox } from "@/components/ui/checkbox/checkbox"
import type { MemberFormProps } from "./types"

interface EmploymentInfoSectionProps extends MemberFormProps {}

export function EmploymentInfoSection({ member, index, errors, onUpdateMember }: EmploymentInfoSectionProps) {
  return (
    <div>
      <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text text-sm sm:text-base">
        <Briefcase className="w-4 h-4 mr-2" />
        रोजगार की जानकारी
      </h4>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`employed-${member.id}`}
              checked={member.isEmployed}
              onCheckedChange={(checked) => onUpdateMember(member.id, "isEmployed", checked)}
            />
            <Label htmlFor={`employed-${member.id}`} className="hindi-text text-sm">
              रोजगार में है
            </Label>
          </div>

          {member.isEmployed && (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`selfEmployed-${member.id}`}
                  checked={member.isSelfEmployed}
                  onCheckedChange={(checked) => onUpdateMember(member.id, "isSelfEmployed", checked)}
                />
                <Label htmlFor={`selfEmployed-${member.id}`} className="hindi-text text-sm">
                  स्व-रोजगार में है
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`governmentJob-${member.id}`}
                  checked={member.isGovernmentJob}
                  onCheckedChange={(checked) => onUpdateMember(member.id, "isGovernmentJob", checked)}
                />
                <Label htmlFor={`governmentJob-${member.id}`} className="hindi-text text-sm">
                  सरकारी नौकरी है
                </Label>
              </div>

              {member.isSelfEmployed && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`businessRegistration-${member.id}`}
                      checked={member.businessRegistration}
                      onCheckedChange={(checked) => onUpdateMember(member.id, "businessRegistration", checked)}
                    />
                    <Label htmlFor={`businessRegistration-${member.id}`} className="hindi-text text-sm">
                      व्यापार पंजीकृत है
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`willingToHire-${member.id}`}
                      checked={member.willingToHirePeople}
                      onCheckedChange={(checked) => onUpdateMember(member.id, "willingToHirePeople", checked)}
                    />
                    <Label htmlFor={`willingToHire-${member.id}`} className="hindi-text text-sm">
                      लोगों को काम देने को तैयार
                    </Label>
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`openToRelocate-${member.id}`}
                  checked={member.isOpenToRelocate}
                  onCheckedChange={(checked) => onUpdateMember(member.id, "isOpenToRelocate", checked)}
                />
                <Label htmlFor={`openToRelocate-${member.id}`} className="hindi-text text-sm">
                  स्थानांतरण के लिए तैयार
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`additionalSkills-${member.id}`}
                  checked={member.hasAdditionalSkills}
                  onCheckedChange={(checked) => onUpdateMember(member.id, "hasAdditionalSkills", checked)}
                />
                <Label htmlFor={`additionalSkills-${member.id}`} className="hindi-text text-sm">
                  अतिरिक्त कौशल है
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`incomeSourceCountry-${member.id}`}
                  checked={member.incomeSourceCountry}
                  onCheckedChange={(checked) => onUpdateMember(member.id, "incomeSourceCountry", checked)}
                />
                <Label htmlFor={`incomeSourceCountry-${member.id}`} className="hindi-text text-sm">
                  आय का स्रोत विदेश में है
                </Label>
              </div>
            </>
          )}
        </div>

        {member.isEmployed && (
          <div className="mobile-form-grid">
            <div>
              <Label className="hindi-text text-sm">व्यवसाय का प्रकार</Label>
              <Select
                value={member.occupationType || ""}
                onValueChange={(value) => onUpdateMember(member.id, "occupationType", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="व्यवसाय चुनें" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer">किसान</SelectItem>
                  <SelectItem value="laborer">मजदूर</SelectItem>
                  <SelectItem value="private_job">निजी नौकरी</SelectItem>
                  <SelectItem value="government_job">सरकारी नौकरी</SelectItem>
                  <SelectItem value="self_employed">स्व-रोजगार</SelectItem>
                  <SelectItem value="business">व्यापार</SelectItem>
                  <SelectItem value="unemployed">बेरोजगार</SelectItem>
                  <SelectItem value="student">छात्र</SelectItem>
                  <SelectItem value="housewife">गृहिणी</SelectItem>
                  <SelectItem value="retired">सेवानिवृत्त</SelectItem>
                  <SelectItem value="professional">पेशेवर</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="hindi-text text-sm">रोजगार की स्थिति</Label>
              <Select
                value={member.employmentStatus || ""}
                onValueChange={(value) => onUpdateMember(member.id, "employmentStatus", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="रोजगार की स्थिति चुनें" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">कार्यरत</SelectItem>
                  <SelectItem value="unemployed">बेरोजगार</SelectItem>
                  <SelectItem value="self_employed">स्व-रोजगार</SelectItem>
                  <SelectItem value="retired">सेवानिवृत्त</SelectItem>
                  <SelectItem value="student">छात्र</SelectItem>
                  <SelectItem value="homemaker">गृहिणी</SelectItem>
                  <SelectItem value="looking_for_job">नौकरी की तलाश में</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="hindi-text text-sm">मासिक आय (₹)</Label>
              <Input
                type="number"
                value={member.monthlyIncome || ""}
                onChange={(e) =>
                  onUpdateMember(member.id, "monthlyIncome", Number.parseFloat(e.target.value) || undefined)
                }
                placeholder="मासिक आय"
                min="0"
                className="mt-1 text-sm"
              />
            </div>

            <div>
              <Label className="hindi-text text-sm">कार्य अनुभव (वर्ष)</Label>
              <Input
                type="number"
                value={member.workExperienceYears || ""}
                onChange={(e) =>
                  onUpdateMember(member.id, "workExperienceYears", Number.parseInt(e.target.value) || undefined)
                }
                placeholder="कुल कार्य अनुभव"
                min="0"
                className="mt-1 text-sm"
              />
            </div>

            {/* Business-specific fields */}
            {member.occupationType === "business" && (
              <>
                <div>
                  <Label className="hindi-text text-sm">व्यापार का नाम *</Label>
                  <Input
                    value={member.nameOfBusiness || ""}
                    onChange={(e) => onUpdateMember(member.id, "nameOfBusiness", e.target.value)}
                    placeholder="व्यापार/व्यवसाय का नाम"
                    className={`mt-1 text-sm ${errors[`member-${index}-businessName`] ? "border-red-500" : ""}`}
                  />
                  {errors[`member-${index}-businessName`] && (
                    <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`member-${index}-businessName`]}</p>
                  )}
                </div>

                <div>
                  <Label className="hindi-text text-sm">व्यापार की श्रेणी *</Label>
                  <Select
                    value={member.businessCategory || ""}
                    onValueChange={(value) => onUpdateMember(member.id, "businessCategory", value)}
                  >
                    <SelectTrigger
                      className={`mt-1 ${errors[`member-${index}-businessCategory`] ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="व्यापार की श्रेणी चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">खुदरा व्यापार</SelectItem>
                      <SelectItem value="wholesale">थोक व्यापार</SelectItem>
                      <SelectItem value="manufacturing">विनिर्माण</SelectItem>
                      <SelectItem value="services">सेवा</SelectItem>
                      <SelectItem value="agriculture">कृषि</SelectItem>
                      <SelectItem value="construction">निर्माण</SelectItem>
                      <SelectItem value="transport">परिवहन</SelectItem>
                      <SelectItem value="food">खाद्य व्यवसाय</SelectItem>
                      <SelectItem value="technology">प्रौद्योगिकी</SelectItem>
                      <SelectItem value="other">अन्य</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors[`member-${index}-businessCategory`] && (
                    <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`member-${index}-businessCategory`]}</p>
                  )}
                </div>

                <div>
                  <Label className="hindi-text text-sm">व्यापार का आकार *</Label>
                  <Select
                    value={member.sizeOfBusiness || ""}
                    onValueChange={(value) => onUpdateMember(member.id, "sizeOfBusiness", value)}
                  >
                    <SelectTrigger className={`mt-1 ${errors[`member-${index}-businessSize`] ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="व्यापार का आकार चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">सूक्ष्म (1-10 कर्मचारी)</SelectItem>
                      <SelectItem value="small">लघु (11-50 कर्मचारी)</SelectItem>
                      <SelectItem value="medium">मध्यम (51-250 कर्मचारी)</SelectItem>
                      <SelectItem value="large">बड़ा (250+ कर्मचारी)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors[`member-${index}-businessSize`] && (
                    <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`member-${index}-businessSize`]}</p>
                  )}
                </div>

                <div>
                  <Label className="hindi-text text-sm">स्व-रोजगार का प्रकार</Label>
                  <Input
                    value={member.selfEmployedJobType || ""}
                    onChange={(e) => onUpdateMember(member.id, "selfEmployedJobType", e.target.value)}
                    placeholder="स्व-रोजगार का प्रकार"
                    className="mt-1 text-sm"
                  />
                </div>
              </>
            )}

            {/* Employee-specific fields */}
            {(member.occupationType === "private_job" ||
              member.occupationType === "government_job" ||
              member.occupationType === "professional") && (
              <>
                <div>
                  <Label className="hindi-text text-sm">नौकरी की श्रेणी</Label>
                  <Select
                    value={member.jobCategory || ""}
                    onValueChange={(value) => onUpdateMember(member.id, "jobCategory", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="नौकरी की श्रेणी चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agriculture">कृषि</SelectItem>
                      <SelectItem value="healthcare">स्वास्थ्य सेवा</SelectItem>
                      <SelectItem value="education">शिक्षा</SelectItem>
                      <SelectItem value="technology">प्रौद्योगिकी</SelectItem>
                      <SelectItem value="finance">वित्त</SelectItem>
                      <SelectItem value="manufacturing">विनिर्माण</SelectItem>
                      <SelectItem value="construction">निर्माण</SelectItem>
                      <SelectItem value="transport">परिवहन</SelectItem>
                      <SelectItem value="retail">खुदरा व्यापार</SelectItem>
                      <SelectItem value="hospitality">आतिथ्य</SelectItem>
                      <SelectItem value="government">सरकारी सेवा</SelectItem>
                      <SelectItem value="other">अन्य</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="hindi-text text-sm">नौकरी का प्रकार</Label>
                  <Select
                    value={member.jobType || ""}
                    onValueChange={(value) => onUpdateMember(member.id, "jobType", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="नौकरी का प्रकार चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">पूर्णकालिक</SelectItem>
                      <SelectItem value="part_time">अंशकालिक</SelectItem>
                      <SelectItem value="contract">अनुबंध आधारित</SelectItem>
                      <SelectItem value="freelance">फ्रीलांस</SelectItem>
                      <SelectItem value="temporary">अस्थायी</SelectItem>
                      <SelectItem value="permanent">स्थायी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="hindi-text text-sm">पद/पदनाम</Label>
                  <Input
                    value={member.jobPosition || ""}
                    onChange={(e) => onUpdateMember(member.id, "jobPosition", e.target.value)}
                    placeholder="पद का नाम"
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label className="hindi-text text-sm">नियोक्ता/संगठन का नाम</Label>
                  <Input
                    value={member.employerOrganizationName || ""}
                    onChange={(e) => onUpdateMember(member.id, "employerOrganizationName", e.target.value)}
                    placeholder="कंपनी/संगठन का नाम"
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label className="hindi-text text-sm">साप्ताहिक कार्य घंटे</Label>
                  <Input
                    type="number"
                    value={member.workingHoursPerWeek || ""}
                    onChange={(e) =>
                      onUpdateMember(member.id, "workingHoursPerWeek", Number.parseInt(e.target.value) || undefined)
                    }
                    placeholder="प्रति सप्ताह कार्य घंटे"
                    min="0"
                    max="168"
                    className="mt-1 text-sm"
                  />
                </div>
              </>
            )}

            {/* Common fields for all employed members */}
            <div>
              <Label className="hindi-text text-sm">कार्य स्थान राज्य</Label>
              <Input
                value={member.occupationState || ""}
                onChange={(e) => onUpdateMember(member.id, "occupationState", e.target.value)}
                placeholder="राज्य का नाम"
                className="mt-1 text-sm"
              />
            </div>

            <div>
              <Label className="hindi-text text-sm">कार्य स्थान जिला</Label>
              <Input
                value={member.occupationCity || ""}
                onChange={(e) => onUpdateMember(member.id, "occupationCity", e.target.value)}
                placeholder="जिला का नाम दर्ज करें"
                className="mt-1 text-sm"
              />
            </div>

            <div>
              <Label className="hindi-text text-sm">पसंदीदा कार्य स्थान</Label>
              <Input
                value={member.preferredJobLocation || ""}
                onChange={(e) => onUpdateMember(member.id, "preferredJobLocation", e.target.value)}
                placeholder="पसंदीदा कार्य स्थान"
                className="mt-1 text-sm"
              />
            </div>

            {member.incomeSourceCountry && (
              <div>
                <Label className="hindi-text text-sm">आय स्रोत देश का नाम</Label>
                <Input
                  value={member.countryName || ""}
                  onChange={(e) => onUpdateMember(member.id, "countryName", e.target.value)}
                  placeholder="देश का नाम"
                  className="mt-1 text-sm"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
