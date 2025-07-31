"use client"

import { useEffect } from "react"

import { useState } from "react"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getApiHealth, getApiVersion, syncWithBackend } from "@/data-hooks/requests/village-family"

export interface BackendStatus {
  isOnline: boolean
  version: string
  lastChecked: Date
  latency: number
  error?: string
}

export const useBackendSync = () => {
  const queryClient = useQueryClient()

  // Health check query
  const {
    data: healthData,
    isLoading: healthLoading,
    error: healthError,
    refetch: checkHealth,
  } = useQuery({
    queryKey: ["backend-health"],
    queryFn: async () => {
      const start = Date.now()
      const health = await getApiHealth()
      const latency = Date.now() - start
      return { ...health, latency }
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Version check query
  const { data: versionData } = useQuery({
    queryKey: ["backend-version"],
    queryFn: getApiVersion,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: syncWithBackend,
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })

  const getStatus = (): BackendStatus => {
    return {
      isOnline: !healthError && !!healthData,
      version: versionData?.version || "unknown",
      lastChecked: new Date(),
      latency: healthData?.latency || 0,
      error: healthError?.message,
    }
  }

  const checkStatus = async () => {
    try {
      await checkHealth()
    } catch (error) {
      console.error("Health check failed:", error)
    }
  }

  const performSync = () => {
    syncMutation.mutate()
  }

  return {
    status: getStatus(),
    isLoading: healthLoading,
    checkStatus,
    performSync,
    isSyncing: syncMutation.isPending,
    syncError: syncMutation.error,
  }
}

// Hook for monitoring connection status
export const useConnectionStatus = () => {
  const { status, isLoading } = useBackendSync()

  return {
    isOnline: status.isOnline,
    isLoading,
    latency: status.latency,
    version: status.version,
    lastChecked: status.lastChecked,
    error: status.error,
  }
}

// Auto-retry hook for failed requests
export const useAutoRetry = (maxRetries = 3, retryDelay = 1000) => {
  const retryRequest = async (requestFn: () => Promise<any>, retries = 0): Promise<any> => {
    try {
      return await requestFn()
    } catch (error) {
      if (retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, retries)))
        return retryRequest(requestFn, retries + 1)
      }
      throw error
    }
  }

  return { retryRequest }
}

// Network status detection
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOnline
}
