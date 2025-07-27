import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function VillagesLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="h-9 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      {/* Search and Filter Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="h-9 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>

      {/* Villages Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-9 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
