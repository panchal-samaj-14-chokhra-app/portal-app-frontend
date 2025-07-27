"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Family, CreateFamilyPayload, UpdateFamilyPayload } from "@/types"

// Validation schemas
const personSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age must be positive").max(150, "Age must be realistic"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  relation: z.string().min(1, "Relation is required"),
  education: z.string().optional(),
  occupation: z.string().optional(),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
})

const familySchema = z.object({
  headName: z.string().min(1, "Head name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  villageId: z.string().min(1, "Village is required"),
  members: z.array(personSchema).min(1, "At least one member is required"),
})

type FormData = z.infer<typeof familySchema>

interface AddEditFamilyProps {
  family?: Family
  villageId?: string
  onSave: (data: CreateFamilyPayload | UpdateFamilyPayload) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const

const MARITAL_STATUS_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
] as const

const RELATION_OPTIONS = [
  "Head",
  "Spouse",
  "Son",
  "Daughter",
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Grandfather",
  "Grandmother",
  "Uncle",
  "Aunt",
  "Nephew",
  "Niece",
  "Cousin",
  "Son-in-law",
  "Daughter-in-law",
  "Other",
]

export function AddEditFamily({ family, villageId, onSave, onCancel, isLoading = false }: AddEditFamilyProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      headName: "",
      address: "",
      phone: "",
      email: "",
      villageId: villageId || "",
      members: [
        {
          name: "",
          age: 0,
          gender: "male",
          relation: "Head",
          education: "",
          occupation: "",
          maritalStatus: "single",
          phone: "",
          email: "",
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  })

  // Populate form when editing
  useEffect(() => {
    if (family) {
      reset({
        headName: family.headName,
        address: family.address,
        phone: family.phone || "",
        email: family.email || "",
        villageId: family.villageId,
        members: family.members.map((member) => ({
          name: member.name,
          age: member.age,
          gender: member.gender,
          relation: member.relation,
          education: member.education || "",
          occupation: member.occupation || "",
          maritalStatus: member.maritalStatus || "single",
          phone: member.phone || "",
          email: member.email || "",
        })),
      })
    }
  }, [family, reset])

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)

      if (family) {
        // Update existing family
        const updateData: UpdateFamilyPayload = {
          id: family.id,
          ...data,
        }
        await onSave(updateData)
      } else {
        // Create new family
        await onSave(data as CreateFamilyPayload)
      }

      toast({
        title: "Success",
        description: `Family ${family ? "updated" : "created"} successfully`,
      })
    } catch (error) {
      console.error("Error saving family:", error)
      toast({
        title: "Error",
        description: `Failed to ${family ? "update" : "create"} family`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addMember = () => {
    append({
      name: "",
      age: 0,
      gender: "male",
      relation: "Other",
      education: "",
      occupation: "",
      maritalStatus: "single",
      phone: "",
      email: "",
    })
  }

  const removeMember = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    } else {
      toast({
        title: "Warning",
        description: "At least one family member is required",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{family ? "Edit Family" : "Add New Family"}</h1>
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Family Information */}
        <Card>
          <CardHeader>
            <CardTitle>Family Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="headName">Head of Family *</Label>
                <Input id="headName" {...register("headName")} placeholder="Enter head of family name" />
                {errors.headName && <p className="text-sm text-red-500 mt-1">{errors.headName.message}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} placeholder="Enter phone number" />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input id="address" {...register("address")} placeholder="Enter family address" />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="Enter email address" />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Family Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Family Members</CardTitle>
            <Button type="button" onClick={addMember} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Member {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeMember(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`members.${index}.name`}>Name *</Label>
                    <Input {...register(`members.${index}.name`)} placeholder="Enter name" />
                    {errors.members?.[index]?.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.members[index]?.name?.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`members.${index}.age`}>Age *</Label>
                    <Input
                      type="number"
                      {...register(`members.${index}.age`, { valueAsNumber: true })}
                      placeholder="Enter age"
                      min="0"
                      max="150"
                    />
                    {errors.members?.[index]?.age && (
                      <p className="text-sm text-red-500 mt-1">{errors.members[index]?.age?.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`members.${index}.gender`}>Gender *</Label>
                    <Select
                      value={watch(`members.${index}.gender`)}
                      onValueChange={(value) =>
                        setValue(`members.${index}.gender`, value as "male" | "female" | "other")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDER_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.members?.[index]?.gender && (
                      <p className="text-sm text-red-500 mt-1">{errors.members[index]?.gender?.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`members.${index}.relation`}>Relation *</Label>
                    <Select
                      value={watch(`members.${index}.relation`)}
                      onValueChange={(value) => setValue(`members.${index}.relation`, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATION_OPTIONS.map((relation) => (
                          <SelectItem key={relation} value={relation}>
                            {relation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.members?.[index]?.relation && (
                      <p className="text-sm text-red-500 mt-1">{errors.members[index]?.relation?.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`members.${index}.education`}>Education</Label>
                    <Input {...register(`members.${index}.education`)} placeholder="Enter education" />
                  </div>

                  <div>
                    <Label htmlFor={`members.${index}.occupation`}>Occupation</Label>
                    <Input {...register(`members.${index}.occupation`)} placeholder="Enter occupation" />
                  </div>

                  <div>
                    <Label htmlFor={`members.${index}.maritalStatus`}>Marital Status</Label>
                    <Select
                      value={watch(`members.${index}.maritalStatus`)}
                      onValueChange={(value) =>
                        setValue(
                          `members.${index}.maritalStatus`,
                          value as "single" | "married" | "divorced" | "widowed",
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {MARITAL_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`members.${index}.phone`}>Phone</Label>
                    <Input {...register(`members.${index}.phone`)} placeholder="Enter phone" />
                  </div>

                  <div>
                    <Label htmlFor={`members.${index}.email`}>Email</Label>
                    <Input type="email" {...register(`members.${index}.email`)} placeholder="Enter email" />
                    {errors.members?.[index]?.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.members[index]?.email?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Separator />

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : family ? "Update Family" : "Create Family"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AddEditFamily
