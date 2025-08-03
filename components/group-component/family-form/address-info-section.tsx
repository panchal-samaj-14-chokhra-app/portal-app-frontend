"use client"

import { MapPin, Copy, Globe } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import type { MemberFormProps } from "./types"
import { statesAndDistricts } from "./constants"
import { useState, useEffect } from "react"

export function AddressInfoSection({ member, index, errors, onUpdateMember, onCopyFamilyAddress }: MemberFormProps) {
  const errorPrefix = `member_${index}_`
  const [districts, setDistricts] = useState<string[]>([])

  useEffect(() => {
    if (member.state && statesAndDistricts[member.state]) {
      setDistricts(statesAndDistricts[member.state])
    } else {
      setDistricts([])
    }
  }, [member.state])

  const copyPermanentToCurrent = () => {
    onUpdateMember(member.id, "currentAddress", member.permanentAddress)
  }

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-purple-600" />
          <h4 className="font-semibold text-gray-800 hindi-text text-base sm:text-lg">पता की जानकारी</h4>
        </div>

        <div className="space-y-6">
          {/* Address Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor={`permanentAddress-${member.id}`} className="hindi-text text-sm font-medium">
                  स्थायी पता
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onCopyFamilyAddress(member.id)}
                  className="text-xs bg-transparent"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span className="hindi-text">परिवार का पता कॉपी करें</span>
                </Button>
              </div>
              <Textarea
                id={`permanentAddress-${member.id}`}
                value={member.permanentAddress}
                onChange={(e) => onUpdateMember(member.id, "permanentAddress", e.target.value)}
                placeholder="स्थायी पता दर्ज करें"
                className="min-h-[80px] text-sm"
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor={`currentAddress-${member.id}`} className="hindi-text text-sm font-medium">
                  वर्तमान पता
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyPermanentToCurrent}
                  className="text-xs bg-transparent"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span className="hindi-text">स्थायी पता कॉपी करें</span>
                </Button>
              </div>
              <Textarea
                id={`currentAddress-${member.id}`}
                value={member.currentAddress}
                onChange={(e) => onUpdateMember(member.id, "currentAddress", e.target.value)}
                placeholder="वर्तमान पता दर्ज करें"
                className="min-h-[80px] text-sm"
                rows={3}
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-purple-50 p-4 rounded-lg space-y-4">
            <h5 className="font-medium text-purple-800 hindi-text">स्थान विवरण</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor={`state-${member.id}`} className="hindi-text text-sm font-medium">
                  राज्य
                </Label>
                <Select
                  value={member.state}
                  onValueChange={(value) => {
                    onUpdateMember(member.id, "state", value)
                    onUpdateMember(member.id, "district", "") // Clear district when state changes
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="राज्य चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(statesAndDistricts).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`district-${member.id}`} className="hindi-text text-sm font-medium">
                  जिला
                </Label>
                <Select
                  value={member.district}
                  onValueChange={(value) => onUpdateMember(member.id, "district", value)}
                  disabled={!member.state || districts.length === 0}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="जिला चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`pincode-${member.id}`} className="hindi-text text-sm font-medium">
                  पिनकोड
                </Label>
                <Input
                  id={`pincode-${member.id}`}
                  value={member.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                    onUpdateMember(member.id, "pincode", value)
                  }}
                  placeholder="पिनकोड"
                  maxLength={6}
                  className={`mt-1 text-sm ${errors[`${errorPrefix}pincode`] ? "border-red-500" : ""}`}
                />
                {errors[`${errorPrefix}pincode`] && (
                  <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`${errorPrefix}pincode`]}</p>
                )}
              </div>

              <div>
                <Label htmlFor={`village-${member.id}`} className="hindi-text text-sm font-medium">
                  गांव/शहर
                </Label>
                <Input
                  id={`village-${member.id}`}
                  value={member.village}
                  onChange={(e) => onUpdateMember(member.id, "village", e.target.value)}
                  placeholder="गांव/शहर का नाम"
                  className="mt-1 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Current Address Location */}
          <div className="bg-indigo-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <h5 className="font-medium text-indigo-800 hindi-text">वर्तमान पता स्थान</h5>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`isCurrentAddressInIndia-${member.id}`}
                checked={member.isCurrentAddressInIndia}
                onCheckedChange={(checked) => {
                  onUpdateMember(member.id, "isCurrentAddressInIndia", checked)
                  if (checked) {
                    onUpdateMember(member.id, "currentCountry", "भारत")
                  }
                }}
              />
              <Label htmlFor={`isCurrentAddressInIndia-${member.id}`} className="hindi-text text-sm cursor-pointer">
                वर्तमान पता भारत में है
              </Label>
            </div>

            {!member.isCurrentAddressInIndia && (
              <div>
                <Label htmlFor={`currentCountry-${member.id}`} className="hindi-text text-sm font-medium">
                  वर्तमान देश
                </Label>
                <Input
                  id={`currentCountry-${member.id}`}
                  value={member.currentCountry}
                  onChange={(e) => onUpdateMember(member.id, "currentCountry", e.target.value)}
                  placeholder="देश का नाम दर्ज करें"
                  className="mt-1 text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
