"use client"

import { GraduationCap } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import type { MemberFormProps } from "./types"

export function EducationInfoSection({ member, index, errors, onUpdateMember }: MemberFormProps) {
  return (
    <div>
      <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text text-sm sm:text-base">
        <GraduationCap className="w-4 h-4 mr-2" />
        शिक्षा की जानकारी
      </h4>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`student-${member.id}`}
              checked={member.isStudent}
              onCheckedChange={(checked) => onUpdateMember(member.id, "isStudent", checked)}
            />
            <Label htmlFor={`student-${member.id}`} className="hindi-text text-sm">
              वर्तमान में छात्र/छात्रा है
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`currentlyEnrolled-${member.id}`}
              checked={member.isCurrentlyEnrolled}
              onCheckedChange={(checked) => onUpdateMember(member.id, "isCurrentlyEnrolled", checked)}
            />
            <Label htmlFor={`currentlyEnrolled-${member.id}`} className="hindi-text text-sm">
              वर्तमान में नामांकित है
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`studyingAbroad-${member.id}`}
              checked={member.isStudyingAbroad}
              onCheckedChange={(checked) => onUpdateMember(member.id, "isStudyingAbroad", checked)}
            />
            <Label htmlFor={`studyingAbroad-${member.id}`} className="hindi-text text-sm">
              विदेश में पढ़ाई कर रहे हैं
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`helpFromSamaj-${member.id}`}
              checked={member.isHelpRequiredFromSamaj}
              onCheckedChange={(checked) => onUpdateMember(member.id, "isHelpRequiredFromSamaj", checked)}
            />
            <Label htmlFor={`helpFromSamaj-${member.id}`} className="hindi-text text-sm">
              समाज से सहायता चाहिए
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`scholarship-${member.id}`}
              checked={member.scholarshipReceived}
              onCheckedChange={(checked) => onUpdateMember(member.id, "scholarshipReceived", checked)}
            />
            <Label htmlFor={`scholarship-${member.id}`} className="hindi-text text-sm">
              छात्रवृत्ति प्राप्त है
            </Label>
          </div>
        </div>

        <div className="mobile-form-grid">
          <div>
            <Label className="hindi-text text-sm">शिक्षा का स्तर</Label>
            <Select
              value={member.educationLevel}
              onValueChange={(value) => onUpdateMember(member.id, "educationLevel", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="शिक्षा का स्तर चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="illiterate">निरक्षर</SelectItem>
                <SelectItem value="primary">प्राथमिक (कक्षा 1-5)</SelectItem>
                <SelectItem value="middle">मध्य (कक्षा 6-8)</SelectItem>
                <SelectItem value="secondary">माध्यमिक (कक्षा 9-10)</SelectItem>
                <SelectItem value="higher_secondary">उच्च माध्यमिक (कक्षा 11-12)</SelectItem>
                <SelectItem value="undergraduate">स्नातक</SelectItem>
                <SelectItem value="postgraduate">स्नातकोत्तर</SelectItem>
                <SelectItem value="doctorate">डॉक्टरेट</SelectItem>
                <SelectItem value="diploma">डिप्लोमा</SelectItem>
                <SelectItem value="certificate">प्रमाणपत्र कोर्स</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="hindi-text text-sm">पूर्ण की गई कक्षा</Label>
            <Select
              value={member.classCompleted}
              onValueChange={(value) => onUpdateMember(member.id, "classCompleted", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="पूर्ण की गई कक्षा चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">कोई नहीं</SelectItem>
                <SelectItem value="1">कक्षा 1</SelectItem>
                <SelectItem value="2">कक्षा 2</SelectItem>
                <SelectItem value="3">कक्षा 3</SelectItem>
                <SelectItem value="4">कक्षा 4</SelectItem>
                <SelectItem value="5">कक्षा 5</SelectItem>
                <SelectItem value="6">कक्षा 6</SelectItem>
                <SelectItem value="7">कक्षा 7</SelectItem>
                <SelectItem value="8">कक्षा 8</SelectItem>
                <SelectItem value="9">कक्षा 9</SelectItem>
                <SelectItem value="10">कक्षा 10</SelectItem>
                <SelectItem value="11">कक्षा 11</SelectItem>
                <SelectItem value="12">कक्षा 12</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {member.isStudent && (
            <div>
              <Label className="hindi-text text-sm">वर्तमान कक्षा</Label>
              <Select
                value={member.currentClass || ""}
                onValueChange={(value) => onUpdateMember(member.id, "currentClass", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="वर्तमान कक्षा चुनें" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">कक्षा 1</SelectItem>
                  <SelectItem value="2">कक्षा 2</SelectItem>
                  <SelectItem value="3">कक्षा 3</SelectItem>
                  <SelectItem value="4">कक्षा 4</SelectItem>
                  <SelectItem value="5">कक्षा 5</SelectItem>
                  <SelectItem value="6">कक्षा 6</SelectItem>
                  <SelectItem value="7">कक्षा 7</SelectItem>
                  <SelectItem value="8">कक्षा 8</SelectItem>
                  <SelectItem value="9">कक्षा 9</SelectItem>
                  <SelectItem value="10">कक्षा 10</SelectItem>
                  <SelectItem value="11">कक्षा 11</SelectItem>
                  <SelectItem value="12">कक्षा 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="hindi-text text-sm">कॉलेज कोर्स</Label>
            <Input
              value={member.collegeCourse}
              onChange={(e) => onUpdateMember(member.id, "collegeCourse", e.target.value)}
              placeholder="कॉलेज कोर्स का नाम"
              className="mt-1 text-sm"
            />
          </div>

          <div>
            <Label className="hindi-text text-sm">संस्थान का नाम</Label>
            <Input
              value={member.institutionName}
              onChange={(e) => onUpdateMember(member.id, "institutionName", e.target.value)}
              placeholder="स्कूल/कॉलेज/विश्वविद्यालय का नाम"
              className="mt-1 text-sm"
            />
          </div>

          <div>
            <Label className="hindi-text text-sm">स्कूल का नाम</Label>
            <Input
              value={member.schoolName || ""}
              onChange={(e) => onUpdateMember(member.id, "schoolName", e.target.value)}
              placeholder="स्कूल का नाम"
              className="mt-1 text-sm"
            />
          </div>

          <div>
            <Label className="hindi-text text-sm">शिक्षा का तरीका</Label>
            <Select
              value={member.educationMode || ""}
              onValueChange={(value) => onUpdateMember(member.id, "educationMode", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="शिक्षा का तरीका चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">नियमित</SelectItem>
                <SelectItem value="distance">दूरस्थ शिक्षा</SelectItem>
                <SelectItem value="online">ऑनलाइन</SelectItem>
                <SelectItem value="correspondence">पत्राचार</SelectItem>
                <SelectItem value="part_time">अंशकालिक</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="hindi-text text-sm">वर्तमान शिक्षा शहर</Label>
            <Input
              value={member.currentEducationCity || ""}
              onChange={(e) => onUpdateMember(member.id, "currentEducationCity", e.target.value)}
              placeholder="शिक्षा प्राप्त कर रहे शहर का नाम"
              className="mt-1 text-sm"
            />
          </div>

          <div>
            <Label className="hindi-text text-sm">वर्तमान शिक्षा देश</Label>
            <Input
              value={member.currentEducationCountry || ""}
              onChange={(e) => onUpdateMember(member.id, "currentEducationCountry", e.target.value)}
              placeholder="शिक्षा प्राप्त कर रहे देश का नाम"
              className="mt-1 text-sm"
            />
          </div>

          <div>
            <Label className="hindi-text text-sm">बोर्ड/विश्वविद्यालय</Label>
            <Input
              value={member.boardOrUniversity || ""}
              onChange={(e) => onUpdateMember(member.id, "boardOrUniversity", e.target.value)}
              placeholder="बोर्ड या विश्वविद्यालय का नाम"
              className="mt-1 text-sm"
            />
          </div>

          <div>
            <Label className="hindi-text text-sm">अध्ययन क्षेत्र</Label>
            <Input
              value={member.fieldOfStudy || ""}
              onChange={(e) => onUpdateMember(member.id, "fieldOfStudy", e.target.value)}
              placeholder="अध्ययन का विषय/क्षेत्र"
              className="mt-1 text-sm"
            />
          </div>

          <div>
            <Label className="hindi-text text-sm">उत्तीर्ण वर्ष</Label>
            <Input
              type="number"
              value={member.yearOfPassing || ""}
              onChange={(e) => onUpdateMember(member.id, "yearOfPassing", Number.parseInt(e.target.value) || undefined)}
              placeholder="उत्तीर्ण होने का वर्ष"
              min="1950"
              max={new Date().getFullYear() + 10}
              className="mt-1 text-sm"
            />
          </div>
        </div>

        {member.scholarshipReceived && (
          <div>
            <Label className="hindi-text text-sm">छात्रवृत्ति विवरण</Label>
            <Textarea
              value={member.scholarshipDetails || ""}
              onChange={(e) => onUpdateMember(member.id, "scholarshipDetails", e.target.value)}
              placeholder="छात्रवृत्ति का विवरण"
              className="mt-1 text-sm"
              rows={2}
            />
          </div>
        )}

        {member.enrollmentStatus === "dropped" && (
          <div>
            <Label className="hindi-text text-sm">छोड़ने का कारण</Label>
            <Input
              value={member.dropoutReason || ""}
              onChange={(e) => onUpdateMember(member.id, "dropoutReason", e.target.value)}
              placeholder="छोड़ने का कारण बताएं"
              className="mt-1 text-sm"
            />
          </div>
        )}
      </div>
    </div>
  )
}
