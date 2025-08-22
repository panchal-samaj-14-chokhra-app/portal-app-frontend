// PWA utility functions

export const isPWA = (): boolean => {
  if (typeof window === "undefined") return false

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes("android-app://")
  )
}

export const isInstallable = (): boolean => {
  if (typeof window === "undefined") return false

  return "serviceWorker" in navigator && "PushManager" in window
}

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!("Notification" in window)) {
    return "denied"
  }

  if (Notification.permission === "granted") {
    return "granted"
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission
  }

  return Notification.permission
}

export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      ...options,
    })
  }
}

export const registerForPushNotifications = async (): Promise<PushSubscription | null> => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })

    return subscription
  } catch (error) {
    console.error("Push subscription failed:", error)
    return null
  }
}

export const unregisterPushNotifications = async (): Promise<boolean> => {
  if (!("serviceWorker" in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      await subscription.unsubscribe()
      return true
    }

    return false
  } catch (error) {
    console.error("Push unsubscription failed:", error)
    return false
  }
}

export const checkForUpdates = async (): Promise<boolean> => {
  if (!("serviceWorker" in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    await registration.update()
    return true
  } catch (error) {
    console.error("Update check failed:", error)
    return false
  }
}

export const clearAppCache = async (): Promise<void> => {
  if ("caches" in window) {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
  }
}

export const getStorageUsage = async (): Promise<{ used: number; quota: number } | null> => {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
      }
    } catch (error) {
      console.error("Storage estimate failed:", error)
    }
  }
  return null
}
