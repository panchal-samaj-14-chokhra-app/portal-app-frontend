"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Plus } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

interface AddVillageFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<any>
  onSubmit: (data: any) => void
  isCreating: boolean
  userType: string | undefined
}

export function AddVillageForm({ open, onOpenChange, form, onSubmit, isCreating, userType }: AddVillageFormProps) {
  if (userType !== "CHOKHLA_MEMBER") return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none hover:from-orange-600 hover:to-orange-700 shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          गांव जोड़ें
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full sm:max-w-2xl p-2 sm:p-6 max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-orange-800 flex items-center gap-2">
            <Plus className="w-6 h-6" />
            नया गांव जोड़ें
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-800 mb-4">बुनियादी जानकारी</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-orange-700 font-medium">गांव का नाम *</FormLabel>
                        <FormControl>
                          <Input {...field} required className="border-orange-200 focus:border-orange-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="villageMemberName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-orange-700 font-medium">गांव सदस्य का नाम</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-orange-200 focus:border-orange-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">संपर्क जानकारी</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="mobileNumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 font-medium">मोबाइल नंबर</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" className="border-blue-200 focus:border-blue-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 font-medium">ईमेल</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="border-blue-200 focus:border-blue-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="age"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 font-medium">आयु</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            value={field.value ?? ""}
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location Information Section */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-4">स्थान की जानकारी</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    name="tehsil"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-medium">तहसील</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-green-200 focus:border-green-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="district"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-medium">जिला</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-green-200 focus:border-green-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="state"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-medium">राज्य</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-green-200 focus:border-green-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    name="longitude"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-medium">देशांतर (Longitude)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="any"
                            value={field.value ?? ""}
                            className="border-green-200 focus:border-green-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="latitude"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-medium">अक्षांश (Latitude)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="any"
                            value={field.value ?? ""}
                            className="border-green-200 focus:border-green-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Facilities Section */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">सुविधाएं</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    name="isVillageHaveSchool"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                        <FormLabel className="text-purple-700 font-medium">स्कूल</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="isVillageHavePrimaryHealthCare"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                        <FormLabel className="text-purple-700 font-medium">स्वास्थ्य केंद्र</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="isVillageHaveCommunityHall"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                        <FormLabel className="text-purple-700 font-medium">कम्युनिटी हॉल</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-4">सुरक्षा जानकारी</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="password"
                    control={form.control}
                    rules={{
                      required: "पासवर्ड आवश्यक है",
                      minLength: { value: 8, message: "कम से कम 8 अक्षर" },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                        message: "पासवर्ड मजबूत होना चाहिए",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-700 font-medium">पासवर्ड *</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" required className="border-red-200 focus:border-red-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="repeatPassword"
                    control={form.control}
                    rules={{
                      required: "पासवर्ड दोबारा लिखें आवश्यक है",
                      validate: (value) => value === form.getValues("password") || "पासवर्ड मेल नहीं खाते",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-700 font-medium">पासवर्ड दोबारा लिखें *</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" required className="border-red-200 focus:border-red-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300">
                  रद्द करें
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {isCreating ? "सहेजा जा रहा है..." : "सहेजें"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
