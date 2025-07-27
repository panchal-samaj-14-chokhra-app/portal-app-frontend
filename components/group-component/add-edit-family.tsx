"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Save, X } from "lucide-react"
import { useCreateFamily, useUpdateFamily, useAllVillages } from "@/data-hooks/mutation-query/useQueryAndMutation"
import type { Family, CreateFamilyPayload } from "@/types"

const personSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age must be positive").max(150, "Age must be realistic"),
  gender: z.enum(["male", "female", "other"]),
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
  villageId: z.string().min(1, "Village selection is required"),
  members: z.array(personSchema).min(1, "At least one member is required"),
})

type FamilyFormData = z.infer<typeof familySchema>

interface AddEditFamilyProps {
  family?: Family
  villageId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function AddEditFamily({ family, villageId, onSuccess, onCancel }: AddEditFamilyProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: villagesResponse } = useAllVillages()
  const villages = villagesResponse?.data || []

  const form = useForm<FamilyFormData>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      headName: family?.headName || "",
      address: family?.address || "",
      phone: family?.phone || "",
      email: family?.email || "",
      villageId: family?.villageId || villageId || "",
      members: family?.members?.map((member) => ({
        name: member.name,
        age: member.age,
        gender: member.gender,
        relation: member.relation,
        education: member.education || "",
        occupation: member.occupation || "",
        maritalStatus: member.maritalStatus,
        phone: member.phone || "",
        email: member.email || "",
      })) || [
        {
          name: "",
          age: 0,
          gender: "male" as const,
          relation: "Head",
          education: "",
          occupation: "",
          maritalStatus: "single" as const,
          phone: "",
          email: "",
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  })

  const createFamilyMutation = useCreateFamily({
    onSuccess: () => {
      onSuccess?.()
    },
    onError: (error) => {
      console.error("Create family error:", error)
    },
  })

  const updateFamilyMutation = useUpdateFamily({
    onSuccess: () => {
      onSuccess?.()
    },
    onError: (error) => {
      console.error("Update family error:", error)
    },
  })

  const onSubmit = async (data: FamilyFormData) => {
    setIsSubmitting(true)

    try {
      const payload: CreateFamilyPayload = {
        headName: data.headName,
        address: data.address,
        phone: data.phone || undefined,
        email: data.email || undefined,
        villageId: data.villageId,
        members: data.members.map((member) => ({
          name: member.name,
          age: member.age,
          gender: member.gender,
          relation: member.relation,
          education: member.education || undefined,
          occupation: member.occupation || undefined,
          maritalStatus: member.maritalStatus,
          phone: member.phone || undefined,
          email: member.email || undefined,
        })),
      }

      if (family) {
        await updateFamilyMutation.mutation.mutateAsync({
          id: family.id,
          payload,
        })
      } else {
        await createFamilyMutation.mutation.mutateAsync(payload)
      }
    } catch (error) {
      console.error("Submit error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addMember = () => {
    append({
      name: "",
      age: 0,
      gender: "male",
      relation: "",
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
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{family ? "Edit Family" : "Add New Family"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Family Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="headName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family Head Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter family head name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="villageId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Village *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select village" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {villages.map((village) => (
                            <SelectItem key={village.id} value={village.id}>
                              {village.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Family Members */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Family Members</h3>
                  <Button type="button" onClick={addMember} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Member {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button type="button" onClick={() => removeMember(index)} variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`members.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`members.${index}.age`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter age"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`members.${index}.gender`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`members.${index}.relation`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relation *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Head, Spouse, Son, Daughter" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`members.${index}.education`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Education</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter education" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`members.${index}.occupation`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter occupation" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`members.${index}.maritalStatus`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marital Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                                <SelectItem value="divorced">Divorced</SelectItem>
                                <SelectItem value="widowed">Widowed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`members.${index}.phone`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`members.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : family ? "Update Family" : "Create Family"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
