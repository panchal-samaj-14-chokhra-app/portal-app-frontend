"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, EyeOff, MapPin, Phone, Lock, Building, School, Heart } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

interface AddVillageFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<any>
  onSubmit: (data: any) => void
  isCreating: boolean
  userType?: string
}

const STATES = [
  "गुजरात",
  "राजस्थान",
  "महाराष्ट्र",
  "मध्य प्रदेश",
  "उत्तर प्रदेश",
  "बिहार",
  "पश्चिम बंगाल",
  "तमिलनाडु",
  "कर्नाटक",
  "आंध्र प्रदेश",
]

const DISTRICTS: Record<string, string[]> = {
  गुजरात: ["अहमदाबाद", "सूरत", "वडोदरा", "राजकोट", "भावनगर", "जामनगर", "जूनागढ़", "गांधीनगर"],
  राजस्थान: ["जयपुर", "जोधपुर", "उदयपुर", "कोटा", "बीकानेर", "अजमेर", "भरतपुर", "अलवर"],
  महाराष्ट्र: ["मुंबई", "पुणे", "नागपुर", "नाशिक", "औरंगाबाद", "सोलापुर", "अमरावती", "कोल्हापुर"],
  "मध्य प्रदेश": ["भोपाल", "इंदौर", "ग्वालियर", "जबलपुर", "उज्जैन", "सागर", "देवास", "रतलाम"],
  "उत्तर प्रदेश": ["लखनऊ", "कानपुर", "आगरा", "वाराणसी", "मेरठ", "इलाहाबाद", "बरेली", "अलीगढ़"],
  बिहार: ["पटना", "गया", "भागलपुर", "मुजफ्फरपुर", "दरभंगा", "बिहार शरीफ", "आरा", "पूर्णिया"],
  "पश्चिम बंगाल": ["कोलकाता", "हावड़ा", "दुर्गापुर", "आसनसोल", "सिलीगुड़ी", "बर्धमान", "मालदा", "खड़गपुर"],
  तमिलनाडु: ["चेन्नई", "कोयंबटूर", "मदुरै", "तिरुचिरापल्ली", "सेलम", "तिरुनेलवेली", "इरोड", "वेल्लोर"],
  कर्नाटक: ["बेंगलुरु", "मैसूर", "हुबली", "मंगलुरु", "बेलगावी", "गुलबर्गा", "दावणगेरे", "बीजापुर"],
  "आंध्र प्रदेश": ["विशाखापत्तनम", "विजयवाड़ा", "गुंटूर", "नेल्लोर", "कुर्नूल", "राजमहेंद्रवरम", "तिरुपति", "काकीनाडा"],
}

export function AddVillageForm({ open, onOpenChange, form, onSubmit, isCreating, userType }: AddVillageFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [selectedState, setSelectedState] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = form

  const watchedState = watch("state")

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setValue("state", state)
    setValue("district", "") // Reset district when state changes
  }

  const handleClose = () => {
    reset()
    setSelectedState("")
    onOpenChange(false)
  }

  if (userType !== "CHOKHLA_MEMBER") {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          नया गांव जोड़ें
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-orange-700 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            नया गांव जोड़ें
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-orange-200/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800 flex items-center">
                <Building className="w-5 h-5 mr-2 text-orange-500" />
                बुनियादी जानकारी
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    गांव का नाम *
                  </Label>
                  <Input
                    id="name"
                    {...register("name", { required: "गांव का नाम आवश्यक है" })}
                    className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="गांव का नाम दर्ज करें"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="villageMemberName" className="text-sm font-medium text-gray-700">
                    गांव प्रतिनिधि का नाम *
                  </Label>
                  <Input
                    id="villageMemberName"
                    {...register("villageMemberName", { required: "प्रतिनिधि का नाम आवश्यक है" })}
                    className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="प्रतिनिधि का नाम दर्ज करें"
                  />
                  {errors.villageMemberName && (
                    <p className="text-red-500 text-sm mt-1">{errors.villageMemberName.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-orange-200/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-orange-500" />
                संपर्क जानकारी
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700">
                    मोबाइल नंबर *
                  </Label>
                  <Input
                    id="mobileNumber"
                    {...register("mobileNumber", {
                      required: "मोबाइल नंबर आवश्यक है",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "वैध मोबाइल नंबर दर्ज करें",
                      },
                    })}
                    className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="10 अंकों का मोबाइल नंबर"
                  />
                  {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber.message}</p>}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    ईमेल पता *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "ईमेल पता आवश्यक है",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "वैध ईमेल पता दर्ज करें",
                      },
                    })}
                    className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="example@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                    आयु
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    {...register("age", {
                      min: { value: 18, message: "आयु कम से कम 18 वर्ष होनी चाहिए" },
                      max: { value: 100, message: "आयु 100 वर्ष से अधिक नहीं हो सकती" },
                    })}
                    className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="आयु दर्ज करें"
                  />
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="border-orange-200/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                स्थान की जानकारी
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                    राज्य *
                  </Label>
                  <Select onValueChange={handleStateChange} value={watchedState}>
                    <SelectTrigger className="mt-1 border-orange-200 focus:border-orange-500">
                      <SelectValue placeholder="राज्य चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                </div>

                <div>
                  <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                    जिला *
                  </Label>
                  <Select onValueChange={(value) => setValue("district", value)} disabled={!watchedState}>
                    <SelectTrigger className="mt-1 border-orange-200 focus:border-orange-500">
                      <SelectValue placeholder="जिला चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      {watchedState &&
                        DISTRICTS[watchedState]?.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
                </div>

                <div>
                  <Label htmlFor="tehsil" className="text-sm font-medium text-gray-700">
                    तहसील *
                  </Label>
                  <Input
                    id="tehsil"
                    {...register("tehsil", { required: "तहसील आवश्यक है" })}
                    className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="तहसील का नाम दर्ज करें"
                  />
                  {errors.tehsil && <p className="text-red-500 text-sm mt-1">{errors.tehsil.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="longitude" className="text-sm font-medium text-gray-700">
                    देशांतर (Longitude)
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    {...register("longitude")}
                    className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="जैसे: 72.5714"
                  />
                </div>

                <div>
                  <Label htmlFor="latitude" className="text-sm font-medium text-gray-700">
                    अक्षांश (Latitude)
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    {...register("latitude")}
                    className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="जैसे: 23.0225"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Facilities Information */}
          <Card className="border-orange-200/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800 flex items-center">
                <Building className="w-5 h-5 mr-2 text-orange-500" />
                सुविधाओं की जानकारी
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Checkbox
                    id="isVillageHaveSchool"
                    {...register("isVillageHaveSchool")}
                    className="border-green-300 data-[state=checked]:bg-green-600"
                  />
                  <div className="flex items-center">
                    <School className="w-5 h-5 text-green-600 mr-2" />
                    <Label htmlFor="isVillageHaveSchool" className="text-sm font-medium text-green-800">
                      स्कूल उपलब्ध है
                    </Label>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Checkbox
                    id="isVillageHavePrimaryHealthCare"
                    {...register("isVillageHavePrimaryHealthCare")}
                    className="border-red-300 data-[state=checked]:bg-red-600"
                  />
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-red-600 mr-2" />
                    <Label htmlFor="isVillageHavePrimaryHealthCare" className="text-sm font-medium text-red-800">
                      स्वास्थ्य केंद्र उपलब्ध है
                    </Label>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Checkbox
                    id="isVillageHaveCommunityHall"
                    {...register("isVillageHaveCommunityHall")}
                    className="border-blue-300 data-[state=checked]:bg-blue-600"
                  />
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-blue-600 mr-2" />
                    <Label htmlFor="isVillageHaveCommunityHall" className="text-sm font-medium text-blue-800">
                      सामुदायिक हॉल उपलब्ध है
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Information */}
          <Card className="border-orange-200/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-orange-500" />
                सुरक्षा जानकारी
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    पासवर्ड *
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "पासवर्ड आवश्यक है",
                        minLength: { value: 8, message: "पासवर्ड कम से कम 8 अक्षर का होना चाहिए" },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                          message: "पासवर्ड में कम से कम एक बड़ा अक्षर, छोटा अक्षर, संख्या और विशेष चिह्न होना चाहिए",
                        },
                      })}
                      className="pr-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                      placeholder="मजबूत पासवर्ड दर्ज करें"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <Label htmlFor="repeatPassword" className="text-sm font-medium text-gray-700">
                    पासवर्ड दोबारा दर्ज करें *
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="repeatPassword"
                      type={showRepeatPassword ? "text" : "password"}
                      {...register("repeatPassword", {
                        required: "पासवर्ड की पुष्टि आवश्यक है",
                        validate: (value) => value === watch("password") || "पासवर्ड मेल नहीं खाते",
                      })}
                      className="pr-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                      placeholder="पासवर्ड दोबारा दर्ज करें"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    >
                      {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.repeatPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.repeatPassword.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isCreating}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              {isCreating ? "गांव जोड़ा जा रहा है..." : "गांव जोड़ें"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              रद्द करें
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
