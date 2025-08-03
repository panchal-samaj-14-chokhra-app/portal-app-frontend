"use client"

import { useCallback, useEffect, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Building, MapPin, DollarSign, Users, Clock } from "lucide-react"
import {
  EMPLOYMENT_STATUS_OPTIONS,
  OCCUPATION_TYPE_OPTIONS,
  JOB_TYPES,
  BUSINESS_TYPES,
  STATES_DISTRICTS,
} from "./constants"

interface EmploymentInfoSectionProps {
  form: UseFormReturn<any>
  memberIndex: number
}

export function EmploymentInfoSection({ form, memberIndex }: EmploymentInfoSectionProps) {
  const [districts, setDistricts] = useState<string[]>([])

  const employmentStatus = form.watch(`members.${memberIndex}.employmentStatus`)
  const occupationType = form.watch(`members.${memberIndex}.occupationType`)
  const workState = form.watch(`members.${memberIndex}.workState`)

  // Update districts when state changes
  const updateDistricts = useCallback(
    (selectedState: string) => {
      if (selectedState && STATES_DISTRICTS[selectedState]) {
        setDistricts(STATES_DISTRICTS[selectedState])
        // Clear district if it's not valid for the new state
        const currentDistrict = form.getValues(`members.${memberIndex}.workDistrict`)
        if (currentDistrict && !STATES_DISTRICTS[selectedState].includes(currentDistrict)) {
          form.setValue(`members.${memberIndex}.workDistrict`, "")
        }
      } else {
        setDistricts([])
        form.setValue(`members.${memberIndex}.workDistrict`, "")
      }
    },
    [form, memberIndex],
  )

  useEffect(() => {
    if (workState) {
      updateDistricts(workState)
    }
  }, [workState, updateDistricts])

  // Reset fields when employment status changes
  useEffect(() => {
    if (employmentStatus) {
      // Clear occupation type if not relevant
      if (employmentStatus === "unemployed" || employmentStatus === "student" || employmentStatus === "retired") {
        form.setValue(`members.${memberIndex}.occupationType`, "")
        form.setValue(`members.${memberIndex}.jobType`, "")
        form.setValue(`members.${memberIndex}.businessType`, "")
      }
    }
  }, [employmentStatus, form, memberIndex])

  // Reset job/business specific fields when occupation type changes
  useEffect(() => {
    if (occupationType === "job") {
      form.setValue(`members.${memberIndex}.businessType`, "")
    } else if (occupationType === "business") {
      form.setValue(`members.${memberIndex}.jobType`, "")
    }
  }, [occupationType, form, memberIndex])

  const shouldShowOccupationFields =
    employmentStatus && !["unemployed", "student", "retired"].includes(employmentStatus)

  const shouldShowJobFields = shouldShowOccupationFields && occupationType === "job"
  const shouldShowBusinessFields = shouldShowOccupationFields && occupationType === "business"

  return (
    <Card className="border-blue-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Briefcase className="w-5 h-5" />
          रोजगार की जानकारी
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Employment Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name={`members.${memberIndex}.employmentStatus`}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-700 font-semibold flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  रोजगार की स्थिति *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="रोजगार की स्थिति चुनें" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {shouldShowOccupationFields && (
            <FormField
              name={`members.${memberIndex}.occupationType`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700 font-semibold flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    व्यवसाय का प्रकार *
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue placeholder="व्यवसाय का प्रकार चुनें" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {OCCUPATION_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Job Specific Fields */}
        {shouldShowJobFields && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-green-800 font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              नौकरी की जानकारी
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name={`members.${memberIndex}.jobType`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700 font-medium">नौकरी का प्रकार *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-green-200 focus:border-green-400">
                          <SelectValue placeholder="नौकरी का प्रकार चुनें" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JOB_TYPES.map((job) => (
                          <SelectItem key={job.value} value={job.value}>
                            {job.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={`members.${memberIndex}.companyName`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700 font-medium">कंपनी/संस्था का नाम</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-green-200 focus:border-green-400"
                        placeholder="कंपनी का नाम दर्ज करें"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={`members.${memberIndex}.designation`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700 font-medium">पदनाम</FormLabel>
                    <FormControl>
                      <Input {...field} className="border-green-200 focus:border-green-400" placeholder="आपका पदनाम" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={`members.${memberIndex}.monthlySalary`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700 font-medium flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      मासिक वेतन (₹)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="border-green-200 focus:border-green-400"
                        placeholder="मासिक वेतन दर्ज करें"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Business Specific Fields */}
        {shouldShowBusinessFields && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-purple-800 font-semibold mb-4 flex items-center gap-2">
              <Building className="w-4 h-4" />
              व्यवसाय की जानकारी
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name={`members.${memberIndex}.businessType`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-700 font-medium">व्यवसाय का प्रकार *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-purple-200 focus:border-purple-400">
                          <SelectValue placeholder="व्यवसाय का प्रकार चुनें" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BUSINESS_TYPES.map((business) => (
                          <SelectItem key={business.value} value={business.value}>
                            {business.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={`members.${memberIndex}.businessName`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-700 font-medium">व्यवसाय का नाम</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-purple-200 focus:border-purple-400"
                        placeholder="व्यवसाय का नाम दर्ज करें"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={`members.${memberIndex}.monthlyIncome`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-700 font-medium flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      मासिक आय (₹)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="border-purple-200 focus:border-purple-400"
                        placeholder="अनुमानित मासिक आय"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={`members.${memberIndex}.businessExperience`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-700 font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      व्यवसाय का अनुभव (वर्ष)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="border-purple-200 focus:border-purple-400"
                        placeholder="कितने वर्षों से व्यवसाय कर रहे हैं"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Work Location */}
        {shouldShowOccupationFields && (
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-orange-800 font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              कार्यस्थल की जानकारी
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                name={`members.${memberIndex}.workState`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-700 font-medium">कार्यस्थल - राज्य</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue placeholder="राज्य चुनें" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(STATES_DISTRICTS).map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={`members.${memberIndex}.workDistrict`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-700 font-medium">कार्यस्थल - जिला</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!workState || districts.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue placeholder="जिला चुनें" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name={`members.${memberIndex}.workCity`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-700 font-medium">कार्यस्थल - शहर</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-orange-200 focus:border-orange-400"
                        placeholder="शहर का नाम दर्ज करें"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Employment Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">वर्तमान स्थिति:</span>
          {employmentStatus && (
            <Badge
              variant="outline"
              className={`${
                employmentStatus === "employed"
                  ? "border-green-500 text-green-700"
                  : employmentStatus === "unemployed"
                    ? "border-red-500 text-red-700"
                    : employmentStatus === "self_employed"
                      ? "border-blue-500 text-blue-700"
                      : "border-gray-500 text-gray-700"
              }`}
            >
              {EMPLOYMENT_STATUS_OPTIONS.find((opt) => opt.value === employmentStatus)?.label}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
