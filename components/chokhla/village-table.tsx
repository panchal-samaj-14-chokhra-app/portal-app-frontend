"use client"
import {
  Eye,
  Users,
  MapPin,
  Zap,
  Droplets,
  GraduationCap,
  Heart,
  RouteIcon as Road,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import type { Village } from "./types"
import { FACILITY_LABELS } from "./constants"

interface VillageTableProps {
  villages: Village[]
  isLoading: boolean
}

export function VillageTable({ villages, isLoading }: VillageTableProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            गांवों की सूची
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (villages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            गांवों की सूची
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोई गांव नहीं मिला</h3>
            <p className="text-gray-600 mb-4">अभी तक कोई गांव पंजीकृत नहीं किया गया है।</p>
            <Button onClick={() => router.push("#add-village")} className="bg-blue-600 hover:bg-blue-700">
              पहला गांव जोड़ें
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getFacilityIcon = (facility: string, hasIt: boolean) => {
    const iconClass = `w-4 h-4 ${hasIt ? "text-green-600" : "text-gray-400"}`

    switch (facility) {
      case "hasElectricity":
        return <Zap className={iconClass} />
      case "hasWaterSupply":
        return <Droplets className={iconClass} />
      case "hasSchool":
        return <GraduationCap className={iconClass} />
      case "hasHealthCenter":
        return <Heart className={iconClass} />
      case "hasRoadAccess":
        return <Road className={iconClass} />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            गांवों की सूची ({villages.length})
          </div>
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            कुल: {villages.reduce((sum, v) => sum + v.totalMembers, 0)} सदस्य
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>गांव का नाम</TableHead>
                <TableHead>स्थान</TableHead>
                <TableHead>परिवार/सदस्य</TableHead>
                <TableHead>सुविधाएं</TableHead>
                <TableHead>कार्य</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {villages.map((village) => (
                <TableRow key={village.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{village.name}</div>
                      <div className="text-sm text-gray-500">पिनकोड: {village.pincode}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {village.district}, {village.state}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="text-green-700 border-green-300 w-fit">
                        {village.totalFamilies} परिवार
                      </Badge>
                      <Badge variant="outline" className="text-blue-700 border-blue-300 w-fit">
                        {village.totalMembers} सदस्य
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {Object.entries(FACILITY_LABELS).map(([key, label]) => (
                        <div
                          key={key}
                          title={`${label}: ${village[key as keyof Village] ? "उपलब्ध" : "अनुपलब्ध"}`}
                          className="flex items-center"
                        >
                          {getFacilityIcon(key, village[key as keyof Village] as boolean)}
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/village/${village.id}`)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        देखें
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/village/${village.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            विस्तार से देखें
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/village/${village.id}/add-family`)}>
                            <Users className="w-4 h-4 mr-2" />
                            परिवार जोड़ें
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
