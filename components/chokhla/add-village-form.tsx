"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Plus, Eye, EyeOff, Loader2 } from "lucide-react"

interface AddVillageFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<any>
  onSubmit: (data: any) => void
  isCreating: boolean
  userType: string | undefined
}

export function AddVillageForm({ open, onOpenChange, form, onSubmit, isCreating, userType }: AddVillageFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)

  if (userType !== "CHOKHLA_MEMBER") return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none hover:from-orange-600 hover:to-orange-700 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          गांव जोड़ें
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full sm:max-w-4xl p-2 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-800 text-center">नया गांव जोड़ें</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  बुनियादी जानकारी
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="name"
                    control={form.control}
                    rules={{ required: "गांव का नाम आवश्यक है" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-orange-700 font-medium">गांव का नाम *</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-orange-300 focus:border-orange-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="villageMemberName"
                    control={form.control}
                    rules={{ required: "गांव सदस्य का नाम आवश्यक है" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-orange-700 font-medium">गांव सदस्य का नाम *</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-orange-300 focus:border-orange-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  संपर्क जानकारी
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="mobileNumber"
                    control={form.control}
                    rules={{
                      required: "मोबाइल नंबर आवश्यक है",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "वैध मोबाइल नंबर दर्ज करें",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 font-medium">मोबाइल नंबर *</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" className="border-blue-300 focus:border-blue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="email"
                    control={form.control}
                    rules={{
                      required: "ईमेल आवश्यक है",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "वैध ईमेल पता दर्ज करें",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 font-medium">ईमेल *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="border-blue-300 focus:border-blue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="age"
                    control={form.control}
                    rules={{
                      required: "आयु आवश्यक है",
                      min: { value: 18, message: "आयु कम से कम 18 वर्ष होनी चाहिए" },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 font-medium">आयु *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" className="border-blue-300 focus:border-blue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location Information Section */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  स्थान की जानकारी
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="tehsil"
                    control={form.control}
                    rules={{ required: "तहसील आवश्यक है" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-medium">तहसील *</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-green-300 focus:border-green-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="district"
                    control={form.control}
                    rules={{ required: "जिला आवश्यक है" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-medium">जिला *</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-green-300 focus:border-green-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="state"
                    control={form.control}
                    rules={{ required: "राज्य आवश्यक है" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-medium">राज्य *</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-green-300 focus:border-green-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            className="border-green-300 focus:border-green-500"
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
                            className="border-green-300 focus:border-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Facilities Information Section */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  सुविधाओं की जानकारी
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    name="isVillageHaveSchool"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 border border-purple-200 rounded-lg">
                        <FormLabel className="text-purple-700 font-medium">क्या गांव में स्कूल है?</FormLabel>
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
                      <FormItem className="flex items-center justify-between p-3 border border-purple-200 rounded-lg">
                        <FormLabel className="text-purple-700 font-medium">क्या प्राथमिक स्वास्थ्य केंद्र है?</FormLabel>
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
                      <FormItem className="flex items-center justify-between p-3 border border-purple-200 rounded-lg">
                        <FormLabel className="text-purple-700 font-medium">क्या कम्युनिटी हॉल है?</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Security Information Section */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  सुरक्षा जानकारी
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="password"
                    control={form.control}
                    rules={{
                      required: "पासवर्ड आवश्यक है",
                      minLength: { value: 8, message: "कम से कम 8 अक्षर" },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                        message: "पासवर्ड मजबूत होना चाहिए (एक बड़ा, एक छोटा, एक संख्या, एक विशेष चिन्ह)",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-700 font-medium">पासवर्ड *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              className="border-red-300 focus:border-red-500 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-red-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-red-500" />
                              )}
                            </Button>
                          </div>
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
                          <div className="relative">
                            <Input
                              {...field}
                              type={showRepeatPassword ? "text" : "password"}
                              className="border-red-300 focus:border-red-500 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                            >
                              {showRepeatPassword ? (
                                <EyeOff className="h-4 w-4 text-red-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-red-500" />
                              )}
                            </Button>
                          </div>
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
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      सहेजा जा रहा है...
                    </>
                  ) : (
                    "सहेजें"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
