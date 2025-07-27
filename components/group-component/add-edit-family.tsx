"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { FormErrorBoundary } from "@/components/form-error-boundary"
import { ErrorBoundary } from "@/components/error-boundary"

// Form validation schema
const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age must be positive").max(150, "Age must be realistic"),
  gender: z.enum(["male", "female", "other"]),
  relation: z.string().min(1, "Relation is required"),
  education: z.string().optional(),
  occupation: z.string().optional(),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
})

const familySchema = z.object({
  familyHead: z.string().min(1, "Family head name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  members: z.array(memberSchema).min(1, "At least one member is required"),
})

type FamilyFormData = z.infer<typeof familySchema>
type Member = z.infer<typeof memberSchema>

interface AddEditFamilyProps {
  villageId: string
  familyId?: string
  initialData?: Partial<FamilyFormData>
  onSave?: (data: FamilyFormData) => void
  onCancel?: () => void
}

function AddEditFamilyForm({ villageId, familyId, initialData, onSave, onCancel }: AddEditFamilyProps) {
  const [members, setMembers] = useState<Member[]>([
    {
      name: "",
      age: 0,
      gender: "male",
      relation: "self",
      education: "",
      occupation: "",
      maritalStatus: "single",
      phone: "",
      email: "",
    },
  ])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<FamilyFormData>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      familyHead: "",
      address: "",
      phone: "",
      email: "",
      members: members,
    },
  })

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      reset({
        familyHead: initialData.familyHead || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        members: initialData.members || members,
      })
      if (initialData.members) {
        setMembers(initialData.members)
      }
    }
  }, [initialData, reset])

  // Update form when members change
  useEffect(() => {
    setValue("members", members)
  }, [members, setValue])

  const addMember = () => {
    const newMember: Member = {
      name: "",
      age: 0,
      gender: "male",
      relation: "",
      education: "",
      occupation: "",
      maritalStatus: "single",
      phone: "",
      email: "",
    }
    setMembers([...members, newMember])
  }

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index))
    }
  }

  const updateMember = (index: number, field: keyof Member, value: any) => {
    const updatedMembers = [...members]
    updatedMembers[index] = { ...updatedMembers[index], [field]: value }
    setMembers(updatedMembers)
  }

  const onSubmit = async (data: FamilyFormData) => {
    try {
      // Here you would typically make an API call
      console.log("Saving family data:", data)

      if (onSave) {
        onSave(data)
      }

      toast.success(familyId ? "Family updated successfully!" : "Family added successfully!")
    } catch (error) {
      console.error("Error saving family:", error)
      toast.error("Failed to save family. Please try again.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{familyId ? "Edit Family" : "Add New Family"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Family Information */}
            <ErrorBoundary>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Family Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="familyHead">Family Head Name *</Label>
                    <Input id="familyHead" {...register("familyHead")} placeholder="Enter family head name" />
                    {errors.familyHead && <p className="text-sm text-red-500 mt-1">{errors.familyHead.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" {...register("phone")} placeholder="Enter phone number" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" {...register("address")} placeholder="Enter address" />
                    {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="Enter email address" />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                </div>
              </div>
            </ErrorBoundary>

            <Separator />

            {/* Members Information */}
            <ErrorBoundary>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Family Members</h3>
                  <Button type="button" onClick={addMember} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </div>

                {members.map((member, index) => (
                  <ErrorBoundary key={index}>
                    <Card className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Member {index + 1}</h4>
                        {members.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeMember(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Name *</Label>
                          <Input
                            value={member.name}
                            onChange={(e) => updateMember(index, "name", e.target.value)}
                            placeholder="Enter name"
                          />
                        </div>

                        <div>
                          <Label>Age *</Label>
                          <Input
                            type="number"
                            value={member.age}
                            onChange={(e) => updateMember(index, "age", Number.parseInt(e.target.value) || 0)}
                            placeholder="Enter age"
                          />
                        </div>

                        <div>
                          <Label>Gender *</Label>
                          <Select value={member.gender} onValueChange={(value) => updateMember(index, "gender", value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Relation *</Label>
                          <Input
                            value={member.relation}
                            onChange={(e) => updateMember(index, "relation", e.target.value)}
                            placeholder="e.g., Father, Mother, Son, Daughter"
                          />
                        </div>

                        <div>
                          <Label>Education</Label>
                          <Input
                            value={member.education}
                            onChange={(e) => updateMember(index, "education", e.target.value)}
                            placeholder="Enter education"
                          />
                        </div>

                        <div>
                          <Label>Occupation</Label>
                          <Input
                            value={member.occupation}
                            onChange={(e) => updateMember(index, "occupation", e.target.value)}
                            placeholder="Enter occupation"
                          />
                        </div>

                        <div>
                          <Label>Marital Status</Label>
                          <Select
                            value={member.maritalStatus}
                            onValueChange={(value) => updateMember(index, "maritalStatus", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={member.phone}
                            onChange={(e) => updateMember(index, "phone", e.target.value)}
                            placeholder="Enter phone number"
                          />
                        </div>

                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={member.email}
                            onChange={(e) => updateMember(index, "email", e.target.value)}
                            placeholder="Enter email"
                          />
                        </div>
                      </div>
                    </Card>
                  </ErrorBoundary>
                ))}

                {errors.members && <p className="text-sm text-red-500">{errors.members.message}</p>}
              </div>
            </ErrorBoundary>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : familyId ? "Update Family" : "Add Family"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function AddEditFamily(props: AddEditFamilyProps) {
  return (
    <FormErrorBoundary formName="Add/Edit Family" onReset={() => window.location.reload()}>
      <AddEditFamilyForm {...props} />
    </FormErrorBoundary>
  )
}

// Default export for backward compatibility
export default AddEditFamily
