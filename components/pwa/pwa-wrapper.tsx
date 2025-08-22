"use client"

import type React from "react"

import { useEffect } from "react"
import { InstallPrompt } from "./install-prompt"
import { OfflineIndicator } from "./offline-indicator"

export function PWAWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError)
        })
    }

    // Handle app updates
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload()
      })
    }
  }, [])

  return (
    <>
      {children}
      <InstallPrompt />
      <OfflineIndicator />
    </>
  )
}
