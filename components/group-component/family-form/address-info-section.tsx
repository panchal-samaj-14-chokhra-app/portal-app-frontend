"use client"

import { MapPin, Copy, Globe } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import type { MemberFormProps } from "./types"
import { SelectInput } from "./employment-info-section"
import { countries, statesAndDistricts } from "./constants"
import { useEffect, useState } from "react"

export function AddressInfoSection({ member, index, errors, onUpdateMember, onCopyFamilyAddress }: MemberFormProps) {
  const copyPermanentToCurrentMember = () => {
    onUpdateMember(member.id, "currentAddress", member.permanentAddress)
  }
  const [districts, setDistricts] = useState<string[]>([])
  useEffect(() => { }, [member.currentAddress])

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-700 flex items-center hindi-text text-sm sm:text-base">
          <MapPin className="w-4 h-4 mr-2" />
          पता की जानकारी
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onCopyFamilyAddress(member.id)}
          className="text-xs"
        >
          <Copy className="w-3 h-3 mr-1" />
          <span className="hindi-text">परिवार का पता कॉपी करें</span>
        </Button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label className="hindi-text text-sm">स्थायी पता</Label>
            <Textarea
              value={member.permanentAddress}
              onChange={(e) => onUpdateMember(member.id, "permanentAddress", e.target.value)}
              placeholder="स्थायी पता दर्ज करें"
              className="mt-1 text-sm"
              rows={3}
            />
          </div>
        </div>
        <div className="mobile-form-grid">
          <div>
            <SelectInput
              value={member.state}
              onChange={(e) => {
                onUpdateMember(member.id, "state", e)
                let districtList = statesAndDistricts[e]
                setDistricts(districtList)
              }}
              placeholder="राज्य"
              label="राज्य"
              options={Object.keys(statesAndDistricts).map((state) => ({ label: state, value: state }))}

            />
          </div>
          <div>
            <SelectInput
              label="जिला"
              value={member.district}

              options={districts.map((district: string) => ({ label: district, value: district }))}
              onChange={(e) => onUpdateMember(member.id, "district", e)}
              placeholder="जिला चुनें"
            />

          </div>
          <div>
            <Label className="hindi-text text-sm">गांव / शहर का नाम</Label>
            <Input
              value={member.village}
              onChange={(e) => onUpdateMember(member.id, "village", e.target.value)}
              placeholder="गांव / शहर का नाम"
              className="mt-1 text-sm"
            />
          </div>
          <div>
            <Label className="hindi-text text-sm">पिनकोड</Label>
            <Input
              value={member.pincode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                onUpdateMember(member.id, "pincode", value)
              }}
              placeholder="पिनकोड"
              maxLength={6}
              className={`mt-1 text-sm ${errors[`member-${index}-pincode`] ? "border-red-500" : ""}`}
            />
            {errors[`member-${index}-pincode`] && (
              <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`member-${index}-pincode`]}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`currentAddressIndia-${member.id}`}
            checked={member.isCurrentAddressInIndia}
            onCheckedChange={(checked) => onUpdateMember(member.id, "isCurrentAddressInIndia", checked)}
          />
          <Label htmlFor={`currentAddressIndia-${member.id}`} className="hindi-text text-sm">
            वर्तमान पता भारत में है
          </Label>
        </div>
        {member.isCurrentAddressInIndia && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="hindi-text text-sm">वर्तमान पता</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyPermanentToCurrentMember}
                className="text-xs bg-transparent"
              >
                <Copy className="w-3 h-3 mr-1" />
                <span className="hindi-text">स्थायी पता कॉपी करें</span>
              </Button>
            </div>

            <Textarea
              value={member.currentAddress}
              onChange={(e) => onUpdateMember(member.id, "currentAddress", e.target.value)}
              placeholder="वर्तमान पता दर्ज करें"
              className="mt-1 text-sm"
              rows={3}
            />
          </div>
        )}
        {!member.isCurrentAddressInIndia && (
          <div className="max-w-md">
            <Label className="hindi-text flex items-center text-sm">
              <Globe className="w-4 h-4 mr-1" />
              देश का नाम
            </Label>
            <SelectInput
              value={member.currentCountry}
              options={countries}
              onChange={(e) => onUpdateMember(member.id, "currentCountry", e)}
              placeholder="देश का नाम दर्ज करें"
              label="देश का नाम दर्ज करें"

            />
          </div>
        )}
      </div>
    </div>
  )
}
