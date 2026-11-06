"use client"

import { useFeatureFlags, useUpdateFeatureFlag } from "@/data-hooks/mutation-query/useFeatureFlags"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Loader2, ToggleLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function FeatureFlagsManagement() {
  const { data: flags, isLoading } = useFeatureFlags()
  const update = useUpdateFeatureFlag()
  const { toast } = useToast()

  const toggle = (key: string, current: boolean) => {
    update.mutate(
      { key, payload: { enabled: !current } },
      {
        onSuccess: (flag) =>
          toast({
            title: flag.enabled ? "फ़ीचर चालू किया" : "फ़ीचर बंद किया",
            description: `"${flag.label}" अब ${flag.enabled ? "चालू" : "बंद"} है।`,
          }),
        onError: () =>
          toast({ title: "त्रुटि", description: "बदलाव सहेजा नहीं गया।", variant: "destructive" }),
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <ToggleLeft className="w-5 h-5 text-orange-600" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">फ़ीचर फ्लैग्स</h2>
          <p className="text-sm text-gray-500">वेबसाइट की सुविधाएं चालू / बंद करें</p>
        </div>
      </div>

      <div className="space-y-3">
        {(flags ?? []).map((flag) => (
          <div
            key={flag.key}
            className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 text-sm">{flag.label}</span>
                <Badge
                  variant={flag.enabled ? "default" : "secondary"}
                  className={`text-xs shrink-0 ${flag.enabled ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-100"}`}
                >
                  {flag.enabled ? "चालू" : "बंद"}
                </Badge>
              </div>
              {flag.description && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">{flag.description}</p>
              )}
              <p className="text-xs text-gray-300 mt-0.5 font-mono">{flag.key}</p>
            </div>
            <Switch
              checked={flag.enabled}
              onCheckedChange={() => toggle(flag.key, flag.enabled)}
              disabled={update.isPending}
              className="shrink-0 data-[state=checked]:bg-orange-500"
            />
          </div>
        ))}
      </div>

      {!flags?.length && (
        <p className="text-center text-gray-400 py-12 text-sm">कोई फ्लैग नहीं मिला।</p>
      )}
    </div>
  )
}
