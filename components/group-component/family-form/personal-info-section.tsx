"use client"

import { User, Calendar, Phone, Mail } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { MemberFormProps } from "./types"

export function PersonalInfoSection({ member, index, errors, onUpdateMember }: MemberFormProps) {
  return (
    <div>
      <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text text-sm sm:text-base">
        <User className="w-4 h-4 mr-2" />
        व्यक्तिगत जानकारी
      </h4>
      <div className="mobile-form-grid">
        <div>
          <Label className="hindi-text text-sm">पहला नाम *</Label>
          <Input
            value={member.firstName}
            onChange={(e) => onUpdateMember(member.id, "firstName", e.target.value)}
            placeholder="पहला नाम दर्ज करें"
            className={`mt-1 text-sm ${errors[`member-${index}-firstName`] ? "border-red-500" : ""}`}
          />
          {errors[`member-${index}-firstName`] && (
            <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`member-${index}-firstName`]}</p>
          )}
        </div>
        <div>
          <Label className="hindi-text text-sm">अंतिम नाम *</Label>
          <Input
            value={member.lastName}
            onChange={(e) => onUpdateMember(member.id, "lastName", e.target.value)}
            placeholder="अंतिम नाम दर्ज करें"
            className={`mt-1 text-sm ${errors[`member-${index}-lastName`] ? "border-red-500" : ""}`}
          />
          {errors[`member-${index}-lastName`] && (
            <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`member-${index}-lastName`]}</p>
          )}
        </div>
        <div>
          <Label className="hindi-text flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            जन्म तिथि *
          </Label>
          <Input
            type="date"
            value={member.dateOfBirth || ""}
            onChange={(e) => onUpdateMember(member.id, "dateOfBirth", e.target.value)}
            className={`mt-1 text-sm ${errors[`member-${index}-dob`] ? "border-red-500" : ""}`}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors[`member-${index}-dob`] && (
            <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`member-${index}-dob`]}</p>
          )}
        </div>
        <div>
          <Label className="hindi-text text-sm">उम्र</Label>
          <Input
            type="number"
            value={member.age || ""}
            readOnly
            placeholder="जन्म तिथि से गणना होगी"
            className="bg-gray-50 cursor-not-allowed mt-1 text-sm"
          />
          <p className="text-xs text-gray-500 mt-1 hindi-text">जन्म तिथि के आधार पर स्वचालित गणना</p>
        </div>
        <div>
          <Label className="hindi-text flex items-center text-sm">
            <Phone className="w-4 h-4 mr-1" />
            मोबाइल नंबर
          </Label>
          <Input
            value={member.mobileNumber}
            onChange={(e) => onUpdateMember(member.id, "mobileNumber", e.target.value)}
            placeholder="10 अंकों का मोबाइल नंबर"
            maxLength={10}
            className={`mt-1 text-sm ${errors[`member-${index}-mobile`] ? "border-red-500" : ""}`}
          />
          {errors[`member-${index}-mobile`] && (
            <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`member-${index}-mobile`]}</p>
          )}
        </div>
        <div>
          <Label className="hindi-text flex items-center text-sm">
            <Mail className="w-4 h-4 mr-1" />
            ईमेल पता
          </Label>
          <Input
            type="email"
            value={member.email}
            onChange={(e) => onUpdateMember(member.id, "email", e.target.value)}
            placeholder="example@email.com"
            className={`mt-1 text-sm ${errors[`member-${index}-email`] ? "border-red-500" : ""}`}
          />
          {errors[`member-${index}-email`] && (
            <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`member-${index}-email`]}</p>
          )}
        </div>
        <div>
          <Label className="hindi-text text-sm">लिंग</Label>
          <Select value={member.gender} onValueChange={(value) => onUpdateMember(member.id, "gender", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">पुरुष</SelectItem>
              <SelectItem value="FEMALE">महिला</SelectItem>
              <SelectItem value="OTHER">अन्य</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="hindi-text text-sm">रिश्ता</Label>
          <Select value={member.relation} onValueChange={(value) => onUpdateMember(member.id, "relation", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="रिश्ता चुनें" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="self">स्वयं</SelectItem>
              <SelectItem value="spouse">पति/पत्नी</SelectItem>
              <SelectItem value="son">पुत्र</SelectItem>
              <SelectItem value="daughter">पुत्री</SelectItem>
              <SelectItem value="father">पिता</SelectItem>
              <SelectItem value="mother">माता</SelectItem>
              <SelectItem value="brother">भाई</SelectItem>
              <SelectItem value="sister">बहन</SelectItem>
              <SelectItem value="grandfather">दादा/नाना</SelectItem>
              <SelectItem value="grandmother">दादी/नानी</SelectItem>
              <SelectItem value="uncle">चाचा/मामा</SelectItem>
              <SelectItem value="aunt">चाची/मामी</SelectItem>
              <SelectItem value="nephew">भतीजा/भांजा</SelectItem>
              <SelectItem value="niece">भतीजी/भांजी</SelectItem>
              <SelectItem value="son_in_law">दामाद</SelectItem>
              <SelectItem value="daughter_in_law">बहू</SelectItem>
              <SelectItem value="other">अन्य</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="hindi-text text-sm">वैवाहिक स्थिति</Label>
          <Select
            value={member.maritalStatus}
            onValueChange={(value) => onUpdateMember(member.id, "maritalStatus", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="चुनें" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unmarried">अविवाहित</SelectItem>
              <SelectItem value="married">विवाहित</SelectItem>
              <SelectItem value="widowed">विधवा/विधुर</SelectItem>
              <SelectItem value="divorced">तलाकशुदा</SelectItem>
              <SelectItem value="separated">अलग रह रहे</SelectItem>
              <SelectItem value="engaged">सगाई हो गई</SelectItem>
              <SelectItem value="remarried">पुनर्विवाह</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="hindi-text text-sm">गोत्र</Label>
          <Input
            value={member.gotra}
            onChange={(e) => onUpdateMember(member.id, "gotra", e.target.value)}
            placeholder="गोत्र का नाम"
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="hindi-text text-sm">ब्लड ग्रुप</Label>
          <Select value={member.bloodGroup} onValueChange={(value) => onUpdateMember(member.id, "bloodGroup", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="ब्लड ग्रुप चुनें" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`disability-${member.id}`}
            checked={member.disability}
            onCheckedChange={(checked) => onUpdateMember(member.id, "disability", checked)}
          />
          <Label htmlFor={`disability-${member.id}`} className="hindi-text text-sm">
            विकलांगता है
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`mukhiya-${member.id}`}
            checked={member.isMukhiya}
            onCheckedChange={(checked) => onUpdateMember(member.id, "isMukhiya", checked)}
          />
          <Label htmlFor={`mukhiya-${member.id}`} className="font-medium text-orange-700 hindi-text text-sm">
            मुखिया है
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`samuhikVivah-${member.id}`}
            checked={member.isInterestedInFutureSamuhikVivah}
            onCheckedChange={(checked) => onUpdateMember(member.id, "isInterestedInFutureSamuhikVivah", checked)}
          />
          <Label htmlFor={`samuhikVivah-${member.id}`} className="hindi-text text-sm">
            सामूहिक विवाह में रुचि
          </Label>
        </div>
      </div>
    </div>
  )
}
