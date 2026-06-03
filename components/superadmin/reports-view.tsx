"use client"

import KpiDashboard from "./kpi-dashboard"
import AnalyticsSection from "./analytics-section"
import ReportDownloadCards from "./report-download-cards"

export default function ReportsView() {
  return (
    <div className="w-full space-y-6">
      {/* Comprehensive analytics with chokhra filter */}
      <AnalyticsSection />

      {/* High-level KPIs + charts (common across all chokhras) */}
      <KpiDashboard />

      {/* Per-report PDF downloads */}
      <ReportDownloadCards />
    </div>
  )
}
