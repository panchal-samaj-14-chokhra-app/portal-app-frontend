"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

declare global {
  interface Window {
    L: any
  }
}

const LEAFLET_VERSION = "1.9.4"
const CDN = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist`
// Center of India
const INDIA_CENTER: [number, number] = [22.9734, 78.6569]

function loadLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"))
    if (window.L) return resolve(window.L)
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link")
      link.id = "leaflet-css"
      link.rel = "stylesheet"
      link.href = `${CDN}/leaflet.css`
      document.head.appendChild(link)
    }
    let s = document.getElementById("leaflet-js") as HTMLScriptElement | null
    if (!s) {
      s = document.createElement("script")
      s.id = "leaflet-js"
      s.src = `${CDN}/leaflet.js`
      s.async = true
      document.body.appendChild(s)
    }
    if (window.L) return resolve(window.L)
    s.addEventListener("load", () => resolve(window.L))
    s.addEventListener("error", () => reject(new Error("leaflet load failed")))
  })
}

interface MapLoc {
  name: string
  lat: number
  lng: number
  chokhla?: string
  village?: string
}

export default function VillageMap({
  locations,
  loading,
  pinColor = "#dc2626",
  pinStroke = "#7f1d1d",
}: {
  locations: MapLoc[]
  loading?: boolean
  pinColor?: string
  pinStroke?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const layerRef = useRef<any>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  // Initialise the map once
  useEffect(() => {
    let cancelled = false
    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current || mapRef.current) return
        const map = L.map(containerRef.current).setView(INDIA_CENTER, 5)
        // Google Maps tiles (lyrs=m → roadmap). Shows India's map correctly, no API key needed.
        L.tileLayer(`https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}`, {
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
          attribution: "&copy; Google",
          maxZoom: 20,
        }).addTo(map)
        layerRef.current = L.layerGroup().addTo(map)
        mapRef.current = map
        setReady(true)
        setTimeout(() => map.invalidateSize(), 150)
      })
      .catch(() => setFailed(true))
    return () => {
      cancelled = true
    }
  }, [])

  // Update markers whenever the (scoped) locations change
  useEffect(() => {
    if (!ready || !mapRef.current || !window.L) return
    const L = window.L
    const layer = layerRef.current
    layer.clearLayers()
    // Teardrop pin (inline SVG, no external image needed)
    const pinIcon = L.divIcon({
      className: "",
      html: `<svg width="26" height="36" viewBox="0 0 26 36" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 23 13 23s13-13.25 13-23C26 5.82 20.18 0 13 0z" fill="${pinColor}" stroke="${pinStroke}" stroke-width="1"/>
        <circle cx="13" cy="13" r="4.8" fill="#ffffff"/>
      </svg>`,
      iconSize: [26, 36],
      iconAnchor: [13, 36],
      popupAnchor: [0, -32],
    })
    const pts: [number, number][] = []
    ;(locations || []).forEach((loc) => {
      if (loc.lat == null || loc.lng == null) return
      const sub = loc.village ? `गांव: ${loc.village}` : loc.chokhla ? `चोखरा: ${loc.chokhla}` : ""
      const popup = `<b>${loc.name || "—"}</b>${sub ? `<br/>${sub}` : ""}<br/>${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`
      const marker = L.marker([loc.lat, loc.lng], { icon: pinIcon }).bindPopup(popup)
      layer.addLayer(marker)
      pts.push([loc.lat, loc.lng])
    })
    if (pts.length === 1) {
      mapRef.current.setView(pts[0], 12)
    } else if (pts.length > 1) {
      mapRef.current.fitBounds(pts, { padding: [30, 30], maxZoom: 12 })
    } else {
      mapRef.current.setView(INDIA_CENTER, 5)
    }
    setTimeout(() => mapRef.current && mapRef.current.invalidateSize(), 150)
  }, [locations, ready])

  if (failed) {
    return (
      <div className="w-full h-[300px] rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 text-sm">
        मानचित्र लोड नहीं हो सका (इंटरनेट कनेक्शन जांचें)।
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-[680px] rounded-lg border border-gray-200 z-0" />
      {(loading || !ready) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg z-[1000]">
          <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
        </div>
      )}
    </div>
  )
}
