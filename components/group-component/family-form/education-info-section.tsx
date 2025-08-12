"use client"

import { GraduationCap, BookOpen, Award } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MemberFormProps } from "./types"
import { educationLevels, statesAndDistricts } from "./constants"
import { useMemo } from "react"

export function EducationInfoSection({ member, index, errors, onUpdateMember }: MemberFormProps) {
  const errorPrefix = `member_${index}_`
  const stateOptions = useMemo(() => Object.keys(statesAndDistricts), [])
  const permDistricts = useMemo(() => {
    return statesAndDistricts[member.educaionalState || ""] || []
  }, [member.educaionalState])
  return (
    <Card className="border-l-4 border-l-indigo-500">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <h4 className="font-semibold text-gray-800 hindi-text text-base sm:text-lg">शिक्षा की जानकारी</h4>
        </div>

        <div className="space-y-6">
          {/* Student Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`isStudent-${member.id}`}
                checked={member.isStudent}
                onCheckedChange={(checked) => onUpdateMember(member.id, "isStudent", checked)}
              />
              <Label htmlFor={`isStudent-${member.id}`} className="hindi-text text-sm cursor-pointer font-medium">
                वर्तमान में छात्र/छात्रा है
              </Label>
            </div>
          </div>

          {/* Education Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`educationLevel-${member.id}`} className="hindi-text text-sm font-medium">
                शिक्षा का स्तर
              </Label>
              <Select
                value={member.educationLevel}
                onValueChange={(value) => onUpdateMember(member.id, "educationLevel", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="शिक्षा का स्तर चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`classCompleted-${member.id}`} className="hindi-text text-sm font-medium">
                पूर्ण की गई कक्षा
              </Label>
              <Input
                id={`classCompleted-${member.id}`}
                value={member.classCompleted}
                onChange={(e) => onUpdateMember(member.id, "classCompleted", e.target.value)}
                placeholder="जैसे: 12वीं, स्नातक"
                className="mt-1 text-sm"
              />
            </div>


          </div>

          {/* Current Education (if student) */}
          {member.isStudent && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <Label className="font-medium text-blue-800">वर्तमान शिक्षा</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`currentClass-${member.id}`} className="hindi-text text-sm font-medium">
                    वर्तमान कक्षा/कोर्स
                  </Label>
                  <Input
                    id={`currentClass-${member.id}`}
                    value={member.currentClass || ""}
                    onChange={(e) => onUpdateMember(member.id, "currentClass", e.target.value)}
                    placeholder="वर्तमान कक्षा/कोर्स"
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor={`institutionName-${member.id}`} className="hindi-text text-sm font-medium">
                    संस्थान का नाम
                  </Label>
                  <Input
                    id={`institutionName-${member.id}`}
                    value={member.institutionName}
                    onChange={(e) => onUpdateMember(member.id, "institutionName", e.target.value)}
                    placeholder="स्कूल/कॉलेज का नाम"
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor={`fieldOfStudy-${member.id}`} className="hindi-text text-sm font-medium">
                    अध्ययन का क्षेत्र
                  </Label>
                  <Input
                    id={`fieldOfStudy-${member.id}`}
                    value={member.fieldOfStudy}
                    onChange={(e) => onUpdateMember(member.id, "fieldOfStudy", e.target.value)}
                    placeholder="जैसे: इंजीनियरिंग, मेडिसिन"
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor={`educationMode-${member.id}`} className="hindi-text text-sm font-medium">
                    शिक्षा का माध्यम
                  </Label>
                  <Select
                    value={member.educationMode}
                    onValueChange={(value) => onUpdateMember(member.id, "educationMode", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="शिक्षा का माध्यम चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">नियमित</SelectItem>
                      <SelectItem value="distance">दूरस्थ शिक्षा</SelectItem>
                      <SelectItem value="online">ऑनलाइन</SelectItem>
                      <SelectItem value="correspondence">पत्राचार</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`educaionalState-${member.id}`} className="hindi-text text-sm font-medium">
                    {"राज्य"}
                  </Label>
                  <Select
                    value={member.educaionalState || ""}
                    onValueChange={(value) => {
                      onUpdateMember(member.id, "educaionalState", value)
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="राज्य चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateOptions.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`educationalDistrict-${member.id}`} className="hindi-text text-sm font-medium">
                    {"जिला"}
                  </Label>
                  <Select
                    value={member.educationalDistrict || ""}
                    onValueChange={(value) => {
                      onUpdateMember(member.id, "educationalDistrict", value)

                    }}
                  // disabled={!member.educationalDistrict || permDistricts.length === 0}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="जिला चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      {permDistricts.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`isCurrentlyEnrolled-${member.id}`}
                    checked={member.isCurrentlyEnrolled}
                    onCheckedChange={(checked) => onUpdateMember(member.id, "isCurrentlyEnrolled", checked)}
                  />
                  <Label htmlFor={`isCurrentlyEnrolled-${member.id}`} className="hindi-text text-sm cursor-pointer">
                    वर्तमान में नामांकित है
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`isStudyingAbroad-${member.id}`}
                    checked={member.isStudyingAbroad}
                    onCheckedChange={(checked) => onUpdateMember(member.id, "isStudyingAbroad", checked)}
                  />
                  <Label htmlFor={`isStudyingAbroad-${member.id}`} className="hindi-text text-sm cursor-pointer">
                    विदेश में अध्ययन कर रहे हैं
                  </Label>
                </div>
              </div>

              {member.isStudyingAbroad && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`currentEducationCity-${member.id}`} className="hindi-text text-sm font-medium">
                      शिक्षा का शहर
                    </Label>
                    <Input
                      id={`currentEducationCity-${member.id}`}
                      value={member.currentEducationCity}
                      onChange={(e) => onUpdateMember(member.id, "currentEducationCity", e.target.value)}
                      placeholder="शहर का नाम"
                      className="mt-1 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`currentEducationCountry-${member.id}`} className="hindi-text text-sm font-medium">
                      शिक्षा का देश
                    </Label>
                    <Input
                      id={`currentEducationCountry-${member.id}`}
                      value={member.currentEducationCountry}
                      onChange={(e) => onUpdateMember(member.id, "currentEducationCountry", e.target.value)}
                      placeholder="देश का नाम"
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Higher Education Details */}
          {(member.educationLevel === "graduate" ||
            member.educationLevel === "post_graduate" ||
            member.educationLevel === "doctorate") && (
              <div className="bg-green-50 p-4 rounded-lg space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-green-600" />
                  <Label className="font-medium text-green-800">उच्च शिक्षा विवरण</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`collegeCourse-${member.id}`} className="hindi-text text-sm font-medium">
                      कॉलेज कोर्स
                    </Label>
                    <Input
                      id={`collegeCourse-${member.id}`}
                      value={member.collegeCourse}
                      onChange={(e) => onUpdateMember(member.id, "collegeCourse", e.target.value)}
                      placeholder="कोर्स का नाम"
                      className="mt-1 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`boardOrUniversity-${member.id}`} className="hindi-text text-sm font-medium">
                      बोर्ड/विश्वविद्यालय
                    </Label>
                    <Input
                      id={`boardOrUniversity-${member.id}`}
                      value={member.boardOrUniversity}
                      onChange={(e) => onUpdateMember(member.id, "boardOrUniversity", e.target.value)}
                      placeholder="बोर्ड/विश्वविद्यालय का नाम"
                      className="mt-1 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`yearOfPassing-${member.id}`} className="hindi-text text-sm font-medium">
                      उत्तीर्ण वर्ष
                    </Label>
                    <Input
                      id={`yearOfPassing-${member.id}`}
                      type="number"
                      min="1950"
                      max={new Date().getFullYear()}
                      value={member.yearOfPassing || ""}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value)
                        onUpdateMember(member.id, "yearOfPassing", isNaN(value) ? undefined : value)
                      }}
                      placeholder="उत्तीर्ण वर्ष"
                      className="mt-1 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`higherEducationType-${member.id}`} className="hindi-text text-sm font-medium">
                      उच्च शिक्षा का प्रकार
                    </Label>
                    <Select
                      value={member.higherEducationType}
                      onValueChange={(value) => onUpdateMember(member.id, "higherEducationType", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="शिक्षा का प्रकार चुनें" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">तकनीकी</SelectItem>
                        <SelectItem value="medical">चिकित्सा</SelectItem>
                        <SelectItem value="management">प्रबंधन</SelectItem>
                        <SelectItem value="arts">कला</SelectItem>
                        <SelectItem value="science">विज्ञान</SelectItem>
                        <SelectItem value="commerce">वाणिज्य</SelectItem>
                        <SelectItem value="law">कानून</SelectItem>
                        <SelectItem value="other">अन्य</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`educaionalState-${member.id}`} className="hindi-text text-sm font-medium">
                      {"राज्य"}
                    </Label>
                    <Select
                      value={member.educaionalState || ""}
                      onValueChange={(value) => {
                        onUpdateMember(member.id, "educaionalState", value)
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="राज्य चुनें" />
                      </SelectTrigger>
                      <SelectContent>
                        {stateOptions.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`educationalDistrict-${member.id}`} className="hindi-text text-sm font-medium">
                      {"जिला"}
                    </Label>
                    <Select
                      value={member.educationalDistrict || ""}
                      onValueChange={(value) => {
                        onUpdateMember(member.id, "educationalDistrict", value)

                      }}
                    // disabled={!member.educationalDistrict || permDistricts.length === 0}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="जिला चुनें" />
                      </SelectTrigger>
                      <SelectContent>
                        {permDistricts.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

          {/* Scholarship Information */}
          <div className="bg-yellow-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-yellow-600" />
              <Label className="font-medium text-yellow-800">छात्रवृत्ति की जानकारी</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`scholarshipReceived-${member.id}`}
                checked={member.scholarshipReceived}
                onCheckedChange={(checked) => onUpdateMember(member.id, "scholarshipReceived", checked)}
              />
              <Label htmlFor={`scholarshipReceived-${member.id}`} className="hindi-text text-sm cursor-pointer">
                छात्रवृत्ति प्राप्त की है
              </Label>
            </div>

            {member.scholarshipReceived && (
              <div>
                <Label htmlFor={`scholarshipDetails-${member.id}`} className="hindi-text text-sm font-medium">
                  छात्रवृत्ति का विवरण
                </Label>
                <Textarea
                  id={`scholarshipDetails-${member.id}`}
                  value={member.scholarshipDetails}
                  onChange={(e) => onUpdateMember(member.id, "scholarshipDetails", e.target.value)}
                  placeholder="छात्रवृत्ति का नाम और विवरण"
                  className="mt-1 min-h-[60px] text-sm"
                  rows={2}
                />
              </div>
            )}
          </div>

          {/* Support from Samaj */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`isHelpRequiredFromSamaj-${member.id}`}
                checked={member.isHelpRequiredFromSamaj}
                onCheckedChange={(checked) => onUpdateMember(member.id, "isHelpRequiredFromSamaj", checked)}
              />
              <Label htmlFor={`isHelpRequiredFromSamaj-${member.id}`} className="hindi-text text-sm cursor-pointer">
                समाज से शिक्षा में सहायता चाहिए
              </Label>
            </div>
          </div>

          {/* Dropout Information */}
          {!member.isStudent && member.educationLevel !== "illiterate" && (
            <div className="bg-red-50 p-4 rounded-lg">
              <Label htmlFor={`dropoutReason-${member.id}`} className="hindi-text text-sm font-medium">
                शिक्षा छोड़ने का कारण (यदि कोई हो)
              </Label>
              <Textarea
                id={`dropoutReason-${member.id}`}
                value={member.dropoutReason}
                onChange={(e) => onUpdateMember(member.id, "dropoutReason", e.target.value)}
                placeholder="शिक्षा छोड़ने का कारण बताएं"
                className="mt-1 min-h-[60px] text-sm"
                rows={2}
              />
            </div>
          )}

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            {member.isStudent && (
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                छात्र/छात्रा
              </Badge>
            )}
            {member.isStudyingAbroad && (
              <Badge variant="outline" className="border-green-500 text-green-700">
                विदेश में अध्ययन
              </Badge>
            )}
            {member.scholarshipReceived && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                छात्रवृत्ति प्राप्त
              </Badge>
            )}
            {member.isHelpRequiredFromSamaj && (
              <Badge variant="outline" className="border-orange-500 text-orange-700">
                समाज से सहायता चाहिए
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
