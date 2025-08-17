"use client"

import { Home, Zap, Car } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MemberFormProps } from "./types"
import { houseTypes, houseOwnershipOptions, waterSources, cookingFuels, vehicleTypes } from "./constants"

export function LivingStatusSection({ member, index, errors, onUpdateMember }: MemberFormProps) {
  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-5 h-5 text-orange-600" />
          <h4 className="font-semibold text-gray-800 hindi-text text-base sm:text-lg">आवास और संपत्ति</h4>
        </div>

        <div className="space-y-6">
          {/* Housing Information */}
          <div className="bg-orange-50 p-4 rounded-lg space-y-4">
            <h5 className="font-medium text-orange-800 hindi-text">आवास की जानकारी</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`houseType-${member.id}`} className="hindi-text text-sm font-medium">
                  मकान का प्रकार
                </Label>
                <Select
                  value={member.houseType}
                  onValueChange={(value) => onUpdateMember(member.id, "houseType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="मकान का प्रकार चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {houseTypes.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`houseOwnership-${member.id}`} className="hindi-text text-sm font-medium">
                  मकान का स्वामित्व
                </Label>
                <Select
                  value={member.houseOwnership}
                  onValueChange={(value) => onUpdateMember(member.id, "houseOwnership", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="स्वामित्व चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {houseOwnershipOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Utilities */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <h5 className="font-medium text-blue-800 hindi-text">सुविधाएं</h5>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`waterSource-${member.id}`} className="hindi-text text-sm font-medium">
                  पानी का स्रोत
                </Label>
                <Select
                  value={member.waterSource}
                  onValueChange={(value) => onUpdateMember(member.id, "waterSource", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="पानी का स्रोत चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {waterSources.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`cookingFuel-${member.id}`} className="hindi-text text-sm font-medium">
                  खाना पकाने का ईंधन
                </Label>
                <Select
                  value={member.cookingFuel}
                  onValueChange={(value) => onUpdateMember(member.id, "cookingFuel", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="ईंधन चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {cookingFuels.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`hasElectricity-${member.id}`}
                  checked={member.hasElectricity}
                  onCheckedChange={(checked) => onUpdateMember(member.id, "hasElectricity", checked)}
                />
                <Label htmlFor={`hasElectricity-${member.id}`} className="hindi-text text-sm cursor-pointer">
                  बिजली की सुविधा है
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`hasToilet-${member.id}`}
                  checked={member.hasToilet}
                  onCheckedChange={(checked) => onUpdateMember(member.id, "hasToilet", checked)}
                />
                <Label htmlFor={`hasToilet-${member.id}`} className="hindi-text text-sm cursor-pointer">
                  शौचालय की सुविधा है
                </Label>
              </div>
            </div>
          </div>

          {/* Property and Assets */}
          <div className="bg-green-50 p-4 rounded-lg space-y-4">
            <h5 className="font-medium text-green-800 hindi-text">संपत्ति और संसाधन</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`landOwned-${member.id}`} className="hindi-text text-sm font-medium">
                 कृषि भूमि (एकड़ में)
                </Label>
                <div className="relative mt-1">
                  <Input
                    id={`landOwned-${member.id}`}
                    type="number"
                    min={0}
                    step={0.1}
                    value={member.landOwned || ""}
                    onChange={(e) => {
                      const value = Number.parseFloat(e.target.value)
                      onUpdateMember(member.id, "landOwned", isNaN(value) ? 0 : value)
                    }}
                    placeholder="0"
                    className="text-sm pr-12"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">एकड़</span>
                </div>
              </div>

              <div>
                <Label htmlFor={`livestock-${member.id}`} className="hindi-text text-sm font-medium">
                  पशुधन
                </Label>
                <Input
                  id={`livestock-${member.id}`}
                  value={member.livestock}
                  onChange={(e) => onUpdateMember(member.id, "livestock", e.target.value)}
                  placeholder="जैसे: गाय, भैंस, बकरी"
                  className="mt-1 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-purple-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-4 h-4 text-purple-600" />
              <h5 className="font-medium text-purple-800 hindi-text">वाहन की जानकारी</h5>
            </div>

            <div>
              <Label htmlFor={`vehicleType-${member.id}`} className="hindi-text text-sm font-medium">
                वाहन का प्रकार
              </Label>
              <Select
                value={member.vehicleType}
                onValueChange={(value: "NONE" | "BICYCLE" | "MOTORCYCLE" | "CAR" | "TRUCK" | "OTHER") =>
                  onUpdateMember(member.id, "vehicleType", value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="वाहन चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            {member.hasElectricity && (
              <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                <Zap className="w-3 h-3 mr-1" />
                बिजली
              </Badge>
            )}
            {member.hasToilet && (
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                शौचालय
              </Badge>
            )}
            {member.landOwned > 0 && (
              <Badge variant="outline" className="border-green-500 text-green-700">
               कृषि भूमि स्वामी ({member.landOwned} एकड़)
              </Badge>
            )}
            {member.vehicleType !== "NONE" && (
              <Badge variant="outline" className="border-purple-500 text-purple-700">
                <Car className="w-3 h-3 mr-1" />
                वाहन स्वामी
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
