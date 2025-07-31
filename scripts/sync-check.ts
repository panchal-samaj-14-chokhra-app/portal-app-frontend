import { backendSync } from "../lib/backend-sync"

async function runSyncCheck() {
  console.log("🔄 Starting backend synchronization check...")

  try {
    // Check backend status
    const status = await backendSync.checkBackendStatus()

    console.log("📊 Sync Status:", {
      healthy: status.isHealthy ? "✅" : "❌",
      compatible: status.isCompatible ? "✅" : "❌",
      frontendVersion: status.frontendVersion,
      backendVersion: status.backendVersion || "Unknown",
      lastSync: status.lastSync?.toISOString() || "Never",
      errors: status.errors,
    })

    if (!status.isHealthy) {
      console.error("❌ Backend is not healthy. Please check your backend service.")
      process.exit(1)
    }

    if (!status.isCompatible) {
      console.warn("⚠️  API version mismatch detected. Consider updating your backend or frontend.")
    }

    // Test sync for all data types
    const dataTypes = ["families", "villages", "chokhlas", "users"] as const

    for (const dataType of dataTypes) {
      console.log(`🔄 Testing ${dataType} sync...`)
      const syncResult = await backendSync.syncData(dataType)
      console.log(`${syncResult ? "✅" : "❌"} ${dataType} sync ${syncResult ? "successful" : "failed"}`)
    }

    console.log("✅ Backend synchronization check completed successfully!")
  } catch (error) {
    console.error("❌ Sync check failed:", error)
    process.exit(1)
  }
}

// Run the sync check
runSyncCheck()
