"use client"

import { Home } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { MemberFormProps } from "./types"

export function LivingStatusSection({ member, index, errors, onUpdateMember }: MemberFormProps) {
  return (
    <div>
      <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text text-sm sm:text-base">
        <Home className="w-4 h-4 mr-2" />
        आवास और संपत्ति की जानकारी
      </h4>
      <div className="mobile-form-grid">
        <div>
          <Label className="hindi-text text-sm">घर का प्रकार</Label>
          <Select value={member.houseType} onValueChange={(value) => onUpdateMember(member.id, "houseType", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kutcha">कच्चा</SelectItem>
              <SelectItem value="pucca">पक्का</SelectItem>
              <SelectItem value="semi_pucca">अर्ध-पक्का</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="hindi-text text-sm">घर का स्वामित्व</Label>
          <Select
            value={member.houseOwnership}
            onValueChange={(value) => onUpdateMember(member.id, "houseOwnership", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owned">स्वयं का</SelectItem>
              <SelectItem value="rented">किराए का</SelectItem>
              <SelectItem value="family">पारिवारिक</SelectItem>
              <SelectItem value="government">सरकारी</SelectItem>
              <SelectItem value="other">अन्य</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="hindi-text text-sm">पानी का स्रोत</Label>
          <Select value={member.waterSource} onValueChange={(value) => onUpdateMember(member.id, "waterSource", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="चुनें" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tap">नल</SelectItem>
              <SelectItem value="well">कुआं</SelectItem>
              <SelectItem value="hand_pump">हैंड पंप</SelectItem>
              <SelectItem value="borewell">बोरवेल</SelectItem>
              <SelectItem value="river">नदी/तालाब</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="hindi-text text-sm">खाना पकाने का ईंधन</Label>
          <Select value={member.cookingFuel} onValueChange={(value) => onUpdateMember(member.id, "cookingFuel", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lpg">एलपीजी</SelectItem>
              <SelectItem value="firewood">लकड़ी</SelectItem>
              <SelectItem value="kerosene">मिट्टी का तेल</SelectItem>
              <SelectItem value="cow_dung">गोबर</SelectItem>
              <SelectItem value="coal">कोयला</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="hindi-text text-sm">भूमि स्वामित्व (एकड़)</Label>
          <Input
            type="number"
            value={member.landOwned || ""}
            onChange={(e) => onUpdateMember(member.id, "landOwned", Number.parseFloat(e.target.value) || 0)}
            placeholder="भूमि का क्षेत्रफल"
            min="0"
            step="0.1"
            className="mt-1 text-sm"
          />
        </div>

        <div>
          <Label className="hindi-text text-sm">पशुधन</Label>
          <Input
            value={member.livestock}
            onChange={(e) => onUpdateMember(member.id, "livestock", e.target.value)}
            placeholder="गाय, भैंस, बकरी आदि"
            className="mt-1 text-sm"
          />
        </div>

        <div>
          <Label className="hindi-text text-sm">वाहन का प्रकार</Label>
          <Select value={member.vehicleType} onValueChange={(value) => onUpdateMember(member.id, "vehicleType", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">कोई वाहन नहीं</SelectItem>
              <SelectItem value="BICYCLE">साइकिल</SelectItem>
              <SelectItem value="MOTORCYCLE">मोटरसाइकिल</SelectItem>
              <SelectItem value="CAR">कार</SelectItem>
              <SelectItem value="TRUCK">ट्रक</SelectItem>
              <SelectItem value="OTHER">अन्य</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`electricity-${member.id}`}
            checked={member.hasElectricity}
            onCheckedChange={(checked) => onUpdateMember(member.id, "hasElectricity", checked)}
          />
          <Label htmlFor={`electricity-${member.id}`} className="hindi-text text-sm">
            बिजली की सुविधा
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`toilet-${member.id}`}
            checked={member.hasToilet}
            onCheckedChange={(checked) => onUpdateMember(member.id, "hasToilet", checked)}
          />
          <Label htmlFor={`toilet-${member.id}`} className="hindi-text text-sm">
            शौचालय की सुविधा
          </Label>
        </div>
      </div>
    </div>
  )
}
