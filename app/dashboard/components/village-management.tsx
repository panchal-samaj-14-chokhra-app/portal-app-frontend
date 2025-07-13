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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, User, Users, ArrowLeft, HomeIcon, MapPin } from "lucide-react"

// Types
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

interface Family {
  id: string
  parivarId: string
  familyHead: string
  mobile: string
  email: string
  address: string
  pinCode: string
  familyCardIssued: boolean
  verificationStatus: string
  members: Member[]
  villageId: string
}

interface Village {
  id: string
  name: string
  villageId: string
  gaonAdmin: string
  adminContact: string
  description: string
  status: string
  families: Family[]
}

// Constants
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

interface VillageManagementProps {
  chokhra: string
  onBack: () => void
}

export function VillageManagement({ chokhra, onBack }: VillageManagementProps) {
  const [villages, setVillages] = useState<Village[]>([
    {
      id: "v1",
      name: "गांव 1",
      villageId: "VID001",
      gaonAdmin: "राम पंचाल",
      adminContact: "9876543210",
      description: "मुख्य गांव",
      status: "Active",
      families: [],
    },
    {
      id: "v2",
      name: "गांव 2",
      villageId: "VID002",
      gaonAdmin: "श्याम पंचाल",
      adminContact: "9876543211",
      description: "द्वितीय गांव",
      status: "Active",
      families: [],
    },
  ])

  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null)
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null)
  const [showAddVillage, setShowAddVillage] = useState(false)
  const [showAddFamily, setShowAddFamily] = useState(false)
  const [activeTab, setActiveTab] = useState("villages")

  const addVillage = (villageData: Partial<Village>) => {
    const newVillage: Village = {
      id: `v${Date.now()}`,
      name: villageData.name || "",
      villageId: `VID${Date.now()}`,
      gaonAdmin: villageData.gaonAdmin || "",
      adminContact: villageData.adminContact || "",
      description: villageData.description || "",
      status: "Active",
      families: [],
    }
    setVillages((prev) => [...prev, newVillage])
    setShowAddVillage(false)
  }

  const addFamily = (familyData: Partial<Family>) => {
    if (!selectedVillage) return

    const newFamily: Family = {
      id: `f${Date.now()}`,
      parivarId: `PID${Date.now()}`,
      familyHead: familyData.familyHead || "",
      mobile: familyData.mobile || "",
      email: familyData.email || "",
      address: familyData.address || "",
      pinCode: familyData.pinCode || "",
      familyCardIssued: familyData.familyCardIssued || false,
      verificationStatus: "Pending",
      members: [],
      villageId: selectedVillage.id,
    }

    setVillages((prev) =>
      prev.map((v) => (v.id === selectedVillage.id ? { ...v, families: [...v.families, newFamily] } : v)),
    )
    setShowAddFamily(false)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">गांव प्रबंधन</h2>
          <p className="text-gray-600">{chokhra} चोखरा - गांव, परिवार और सदस्य प्रबंधन</p>
        </div>
        <Button variant="outline" onClick={onBack} className="border-orange-200 text-orange-600 bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          डैशबोर्ड
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="villages" className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            गांव सूची
          </TabsTrigger>
          <TabsTrigger value="families" className="flex items-center">
            <HomeIcon className="w-4 h-4 mr-2" />
            परिवार प्रबंधन
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            सदस्य प्रबंधन
          </TabsTrigger>
        </TabsList>

        {/* Villages Tab */}
        <TabsContent value="villages" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">गांव की सूची ({villages.length})</h3>
            <Button onClick={() => setShowAddVillage(true)} className="bg-gradient-to-r from-green-500 to-green-600">
              <Plus className="w-4 h-4 mr-2" />
              नया गांव जोड़ें
            </Button>
          </div>

          {showAddVillage && <AddVillageForm onAdd={addVillage} onCancel={() => setShowAddVillage(false)} />}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {villages.map((village) => (
              <VillageCard
                key={village.id}
                village={village}
                onSelect={() => {
                  setSelectedVillage(village)
                  setActiveTab("families")
                }}
              />
            ))}
          </div>
        </TabsContent>

        {/* Families Tab */}
        <TabsContent value="families" className="space-y-6">
          {!selectedVillage ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-orange-100 to-white p-8 rounded-lg border border-orange-200">
                <MapPin className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-orange-700 mb-2">पहले गांव चुनें</h3>
                <p className="text-gray-600 mb-4">परिवार प्रबंधन के लिए पहले कोई गांव चुनें</p>
                <Button
                  onClick={() => setActiveTab("villages")}
                  className="bg-gradient-to-r from-orange-500 to-orange-600"
                >
                  गांव चुनें
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedVillage.name} - परिवार सूची ({selectedVillage.families.length})
                  </h3>
                  <p className="text-gray-600">गांव ID: {selectedVillage.villageId}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setSelectedVillage(null)} className="border-gray-200">
                    गांव बदलें
                  </Button>
                  <Button onClick={() => setShowAddFamily(true)} className="bg-gradient-to-r from-blue-500 to-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    नया परिवार जोड़ें
                  </Button>
                </div>
              </div>

              {showAddFamily && (
                <AddFamilyForm village={selectedVillage} onAdd={addFamily} onCancel={() => setShowAddFamily(false)} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedVillage.families.map((family) => (
                  <FamilyCard
                    key={family.id}
                    family={family}
                    onSelect={() => {
                      setSelectedFamily(family)
                      setActiveTab("members")
                    }}
                  />
                ))}
              </div>

              {selectedVillage.families.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-blue-100 to-white p-8 rounded-lg border border-blue-200">
                    <HomeIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-blue-700 mb-2">कोई परिवार नहीं मिला</h3>
                    <p className="text-gray-600 mb-4">इस गांव में अभी तक कोई परिवार पंजीकृत नहीं है</p>
                    <Button
                      onClick={() => setShowAddFamily(true)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600"
                    >
                      पहला परिवार जोड़ें
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          {!selectedFamily ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-purple-100 to-white p-8 rounded-lg border border-purple-200">
                <Users className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-purple-700 mb-2">पहले परिवार चुनें</h3>
                <p className="text-gray-600 mb-4">सदस्य प्रबंधन के लिए पहले कोई परिवार चुनें</p>
                <Button
                  onClick={() => setActiveTab("families")}
                  className="bg-gradient-to-r from-purple-500 to-purple-600"
                >
                  परिवार चुनें
                </Button>
              </div>
            </div>
          ) : (
            <MemberManagement
              family={selectedFamily}
              onUpdateFamily={(updatedFamily) => {
                setVillages((prev) =>
                  prev.map((v) => ({
                    ...v,
                    families: v.families.map((f) => (f.id === updatedFamily.id ? updatedFamily : f)),
                  })),
                )
                setSelectedFamily(updatedFamily)
              }}
              onBack={() => setSelectedFamily(null)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Village Card Component
function VillageCard({ village, onSelect }: { village: Village; onSelect: () => void }) {
  return (
    <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 hover:shadow-lg transition-all cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-green-700">{village.name}</CardTitle>
          <Badge className={village.status === "Active" ? "bg-green-500" : "bg-red-500"}>{village.status}</Badge>
        </div>
        <CardDescription>ID: {village.villageId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <strong>गांव एडमिन:</strong> {village.gaonAdmin}
          </div>
          <div>
            <strong>संपर्क:</strong> {village.adminContact}
          </div>
          <div>
            <strong>परिवार:</strong> {village.families.length}
          </div>
          <div>
            <strong>विवरण:</strong> {village.description}
          </div>
        </div>
        <Button onClick={onSelect} className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600">
          परिवार देखें
        </Button>
      </CardContent>
    </Card>
  )
}

// Family Card Component
function FamilyCard({ family, onSelect }: { family: Family; onSelect: () => void }) {
  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:shadow-lg transition-all cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-700">{family.familyHead}</CardTitle>
          <Badge className={family.verificationStatus === "Verified" ? "bg-green-500" : "bg-yellow-500"}>
            {family.verificationStatus}
          </Badge>
        </div>
        <CardDescription>ID: {family.parivarId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <strong>मोबाइल:</strong> {family.mobile}
          </div>
          <div>
            <strong>सदस्य:</strong> {family.members.length}
          </div>
          <div>
            <strong>पारिवारिक कार्ड:</strong> {family.familyCardIssued ? "जारी" : "लंबित"}
          </div>
          <div>
            <strong>पता:</strong> {family.address.substring(0, 50)}...
          </div>
        </div>
        <Button onClick={onSelect} className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600">
          सदस्य देखें
        </Button>
      </CardContent>
    </Card>
  )
}

// Add Village Form
function AddVillageForm({ onAdd, onCancel }: { onAdd: (data: Partial<Village>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    gaonAdmin: "",
    adminContact: "",
    description: "",
  })

  const handleSubmit = () => {
    onAdd(formData)
  }

  return (
    <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-green-700">नया गांव जोड़ें</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>गांव का नाम *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="गांव का नाम दर्ज करें"
            />
          </div>
          <div>
            <Label>गांव एडमिन *</Label>
            <Input
              value={formData.gaonAdmin}
              onChange={(e) => setFormData((prev) => ({ ...prev, gaonAdmin: e.target.value }))}
              placeholder="राम पंचाल"
            />
          </div>
          <div>
            <Label>एडमिन संपर्क *</Label>
            <Input
              value={formData.adminContact}
              onChange={(e) => setFormData((prev) => ({ ...prev, adminContact: e.target.value }))}
              placeholder="मोबाइल नंबर"
              maxLength={10}
            />
          </div>
        </div>
        <div>
          <Label>विवरण</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="गांव का विवरण"
            rows={3}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            रद्द करें
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-green-500 to-green-600"
            disabled={!formData.name || !formData.gaonAdmin || !formData.adminContact}
          >
            गांव जोड़ें
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Add Family Form
function AddFamilyForm({
  village,
  onAdd,
  onCancel,
}: { village: Village; onAdd: (data: Partial<Family>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    familyHead: "",
    mobile: "",
    email: "",
    address: "",
    pinCode: "",
    familyCardIssued: false,
  })

  const handleSubmit = () => {
    onAdd(formData)
  }

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-700">नया परिवार जोड़ें - {village.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>परिवार मुखिया *</Label>
            <Input
              value={formData.familyHead}
              onChange={(e) => setFormData((prev) => ({ ...prev, familyHead: e.target.value }))}
              placeholder="राम पंचाल"
            />
          </div>
          <div>
            <Label>मोबाइल नंबर *</Label>
            <Input
              value={formData.mobile}
              onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
              placeholder="10 अंकों का नंबर"
              maxLength={10}
            />
          </div>
          <div>
            <Label>ईमेल (वैकल्पिक)</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="ram.panchal@example.com"
            />
          </div>
          <div>
            <Label>पिन कोड *</Label>
            <Input
              value={formData.pinCode}
              onChange={(e) => setFormData((prev) => ({ ...prev, pinCode: e.target.value }))}
              placeholder="6 अंकों का पिन कोड"
              maxLength={6}
            />
          </div>
        </div>
        <div>
          <Label>स्थायी पता *</Label>
          <Textarea
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="पूरा पता दर्ज करें"
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={formData.familyCardIssued}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, familyCardIssued: !!checked }))}
          />
          <Label>पारिवारिक कार्ड जारी है</Label>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            रद्द करें
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-500 to-blue-600"
            disabled={!formData.familyHead || !formData.mobile || !formData.address || !formData.pinCode}
          >
            परिवार जोड़ें
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Member Management Component
function MemberManagement({
  family,
  onUpdateFamily,
  onBack,
}: {
  family: Family
  onUpdateFamily: (family: Family) => void
  onBack: () => void
}) {
  const [showAddMember, setShowAddMember] = useState(false)

  const addMember = (memberData: Partial<Member>) => {
    const newMember: Member = {
      id: `member_${Date.now()}`,
      fullName: memberData.fullName || "",
      relation: memberData.relation || "",
      isMukhiya: family.members.length === 0,
      dateOfBirth: memberData.dateOfBirth || "",
      gender: memberData.gender || "",
      aadhaar: memberData.aadhaar || "",
      maritalStatus: memberData.maritalStatus || "",
      qualification: memberData.qualification || "",
      currentlyStudying: memberData.currentlyStudying || false,
      institutionName: memberData.institutionName || "",
      educationStream: memberData.educationStream || "",
      occupation: memberData.occupation || "",
      employerName: memberData.employerName || "",
      workLocation: memberData.workLocation || "",
      monthlyIncome: memberData.monthlyIncome || "",
      isMigrant: memberData.isMigrant || false,
      currentState: memberData.currentState || "",
      currentDistrict: memberData.currentDistrict || "",
      healthStatus: memberData.healthStatus || "Healthy",
      hasHealthInsurance: memberData.hasHealthInsurance || false,
      hasLifeInsurance: memberData.hasLifeInsurance || false,
      hasAccidentInsurance: memberData.hasAccidentInsurance || false,
      hasGovtSchemes: memberData.hasGovtSchemes || false,
      memberMobile: memberData.memberMobile || "",
      memberEmail: memberData.memberEmail || "",
    }

    const updatedFamily = {
      ...family,
      members: [...family.members, newMember],
    }
    onUpdateFamily(updatedFamily)
    setShowAddMember(false)
  }

  const removeMember = (memberId: string) => {
    const updatedFamily = {
      ...family,
      members: family.members.filter((m) => m.id !== memberId),
    }
    onUpdateFamily(updatedFamily)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {family.familyHead} परिवार - सदस्य सूची ({family.members.length})
          </h3>
          <p className="text-gray-600">परिवार ID: {family.parivarId}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onBack} className="border-gray-200 bg-transparent">
            परिवार सूची
          </Button>
          <Button onClick={() => setShowAddMember(true)} className="bg-gradient-to-r from-purple-500 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            नया सदस्य जोड़ें
          </Button>
        </div>
      </div>

      {showAddMember && <AddMemberForm onAdd={addMember} onCancel={() => setShowAddMember(false)} />}

      <div className="grid grid-cols-1 gap-6">
        {family.members.map((member, index) => (
          <MemberCard
            key={member.id}
            member={member}
            index={index}
            onRemove={() => removeMember(member.id)}
            canRemove={family.members.length > 1}
          />
        ))}
      </div>

      {family.members.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-purple-100 to-white p-8 rounded-lg border border-purple-200">
            <User className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-purple-700 mb-2">कोई सदस्य नहीं मिला</h3>
            <p className="text-gray-600 mb-4">इस परिवार में अभी तक कोई सदस्य पंजीकृत नहीं है</p>
            <Button onClick={() => setShowAddMember(true)} className="bg-gradient-to-r from-purple-500 to-purple-600">
              पहला सदस्य जोड़ें
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Member Card Component
function MemberCard({
  member,
  index,
  onRemove,
  canRemove,
}: {
  member: Member
  index: number
  onRemove: () => void
  canRemove: boolean
}) {
  return (
    <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CardTitle className="text-purple-700">
              {index + 1}. {member.fullName}
            </CardTitle>
            {member.isMukhiya && <Badge className="bg-orange-500">मुखिया</Badge>}
            <Badge variant="outline">{member.relation}</Badge>
          </div>
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
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <strong>लिंग:</strong> {member.gender}
          </div>
          <div>
            <strong>जन्म तिथि:</strong> {member.dateOfBirth}
          </div>
          <div>
            <strong>व्यवसाय:</strong> {member.occupation}
          </div>
          <div>
            <strong>योग्यता:</strong> {member.qualification}
          </div>
          <div>
            <strong>वैवाहिक स्थिति:</strong> {member.maritalStatus}
          </div>
          <div>
            <strong>प्रवासी:</strong> {member.isMigrant ? "हाँ" : "नहीं"}
          </div>
          <div>
            <strong>स्वास्थ्य:</strong> {member.healthStatus}
          </div>
          <div>
            <strong>मोबाइल:</strong> {member.memberMobile || "N/A"}
          </div>
        </div>
        {member.isMigrant && (
          <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-sm">
              <strong>प्रवास विवरण:</strong> {member.currentState}, {member.currentDistrict}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Add Member Form Component
function AddMemberForm({ onAdd, onCancel }: { onAdd: (data: Partial<Member>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<Member>>({
    fullName: "",
    relation: "",
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
  })

  const handleSubmit = () => {
    onAdd(formData)
  }

  return (
    <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-700">नया सदस्य जोड़ें</CardTitle>
        <CardDescription>सदस्य की पूरी जानकारी भरें</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-purple-700">बुनियादी जानकारी</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>पूरा नाम *</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="राम पंचाल"
              />
            </div>
            <div>
              <Label>मुखिया से रिश्ता *</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, relation: value }))}>
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
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
              />
            </div>
            <div>
              <Label>लिंग *</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}>
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
                value={formData.aadhaar}
                onChange={(e) => setFormData((prev) => ({ ...prev, aadhaar: e.target.value }))}
                placeholder="12 अंकों का आधार नंबर"
                maxLength={12}
              />
            </div>
            <div>
              <Label>वैवाहिक स्थिति</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, maritalStatus: value }))}>
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
        </div>

        <Separator />

        {/* Education Details */}
        <div className="space-y-4">
          <h4 className="font-semibold text-purple-700">शिक्षा विवरण</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>उच्चतम योग्यता</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, qualification: value }))}>
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
                value={formData.educationStream}
                onChange={(e) => setFormData((prev) => ({ ...prev, educationStream: e.target.value }))}
                placeholder="जैसे: Science, Commerce, Arts"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.currentlyStudying}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, currentlyStudying: !!checked }))}
            />
            <Label>क्या वर्तमान में पढ़ाई कर रहे हैं?</Label>
          </div>

          {formData.currentlyStudying && (
            <div>
              <Label>संस्थान का नाम</Label>
              <Input
                value={formData.institutionName}
                onChange={(e) => setFormData((prev) => ({ ...prev, institutionName: e.target.value }))}
                placeholder="स्कूल/कॉलेज का नाम"
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Employment Details */}
        <div className="space-y-4">
          <h4 className="font-semibold text-purple-700">नौकरी और रोजगार</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>व्यवसाय</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, occupation: value }))}>
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
                value={formData.employerName}
                onChange={(e) => setFormData((prev) => ({ ...prev, employerName: e.target.value }))}
                placeholder="कंपनी का नाम"
              />
            </div>
            <div>
              <Label>कार्य स्थान</Label>
              <Input
                value={formData.workLocation}
                onChange={(e) => setFormData((prev) => ({ ...prev, workLocation: e.target.value }))}
                placeholder="काम की जगह"
              />
            </div>
            <div>
              <Label>मासिक आय (लगभग)</Label>
              <Input
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData((prev) => ({ ...prev, monthlyIncome: e.target.value }))}
                placeholder="₹ में आय"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Health & Migration */}
        <div className="space-y-4">
          <h4 className="font-semibold text-purple-700">स्वास्थ्य और प्रवास</h4>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.isMigrant}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isMigrant: !!checked }))}
            />
            <Label>क्या प्रवासी सदस्य है?</Label>
          </div>

          {formData.isMigrant && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>वर्तमान राज्य</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, currentState: value }))}>
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
                  value={formData.currentDistrict}
                  onChange={(e) => setFormData((prev) => ({ ...prev, currentDistrict: e.target.value }))}
                  placeholder="जिला का नाम"
                />
              </div>
            </div>
          )}

          <div>
            <Label>स्वास्थ्य स्थिति</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, healthStatus: value }))}>
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
                  checked={formData.hasHealthInsurance}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, hasHealthInsurance: !!checked }))}
                />
                <Label>स्वास्थ्य बीमा</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.hasLifeInsurance}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, hasLifeInsurance: !!checked }))}
                />
                <Label>जीवन बीमा</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.hasAccidentInsurance}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, hasAccidentInsurance: !!checked }))}
                />
                <Label>दुर्घटना बीमा</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.hasGovtSchemes}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, hasGovtSchemes: !!checked }))}
                />
                <Label>सरकारी योजनाएं</Label>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-purple-700">संपर्क जानकारी (वैकल्पिक)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>सदस्य का मोबाइल नंबर</Label>
              <Input
                value={formData.memberMobile}
                onChange={(e) => setFormData((prev) => ({ ...prev, memberMobile: e.target.value }))}
                placeholder="10 अंकों का नंबर"
                maxLength={10}
              />
            </div>
            <div>
              <Label>सदस्य का ईमेल</Label>
              <Input
                type="email"
                value={formData.memberEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, memberEmail: e.target.value }))}
                placeholder="ram.panchal@example.com"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            रद्द करें
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-500 to-purple-600"
            disabled={!formData.fullName || !formData.relation || !formData.dateOfBirth || !formData.gender}
          >
            सदस्य जोड़ें
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
