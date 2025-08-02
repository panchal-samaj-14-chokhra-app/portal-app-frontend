import { Smartphone } from "lucide-react"
import { Label } from "@/components/ui/label/label"
import { Checkbox } from "@/components/ui/checkbox/checkbox"
import type { MemberFormProps } from "./types"

interface DigitalAccessSectionProps extends MemberFormProps {}

export function DigitalAccessSection({ member, onUpdateMember }: DigitalAccessSectionProps) {
  return (
    <div>
      <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text text-sm sm:text-base">
        <Smartphone className="w-4 h-4 mr-2" />
        डिजिटल पहुंच और बैंकिंग
      </h4>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`smartphone-${member.id}`}
            checked={member.hasSmartphone}
            onCheckedChange={(checked) => onUpdateMember(member.id, "hasSmartphone", checked)}
          />
          <Label htmlFor={`smartphone-${member.id}`} className="hindi-text text-sm">
            स्मार्टफोन है
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id={`internet-${member.id}`}
            checked={member.hasInternet}
            onCheckedChange={(checked) => onUpdateMember(member.id, "hasInternet", checked)}
          />
          <Label htmlFor={`internet-${member.id}`} className="hindi-text text-sm">
            इंटरनेट की सुविधा
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id={`bank-account-${member.id}`}
            checked={member.hasBankAccount}
            onCheckedChange={(checked) => onUpdateMember(member.id, "hasBankAccount", checked)}
          />
          <Label htmlFor={`bank-account-${member.id}`} className="hindi-text text-sm">
            बैंक खाता है
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id={`jan-dhan-${member.id}`}
            checked={member.hasJanDhan}
            onCheckedChange={(checked) => onUpdateMember(member.id, "hasJanDhan", checked)}
          />
          <Label htmlFor={`jan-dhan-${member.id}`} className="hindi-text text-sm">
            जन धन योजना में नामांकित
          </Label>
        </div>
      </div>
    </div>
  )
}
