import { checkBackendHealth, checkApiCompatibility } from "@/config/request"

export interface SyncStatus {
  isHealthy: boolean
  isCompatible: boolean
  lastSync?: Date
  backendVersion?: string
  frontendVersion: string
  errors: string[]
}

export class BackendSyncManager {
  private static instance: BackendSyncManager
  private syncStatus: SyncStatus = {
    isHealthy: false,
    isCompatible: false,
    frontendVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    errors: [],
  }

  private constructor() {}

  static getInstance(): BackendSyncManager {
    if (!BackendSyncManager.instance) {
      BackendSyncManager.instance = new BackendSyncManager()
    }
    return BackendSyncManager.instance
  }

  async checkBackendStatus(): Promise<SyncStatus> {
    const errors: string[] = []

    try {
      // Check backend health
      const isHealthy = await checkBackendHealth()
      this.syncStatus.isHealthy = isHealthy

      if (!isHealthy) {
        errors.push("Backend service is not responding")
      }

      // Check API compatibility
      const compatibilityResult = await checkApiCompatibility()
      this.syncStatus.isCompatible = compatibilityResult.compatible
      this.syncStatus.backendVersion = compatibilityResult.backendVersion

      if (!compatibilityResult.compatible) {
        errors.push(
          `API version mismatch: Frontend v${this.syncStatus.frontendVersion}, Backend v${compatibilityResult.backendVersion}`,
        )
      }

      this.syncStatus.lastSync = new Date()
      this.syncStatus.errors = errors

      return this.syncStatus
    } catch (error) {
      errors.push(`Sync check failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      this.syncStatus.errors = errors
      return this.syncStatus
    }
  }

  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus }
  }

  async waitForBackend(maxRetries = 10, retryInterval = 2000): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      const status = await this.checkBackendStatus()
      if (status.isHealthy) {
        return true
      }

      console.log(`Backend not ready, retrying in ${retryInterval}ms... (${i + 1}/${maxRetries})`)
      await new Promise((resolve) => setTimeout(resolve, retryInterval))
    }

    return false
  }

  // Method to sync specific data types
  async syncData(dataType: "families" | "villages" | "chokhlas" | "users" | "all"): Promise<boolean> {
    try {
      const status = await this.checkBackendStatus()
      if (!status.isHealthy) {
        throw new Error("Backend is not healthy")
      }

      // Implementation would depend on your specific sync requirements
      console.log(`Syncing ${dataType} data...`)

      // This is where you'd implement the actual sync logic
      // For example, comparing local cache with backend data

      return true
    } catch (error) {
      console.error(`Failed to sync ${dataType}:`, error)
      return false
    }
  }
}

// Export singleton instance
export const backendSync = BackendSyncManager.getInstance()

// Utility functions for components
export const useBackendSync = () => {
  const checkStatus = () => backendSync.checkBackendStatus()
  const getStatus = () => backendSync.getSyncStatus()
  const waitForBackend = (maxRetries?: number, retryInterval?: number) =>
    backendSync.waitForBackend(maxRetries, retryInterval)
  const syncData = (dataType: Parameters<typeof backendSync.syncData>[0]) => backendSync.syncData(dataType)

  return {
    checkStatus,
    getStatus,
    waitForBackend,
    syncData,
  }
}
