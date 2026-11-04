"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Loader2, MapPin, RotateCcw, Aperture, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { uploadBlogImage } from "@/data-hooks/requests/blog"

export type GeoPhoto = { url: string; lat: number | null; lng: number | null }

// Best-effort geolocation: the site may be served over plain http (not https/localhost), where
// browsers refuse navigator.geolocation outright — so a denial/timeout still lets the photo through,
// just without coordinates, instead of blocking the whole duty check-in.
function getLocation(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 6000 }
    )
  })
}

export default function GeoPhotoCapture({
  value,
  onChange,
}: {
  value: GeoPhoto | null
  onChange: (v: GeoPhoto | null) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  const openCamera = async () => {
    setCameraError(null)
    setCameraOpen(true)
    try {
      // live camera stream only — no file picker, so there is no gallery/file-system fallback
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch {
      setCameraError(
        "कैमरा खोला नहीं जा सका। यह पेज HTTPS पर नहीं है या कैमरा अनुमति अस्वीकृत है — ब्राउज़र कैमरा एक्सेस के लिए सुरक्षित (https) कनेक्शन चाहता है।"
      )
    }
  }

  const closeCamera = () => {
    stopStream()
    setCameraOpen(false)
    setCameraError(null)
  }

  useEffect(() => () => stopStream(), [])

  // Compress canvas to JPEG under maxBytes by iteratively lowering quality.
  const compressCanvas = (canvas: HTMLCanvasElement, maxBytes = 200_000): Promise<Blob> =>
    new Promise((resolve, reject) => {
      // Scale down if wider than 1200px to reduce baseline size
      const MAX_W = 1200
      let c = canvas
      if (canvas.width > MAX_W) {
        const scale = MAX_W / canvas.width
        c = document.createElement("canvas")
        c.width = MAX_W
        c.height = Math.round(canvas.height * scale)
        c.getContext("2d")!.drawImage(canvas, 0, 0, c.width, c.height)
      }

      const tryQuality = (q: number) => {
        c.toBlob((blob) => {
          if (!blob) return reject(new Error("compress failed"))
          if (blob.size <= maxBytes || q <= 0.3) return resolve(blob)
          tryQuality(Math.max(q - 0.1, 0.3))
        }, "image/jpeg", q)
      }
      tryQuality(0.8)
    })

  const capture = async () => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    stopStream()
    setCameraOpen(false)
    setBusy(true)
    try {
      const blob = await compressCanvas(canvas, 200_000)
      const file = new File([blob], `checkin-${Date.now()}.jpg`, { type: "image/jpeg" })
      const [url, loc] = await Promise.all([uploadBlogImage(file), getLocation()])
      onChange({ url, lat: loc?.lat ?? null, lng: loc?.lng ?? null })
    } catch {
      // upload failed silently; caller's save validation will catch a missing photo
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      {value?.url ? (
        <div className="flex items-center gap-3">
          <img src={value.url} alt="चेक-इन फोटो" className="h-16 w-16 rounded-md object-cover border" />
          <div className="text-xs text-gray-500">
            {value.lat != null && value.lng != null ? (
              <span className="inline-flex items-center gap-1 text-green-600">
                <MapPin className="w-3.5 h-3.5" />
                {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
              </span>
            ) : (
              <span className="text-gray-400">स्थान उपलब्ध नहीं</span>
            )}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={openCamera} disabled={busy}>
            <RotateCcw className="w-4 h-4 mr-1" />
            फिर से लें
          </Button>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={openCamera} disabled={busy}>
          {busy ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Camera className="w-4 h-4 mr-1" />}
          फोटो लें (Geo-Tagged)
        </Button>
      )}

      <Dialog open={cameraOpen} onOpenChange={(o) => !o && closeCamera()}>
        <DialogContent className="max-w-sm p-4">
          <DialogHeader>
            <DialogTitle className="text-base">कैमरा से फोटो लें</DialogTitle>
          </DialogHeader>

          {cameraError ? (
            <div className="space-y-3">
              <p className="text-sm text-red-500">{cameraError}</p>
              <Button variant="outline" size="sm" onClick={closeCamera} className="w-full">
                <X className="w-4 h-4 mr-1" />
                बंद करें
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <video ref={videoRef} playsInline muted className="w-full rounded-md bg-black aspect-[3/4] object-cover" />
              <div className="flex gap-2">
                <Button variant="outline" onClick={closeCamera} className="flex-1">
                  <X className="w-4 h-4 mr-1" />
                  रद्द करें
                </Button>
                <Button onClick={capture} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600">
                  <Aperture className="w-4 h-4 mr-1" />
                  कैप्चर करें
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
