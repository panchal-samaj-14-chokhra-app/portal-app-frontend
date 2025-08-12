"use client"

import { useEffect, useMemo, useState } from "react"
import { MapPin, Copy } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { MemberFormProps } from "./types"
import { statesAndDistricts } from "./constants"

export function AddressInfoSection({
  member,
  index,
  errors,
  onUpdateMember,
  onCopyFamilyAddress,
  familyData,
}: MemberFormProps) {
  const errorPrefix = `member_${index}_`

  // District lists depend on selected state for each section
  const [permDistricts, setPermDistricts] = useState<string[]>([])
  const [currDistricts, setCurrDistricts] = useState<string[]>([])

  useEffect(() => {
    if (member.personPermanentState && statesAndDistricts[member.personPermanentState]) {
      setPermDistricts(statesAndDistricts[member.personPermanentState])
    } else {
      setPermDistricts([])
    }
  }, [member.personPermanentState])

  useEffect(() => {
    if (member.personCurrentState && statesAndDistricts[member.personCurrentState]) {
      setCurrDistricts(statesAndDistricts[member.personCurrentState])
    } else {
      setCurrDistricts([])
    }
  }, [member.personCurrentState])

  // Build state options once
  const stateOptions = useMemo(() => Object.keys(statesAndDistricts), [])

  // Copy family permanent address -> member permanent fields (and legacy helper for compatibility)
  const copyFamilyPermanentToMemberPermanent = () => {
    // optional legacy copy for existing behavior
    if (onCopyFamilyAddress) {
      onCopyFamilyAddress(member.id)
    }
    // new person* fields
    onUpdateMember(member.id, "personPermanentAddress", familyData.permanentAddress || "")
    onUpdateMember(member.id, "personPermanentState", familyData.permanentFamilyState || "")
    onUpdateMember(member.id, "personPermanentDistrict", familyData.permanentFamilyDistrict || "")
    onUpdateMember(member.id, "personPermanentVillage", familyData.permanentFamilyVillage || "")
    onUpdateMember(
      member.id,
      "personPermanentPincode",
      (familyData.permanentFamilyPincode || "").toString().replace(/\D/g, "").slice(0, 6),
    )
  }

  // Copy member permanent -> member current fields
  const copyPermanentToCurrent = () => {
    onUpdateMember(member.id, "personCurrentAddress", member.personPermanentAddress || "")
    onUpdateMember(member.id, "personCurrentState", member.personPermanentState || "")
    onUpdateMember(member.id, "personCurrentDistrict", member.personPermanentDistrict || "")
    onUpdateMember(member.id, "personCurrentVillage", member.personPermanentVillage || "")
    onUpdateMember(
      member.id,
      "personCurrentPincode",
      (member.personPermanentPincode || "").toString().replace(/\D/g, "").slice(0, 6),
    )
  }

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0" />
          <h4 className="font-semibold text-gray-800 hindi-text text-base sm:text-lg">{"पता की जानकारी"}</h4>
        </div>

        <div className="space-y-6">
          {/* Permanent Address Section */}
          <div className="rounded-lg border bg-white">
            <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 bg-purple-50 rounded-t-lg">
              <h5 className="font-medium text-purple-800 hindi-text text-sm sm:text-base">
                {"स्थायी पता (Permanent Address)"}
              </h5>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyFamilyPermanentToMemberPermanent}
                className="text-xs bg-transparent"
              >
                <Copy className="w-3 h-3 mr-1" />
                <span className="hindi-text">{"परिवार का पता कॉपी करें"}</span>
              </Button>
            </div>
            <div className="p-3 sm:p-4 space-y-4">
              <div>
                <Label htmlFor={`personPermanentAddress-${member.id}`} className="hindi-text text-sm font-medium">
                  {"स्थायी पता"}
                </Label>
                <Textarea
                  id={`personPermanentAddress-${member.id}`}
                  value={member.personPermanentAddress || ""}
                  onChange={(e) => onUpdateMember(member.id, "personPermanentAddress", e.target.value)}
                  placeholder="स्थायी पता दर्ज करें"
                  className="min-h-[80px] text-sm"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor={`personPermanentState-${member.id}`} className="hindi-text text-sm font-medium">
                    {"राज्य"}
                  </Label>
                  <Select
                    value={member.personPermanentState || ""}
                    onValueChange={(value) => {
                      onUpdateMember(member.id, "personPermanentState", value)
                      onUpdateMember(member.id, "personPermanentDistrict", "")
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="राज्य चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateOptions.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`personPermanentDistrict-${member.id}`} className="hindi-text text-sm font-medium">
                    {"जिला"}
                  </Label>
                  <Select
                    value={member.personPermanentDistrict || ""}
                    onValueChange={(value) => onUpdateMember(member.id, "personPermanentDistrict", value)}
                    disabled={!member.personPermanentState || permDistricts.length === 0}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="जिला चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      {permDistricts.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`personPermanentVillage-${member.id}`} className="hindi-text text-sm font-medium">
                    {"गांव/शहर"}
                  </Label>
                  <Input
                    id={`personPermanentVillage-${member.id}`}
                    value={member.personPermanentVillage || ""}
                    onChange={(e) => onUpdateMember(member.id, "personPermanentVillage", e.target.value)}
                    placeholder="गांव/शहर का नाम"
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor={`personPermanentPincode-${member.id}`} className="hindi-text text-sm font-medium">
                    {"पिनकोड"}
                  </Label>
                  <Input
                    id={`personPermanentPincode-${member.id}`}
                    value={member.personPermanentPincode || ""}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                      onUpdateMember(member.id, "personPermanentPincode", value)
                    }}
                    placeholder="पिनकोड"
                    maxLength={6}
                    className={`mt-1 text-sm ${errors[`${errorPrefix}personPermanentPincode`] ? "border-red-500" : ""}`}
                  />
                  {errors[`${errorPrefix}personPermanentPincode`] && (
                    <p className="text-red-500 text-xs mt-1 hindi-text">
                      {errors[`${errorPrefix}personPermanentPincode`]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current Address Section */}
          <div className="rounded-lg border bg-white">
            <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 bg-indigo-50 rounded-t-lg">
              <h5 className="font-medium text-indigo-800 hindi-text text-sm sm:text-base">
                {"वर्तमान पता (Current Address)"}
              </h5>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyPermanentToCurrent}
                className="text-xs bg-transparent"
              >
                <Copy className="w-3 h-3 mr-1" />
                <span className="hindi-text">{"स्थायी पता कॉपी करें"}</span>
              </Button>
            </div>

            <div className="p-3 sm:p-4 space-y-4">
              <div>
                <Label htmlFor={`personCurrentAddress-${member.id}`} className="hindi-text text-sm font-medium">
                  {"वर्तमान पता"}
                </Label>
                <Textarea
                  id={`personCurrentAddress-${member.id}`}
                  value={member.personCurrentAddress || ""}
                  onChange={(e) => onUpdateMember(member.id, "personCurrentAddress", e.target.value)}
                  placeholder="वर्तमान पता दर्ज करें"
                  className="min-h-[80px] text-sm"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor={`personCurrentState-${member.id}`} className="hindi-text text-sm font-medium">
                    {"राज्य"}
                  </Label>
                  <Select
                    value={member.personCurrentState || ""}
                    onValueChange={(value) => {
                      onUpdateMember(member.id, "personCurrentState", value)
                      onUpdateMember(member.id, "personCurrentDistrict", "")
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="राज्य चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateOptions.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`personCurrentDistrict-${member.id}`} className="hindi-text text-sm font-medium">
                    {"जिला"}
                  </Label>
                  <Select
                    value={member.personCurrentDistrict || ""}
                    onValueChange={(value) => onUpdateMember(member.id, "personCurrentDistrict", value)}
                    disabled={!member.personCurrentState || currDistricts.length === 0}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="जिला चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      {currDistricts.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`personCurrentVillage-${member.id}`} className="hindi-text text-sm font-medium">
                    {"गांव/शहर"}
                  </Label>
                  <Input
                    id={`personCurrentVillage-${member.id}`}
                    value={member.personCurrentVillage || ""}
                    onChange={(e) => onUpdateMember(member.id, "personCurrentVillage", e.target.value)}
                    placeholder="गांव/शहर का नाम"
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor={`personCurrentPincode-${member.id}`} className="hindi-text text-sm font-medium">
                    {"पिनकोड"}
                  </Label>
                  <Input
                    id={`personCurrentPincode-${member.id}`}
                    value={member.personCurrentPincode || ""}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                      onUpdateMember(member.id, "personCurrentPincode", value)
                    }}
                    placeholder="पिनकोड"
                    maxLength={6}
                    className={`mt-1 text-sm ${errors[`${errorPrefix}personCurrentPincode`] ? "border-red-500" : ""}`}
                  />
                  {errors[`${errorPrefix}personCurrentPincode`] && (
                    <p className="text-red-500 text-xs mt-1 hindi-text">
                      {errors[`${errorPrefix}personCurrentPincode`]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
