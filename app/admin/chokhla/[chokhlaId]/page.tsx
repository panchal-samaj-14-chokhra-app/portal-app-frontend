import { Suspense } from "react"
import { AdminErrorBoundary } from "@/components/admin-error-boundary"
import ChokhlaClientPage from "./ChokhlaClientPage"
import { ChokhlaPageSkeleton } from "./ChokhlaClientPage"

// Main page component with error boundaries
export default async function ChokhlaPage({
  params,
}: {
  params: { chokhlaId: string }
}) {
  try {
    const { chokhlaId } = params

    return (
      <AdminErrorBoundary>
        <Suspense fallback={<ChokhlaPageSkeleton />}>
          <ChokhlaClientPage />
        </Suspense>
      </AdminErrorBoundary>
    )
  } catch (error) {
    console.error("Error in ChokhlaPage:", error)
    throw error
  }
}

// Add metadata generation with error handling
export async function generateMetadata({
  params,
}: {
  params: { chokhlaId: string }
}) {
  try {
    const { chokhlaId } = params

    return {
      title: `चोखला ${chokhlaId} - पंचाल समाज 14 चोखरा`,
      description: `चोखला ${chokhlaId} का विस्तृत विवरण और गांव की जानकारी`,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "चोखला - पंचाल समाज 14 चोखरा",
      description: "चोखला की जानकारी",
    }
  }
}
