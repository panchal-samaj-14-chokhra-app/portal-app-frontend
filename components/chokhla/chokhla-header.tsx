"use client"

import { ArrowLeft, User, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import type { ChokhlaProfile } from "./types"

interface ChokhlaHeaderProps {
  profile: ChokhlaProfile | null
  isLoading: boolean
}

export function ChokhlaHeader({ profile, isLoading }: ChokhlaHeaderProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {profile ? `${profile.firstName} ${profile.lastName}` : "चोखला प्रोफाइल"}
              </h1>
              {profile && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  {profile.district}, {profile.state}
                </div>
              )}
            </div>
          </div>
        </div>

        {profile && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              {profile.totalVillages} गांव
            </Badge>
            <Badge variant="outline" className="text-green-700 border-green-300">
              {profile.totalFamilies} परिवार
            </Badge>
            <Badge variant="outline" className="text-purple-700 border-purple-300">
              {profile.totalMembers} सदस्य
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
