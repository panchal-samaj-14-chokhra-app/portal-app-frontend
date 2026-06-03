"use client"

import AnalyticsSection from "@/components/superadmin/analytics-section"
import ReportDownloadCards from "@/components/superadmin/report-download-cards"

interface ReportsViewProps {
  chokhlaId: string
  villages?: { id: string; name: string; displayId?: number }[]
}

export function ReportsView({ chokhlaId, villages }: ReportsViewProps) {
  const villageList = Array.isArray(villages) ? villages : []
  return (
    <div className="w-full space-y-6">
      {/* Comprehensive analytics — defaults to whole chokhra, filter to a village */}
      <AnalyticsSection chokhlaId={chokhlaId} villages={villageList} />

      {/* Per-report PDF downloads (whole chokhra or a single village) */}
      <ReportDownloadCards chokhlaId={chokhlaId} villages={villageList} />
    </div>
  )
}
