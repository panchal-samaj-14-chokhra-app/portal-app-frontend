"use client"

import { useFeatureFlags, useUpdateFeatureFlag } from "@/data-hooks/mutation-query/useFeatureFlags"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Props {
  section: string
  title?: string
  description?: string
}

export default function SectionFeatureFlags({ section, title = "फ़ीचर फ्लैग्स", description }: Props) {
  const { data: flags, isLoading } = useFeatureFlags(section)
  const update = useUpdateFeatureFlag()
  const { toast } = useToast()

  const toggle = (flagKey: string, current: boolean) => {
    update.mutate(
      { key: flagKey, payload: { enabled: !current } },
      {
        onSuccess: (flag) =>
          toast({
            title: flag.enabled ? `"${flag.label}" चालू किया` : `"${flag.label}" बंद किया`,
          }),
        onError: () => toast({ title: "त्रुटि", description: "बदलाव सहेजा नहीं गया।", variant: "destructive" }),
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-gray-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> लोड हो रहा है...
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {(flags ?? []).map((flag) => (
          <div
            key={flag.key}
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2.5 shadow-sm"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-800 truncate">{flag.label}</span>
                <Badge
                  className={`text-[10px] px-1.5 py-0 shrink-0 ${flag.enabled
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-100"}`}
                >
                  {flag.enabled ? "चालू" : "बंद"}
                </Badge>
              </div>
              {flag.description && (
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">{flag.description}</p>
              )}
            </div>
            <Switch
              checked={flag.enabled}
              onCheckedChange={() => toggle(flag.key, flag.enabled)}
              disabled={update.isPending}
              className="shrink-0 data-[state=checked]:bg-orange-500"
            />
          </div>
        ))}
        {!flags?.length && (
          <p className="text-xs text-gray-400 col-span-2">कोई फ्लैग नहीं मिला।</p>
        )}
      </div>
    </div>
  )
}
