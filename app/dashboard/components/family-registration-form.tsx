"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, User, Users, Save, Send, Eye, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface Member {
  id: string
  fullName: string
  relation: string
  isMukhiya: boolean
  dateOfBirth: string
  gender: string
  aadhaar: string
  maritalStatus: string
  qualification: string
  currentlyStudying: boolean
  institutionName: string
  educationStream: string
  occupation: string
  employerName: string
  workLocation: string
  monthlyIncome: string
  isMigrant: boolean
  currentState: string
  currentDistrict: string
  healthStatus: string
  hasHealthInsurance: boolean
  hasLifeInsurance: boolean
  hasAccidentInsurance: boolean
  hasGovtSchemes: boolean
  memberMobile: string
  memberEmail: string
}

interface FamilyData {
  chokhra: string
  village: string
  villageId: string
  parivarId: string
  familyHead: string
  mobile: string
  email: string
  address: string
  pinCode: string
  familyCardIssued: boolean
  verificationStatus: string
  members: Member[]
}

const villages = ["गांव 1", "गांव 2", "गांव 3", "गांव 4", "गांव 5"]

const relations = ["Self", "Wife", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Other"]

const qualifications = [
  "Illiterate",
  "Primary",
  "Secondary",
  "Higher Secondary",
  "Diploma",
  "Graduate",
  "Post Graduate",
  "PhD",
  "Other",
]

const occupations = [
  "Student",
  "Farmer",
  "Govt Employee",
  "Private Job",
  "Business",
  "Self-employed",
  "Homemaker",
  "Retired",
  "Unemployed",
  "Other",
]

const states = ["राजस्थान", "गुजरात", "महाराष्ट्र", "मध्य प्रदेश", "उत्तर प्रदेश", "दिल्ली", "मुंबई", "Other"]

interface FamilyRegistrationFormProps {
  chokhra: string
  onBack: () => void
}

export function FamilyRegistrationForm({ chokhra, onBack }: FamilyRegistrationFormProps) {
  const [formData, setFormData] = useState<FamilyData>({
    chokhra: chokhra,
    village: "",
    villageId: "",
    parivarId: `PID${Date.now()}`,
    familyHead: "",
    mobile: "",
    email: "",
    address: "",
    pinCode: "",
    familyCardIssued: false,
    verificationStatus: "Pending",
    members: [],
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [showSummary, setShowSummary] = useState(false)

  const addMember = () => {
    const newMember: Member = {
      id: `member_${Date.now()}`,
      fullName: "",
      relation: "",
      isMukhiya: formData.members.length === 0,
      dateOfBirth: "",
      gender: "",
      aadhaar: "",
      maritalStatus: "",
      qualification: "",
      currentlyStudying: false,
      institutionName: "",
      educationStream: "",
      occupation: "",
      employerName: "",
      workLocation: "",
      monthlyIncome: "",
      isMigrant: false,
      currentState: "",
      currentDistrict: "",
      healthStatus: "Healthy",
      hasHealthInsurance: false,
      hasLifeInsurance: false,
      hasAccidentInsurance: false,
      hasGovtSchemes: false,
      memberMobile: "",
      memberEmail: "",
    }
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }))
  }

  const removeMember = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }))
  }

  const updateMember = (memberId: string, field: keyof Member, value: any) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === memberId ? { ...m, [field]: value } : m)),
    }))
  }

  const handleSubmit = (isDraft: boolean) => {
    if (isDraft) {
      alert("परिवार की जानकारी ड्राफ्ट के रूप में सेव हो गई है!")
    } else {
      alert("परिवार की जानकारी सत्यापन के लिए भेज दी गई है!")
    }
    onBack()
  }

  if (showSummary) {
    return <FamilySummary formData={formData} onBack={() => setShowSummary(false)} onSubmit={handleSubmit} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">परिवार पंजीकरण फॉर्म</h2>
          <p className="text-gray-600">नया परिवार जोड़ें - {chokhra} चोखरा</p>
        </div>
        <Button variant="outline" onClick={onBack} className="border-orange-200 text-orange-600 bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          वापस जाएं
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                currentStep >= step
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                  : "bg-gray-200 text-gray-500",
              )}
            >
              {step}
            </div>
            {step < 3 && <div className={cn("w-16 h-1 mx-2", currentStep > step ? "bg-orange-500" : "bg-gray-200")} />}
          </div>
        ))}
      </div>

      {/* Step 1: Village & Family Info */}
      {currentStep === 1 && (
        <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-700 flex items-center">
              <User className="w-5 h-5 mr-2" />
              गांव और परिवार की जानकारी
            </CardTitle>
            <CardDescription>बुनियादी परिवार की जानकारी भरें</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-orange-700 font-medium">चोखरा नाम</Label>
                <Input value={formData.chokhra} disabled className="bg-orange-50" />
              </div>
              <div>
                <Label className="text-orange-700 font-medium">गांव का नाम *</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, village: value, villageId: `VID${Date.now()}` }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="गांव चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {villages.map((village) => (
                      <SelectItem key={village} value={village}>
                        {village}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-orange-700 font-medium">गांव ID</Label>
                <Input value={formData.villageId} disabled className="bg-orange-50" />
              </div>
              <div>
                <Label className="text-orange-700 font-medium">परिवार ID</Label>
                <Input value={formData.parivarId} disabled className="bg-orange-50" />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-700">परिवार मुखिया की जानकारी</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-orange-700 font-medium">मुखिया का नाम *</Label>
                  <Input
                    value={formData.familyHead}
                    onChange={(e) => setFormData((prev) => ({ ...prev, familyHead: e.target.value }))}
                    placeholder="राम पंचाल"
                  />
                </div>
                <div>
                  <Label className="text-orange-700 font-medium">मोबाइल नंबर *</Label>
                  <Input
                    value={formData.mobile}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
                    placeholder="10 अंकों का नंबर"
                    maxLength={10}
                  />
                </div>
                <div>
                  <Label className="text-orange-700 font-medium">ईमेल (वैकल्पिक)</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="ram.panchal@example.com"
                  />
                </div>
                <div>
                  <Label className="text-orange-700 font-medium">पिन कोड *</Label>
                  <Input
                    value={formData.pinCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, pinCode: e.target.value }))}
                    placeholder="6 अंकों का पिन कोड"
                    maxLength={6}
                  />
                </div>
              </div>
              <div>
                <Label className="text-orange-700 font-medium">स्थायी पता *</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="पूरा पता दर्ज करें"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-orange-700 font-medium">क्या पारिवारिक कार्ड जारी है?</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.familyCardIssued}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, familyCardIssued: !!checked }))}
                    />
                    <Label>हाँ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={!formData.familyCardIssued}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, familyCardIssued: !checked }))}
                    />
                    <Label>नहीं</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-orange-700 font-medium">सत्यापन स्थिति</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, verificationStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="स्थिति चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verified">सत्यापित</SelectItem>
                    <SelectItem value="Pending">लंबित</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentStep(2)}
                className="bg-gradient-to-r from-orange-500 to-orange-600"
                disabled={!formData.village || !formData.familyHead || !formData.mobile}
              >
                अगला कदम
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Members */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-orange-700 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    परिवार के सदस्य ({formData.members.length})
                  </CardTitle>
                  <CardDescription>प्रत्येक सदस्य की विस्तृत जानकारी भरें</CardDescription>
                </div>
                <Button onClick={addMember} className="bg-gradient-to-r from-green-500 to-green-600">
                  <Plus className="w-4 h-4 mr-2" />
                  सदस्य जोड़ें
                </Button>
              </div>
            </CardHeader>
          </Card>

          {formData.members.map((member, index) => (
            <MemberForm
              key={member.id}
              member={member}
              index={index}
              onUpdate={(field, value) => updateMember(member.id, field, value)}
              onRemove={() => removeMember(member.id)}
              canRemove={formData.members.length > 1}
            />
          ))}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              पिछला कदम
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              className="bg-gradient-to-r from-orange-500 to-orange-600"
              disabled={formData.members.length === 0}
            >
              अगला कदम
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-700">समीक्षा और सबमिशन</CardTitle>
            <CardDescription>सभी जानकारी की जांच करें और फॉर्म सबमिट करें</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-700">{formData.members.length}</div>
                <div className="text-sm text-orange-600">कुल सदस्य</div>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700">{formData.familyCardIssued ? "जारी" : "लंबित"}</div>
                <div className="text-sm text-blue-600">पारिवारिक कार्ड</div>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-700">{formData.verificationStatus}</div>
                <div className="text-sm text-green-600">सत्यापन स्थिति</div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => setShowSummary(true)}
                variant="outline"
                className="border-orange-200 text-orange-600"
              >
                <Eye className="w-4 h-4 mr-2" />
                विस्तृत समीक्षा देखें
              </Button>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                पिछला कदम
              </Button>
              <div className="space-x-3">
                <Button
                  onClick={() => handleSubmit(true)}
                  variant="outline"
                  className="border-orange-200 text-orange-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  ड्राफ्ट सेव करें
                </Button>
                <Button onClick={() => handleSubmit(false)} className="bg-gradient-to-r from-orange-500 to-orange-600">
                  <Send className="w-4 h-4 mr-2" />
                  सत्यापन के लिए भेजें
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Member Form Component
function MemberForm({
  member,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  member: Member
  index: number
  onUpdate: (field: keyof Member, value: any) => void
  onRemove: () => void
  canRemove: boolean
}) {
  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-700">
            सदस्य #{index + 1} - {member.fullName || "नाम दर्ज करें"}
          </CardTitle>
          {canRemove && (
            <Button
              onClick={onRemove}
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h4 className="font-semibold text-blue-700">बुनियादी जानकारी</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>पूरा नाम *</Label>
              <Input
                value={member.fullName}
                onChange={(e) => onUpdate("fullName", e.target.value)}
                placeholder="राम पंचाल"
              />
            </div>
            <div>
              <Label>मुखिया से रिश्ता *</Label>
              <Select onValueChange={(value) => onUpdate("relation", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="रिश्ता चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {relations.map((relation) => (
                    <SelectItem key={relation} value={relation}>
                      {relation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>जन्म तिथि *</Label>
              <Input type="date" value={member.dateOfBirth} onChange={(e) => onUpdate("dateOfBirth", e.target.value)} />
            </div>
            <div>
              <Label>लिंग *</Label>
              <Select onValueChange={(value) => onUpdate("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="लिंग चुनें" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">पुरुष</SelectItem>
                  <SelectItem value="Female">महिला</SelectItem>
                  <SelectItem value="Other">अन्य</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>आधार नंबर (वैकल्पिक)</Label>
              <Input
                value={member.aadhaar}
                onChange={(e) => onUpdate("aadhaar", e.target.value)}
                placeholder="12 अंकों का आधार नंबर"
                maxLength={12}
              />
            </div>
            <div>
              <Label>वैवाहिक स्थिति</Label>
              <Select onValueChange={(value) => onUpdate("maritalStatus", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="स्थिति चुनें" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Married">विवाहित</SelectItem>
                  <SelectItem value="Unmarried">अविवाहित</SelectItem>
                  <SelectItem value="Widow/Widower">विधवा/विधुर</SelectItem>
                  <SelectItem value="Divorced">तलाकशुदा</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox checked={member.isMukhiya} onCheckedChange={(checked) => onUpdate("isMukhiya", !!checked)} />
            <Label>क्या यह सदस्य मुखिया है?</Label>
          </div>
        </div>

        <Separator />

        {/* Education */}
        <div className="space-y-4">
          <h4 className="font-semibold text-blue-700">शिक्षा विवरण</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>उच्चतम योग्यता</Label>
              <Select onValueChange={(value) => onUpdate("qualification", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="योग्यता चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {qualifications.map((qual) => (
                    <SelectItem key={qual} value={qual}>
                      {qual}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>शिक्षा स्ट्रीम</Label>
              <Input
                value={member.educationStream}
                onChange={(e) => onUpdate("educationStream", e.target.value)}
                placeholder="जैसे: Science, Commerce, Arts"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={member.currentlyStudying}
              onCheckedChange={(checked) => onUpdate("currentlyStudying", !!checked)}
            />
            <Label>क्या वर्तमान में पढ़ाई कर रहे हैं?</Label>
          </div>

          {member.currentlyStudying && (
            <div>
              <Label>संस्थान का नाम</Label>
              <Input
                value={member.institutionName}
                onChange={(e) => onUpdate("institutionName", e.target.value)}
                placeholder="स्कूल/कॉलेज का नाम"
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Employment */}
        <div className="space-y-4">
          <h4 className="font-semibold text-blue-700">नौकरी और रोजगार</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>व्यवसाय</Label>
              <Select onValueChange={(value) => onUpdate("occupation", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="व्यवसाय चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {occupations.map((occ) => (
                    <SelectItem key={occ} value={occ}>
                      {occ}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>नियोक्ता/कंपनी का नाम</Label>
              <Input
                value={member.employerName}
                onChange={(e) => onUpdate("employerName", e.target.value)}
                placeholder="कंपनी का नाम"
              />
            </div>
            <div>
              <Label>कार्य स्थान</Label>
              <Input
                value={member.workLocation}
                onChange={(e) => onUpdate("workLocation", e.target.value)}
                placeholder="काम की जगह"
              />
            </div>
            <div>
              <Label>मासिक आय (लगभग)</Label>
              <Input
                type="number"
                value={member.monthlyIncome}
                onChange={(e) => onUpdate("monthlyIncome", e.target.value)}
                placeholder="₹ में आय"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Health & Migration */}
        <div className="space-y-4">
          <h4 className="font-semibold text-blue-700">स्वास्थ्य और प्रवास</h4>

          <div className="flex items-center space-x-2">
            <Checkbox checked={member.isMigrant} onCheckedChange={(checked) => onUpdate("isMigrant", !!checked)} />
            <Label>क्या प्रवासी सदस्य है?</Label>
          </div>

          {member.isMigrant && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>वर्तमान राज्य</Label>
                <Select onValueChange={(value) => onUpdate("currentState", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="राज्य चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>वर्तमान जिला</Label>
                <Input
                  value={member.currentDistrict}
                  onChange={(e) => onUpdate("currentDistrict", e.target.value)}
                  placeholder="जिला का नाम"
                />
              </div>
            </div>
          )}

          <div>
            <Label>स्वास्थ्य स्थिति</Label>
            <Select onValueChange={(value) => onUpdate("healthStatus", value)}>
              <SelectTrigger>
                <SelectValue placeholder="स्वास्थ्य स्थिति चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Healthy">स्वस्थ</SelectItem>
                <SelectItem value="Chronically Ill">दीर्घकालिक बीमार</SelectItem>
                <SelectItem value="Differently-abled">दिव्यांग</SelectItem>
                <SelectItem value="Under Treatment">इलाज के तहत</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>बीमा विकल्प</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={member.hasHealthInsurance}
                  onCheckedChange={(checked) => onUpdate("hasHealthInsurance", !!checked)}
                />
                <Label>स्वास्थ्य बीमा</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={member.hasLifeInsurance}
                  onCheckedChange={(checked) => onUpdate("hasLifeInsurance", !!checked)}
                />
                <Label>जीवन बीमा</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={member.hasAccidentInsurance}
                  onCheckedChange={(checked) => onUpdate("hasAccidentInsurance", !!checked)}
                />
                <Label>दुर्घटना बीमा</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={member.hasGovtSchemes}
                  onCheckedChange={(checked) => onUpdate("hasGovtSchemes", !!checked)}
                />
                <Label>सरकारी योजनाएं</Label>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="font-semibold text-blue-700">संपर्क जानकारी (वैकल्पिक)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>सदस्य का मोबाइल नंबर</Label>
              <Input
                value={member.memberMobile}
                onChange={(e) => onUpdate("memberMobile", e.target.value)}
                placeholder="10 अंकों का नंबर"
                maxLength={10}
              />
            </div>
            <div>
              <Label>सदस्य का ईमेल</Label>
              <Input
                type="email"
                value={member.memberEmail}
                onChange={(e) => onUpdate("memberEmail", e.target.value)}
                placeholder="ram.panchal@example.com"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Family Summary Component
function FamilySummary({
  formData,
  onBack,
  onSubmit,
}: {
  formData: FamilyData
  onBack: () => void
  onSubmit: (isDraft: boolean) => void
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">परिवार की विस्तृत समीक्षा</h2>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          वापस जाएं
        </Button>
      </div>

      {/* Family Info Summary */}
      <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-700">परिवार की जानकारी</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>चोखरा:</strong> {formData.chokhra}
            </div>
            <div>
              <strong>गांव:</strong> {formData.village}
            </div>
            <div>
              <strong>परिवार ID:</strong> {formData.parivarId}
            </div>
            <div>
              <strong>मुखिया:</strong> {formData.familyHead}
            </div>
            <div>
              <strong>मोबाइल:</strong> {formData.mobile}
            </div>
            <div>
              <strong>पिन कोड:</strong> {formData.pinCode}
            </div>
            <div>
              <strong>पारिवारिक कार्ड:</strong> {formData.familyCardIssued ? "जारी" : "लंबित"}
            </div>
            <div>
              <strong>सत्यापन:</strong> {formData.verificationStatus}
            </div>
          </div>
          <div className="mt-4">
            <strong>पता:</strong> {formData.address}
          </div>
        </CardContent>
      </Card>

      {/* Members Summary */}
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700">सदस्यों की सूची ({formData.members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.members.map((member, index) => (
              <div key={member.id} className="p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {index + 1}. {member.fullName}
                    {member.isMukhiya && <Badge className="ml-2 bg-orange-500">मुखिया</Badge>}
                  </h4>
                  <Badge variant="outline">{member.relation}</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                  <div>
                    <strong>लिंग:</strong> {member.gender}
                  </div>
                  <div>
                    <strong>व्यवसाय:</strong> {member.occupation}
                  </div>
                  <div>
                    <strong>योग्यता:</strong> {member.qualification}
                  </div>
                  <div>
                    <strong>प्रवासी:</strong> {member.isMigrant ? "हाँ" : "नहीं"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button onClick={() => onSubmit(true)} variant="outline" className="border-orange-200 text-orange-600">
          <Save className="w-4 h-4 mr-2" />
          ड्राफ्ट सेव करें
        </Button>
        <Button onClick={() => onSubmit(false)} className="bg-gradient-to-r from-orange-500 to-orange-600">
          <Send className="w-4 h-4 mr-2" />
          सत्यापन के लिए भेजें
        </Button>
      </div>
    </div>
  )
}
