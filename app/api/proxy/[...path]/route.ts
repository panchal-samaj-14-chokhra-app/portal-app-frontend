import { NextRequest, NextResponse } from "next/server"

// BACKEND_URL is a server-only env var — never sent to the browser
const BACKEND = (process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_REQUEST_URL ?? "").replace(/\/$/, "")

async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const segment = path.join("/")
  const search = req.nextUrl.search
  const url = `${BACKEND}/${segment}${search}`

  // Forward all relevant headers, skip host/connection which cause issues
  const headers: Record<string, string> = {}
  const contentType = req.headers.get("content-type")
  if (contentType) headers["content-type"] = contentType
  const apiKey = process.env.MANDIR_API_KEY
  if (apiKey) headers["x-api-key"] = apiKey
  const auth = req.headers.get("authorization")
  if (auth) headers["authorization"] = auth

  const isBodyMethod = req.method !== "GET" && req.method !== "HEAD"

  try {
    const res = await fetch(url, {
      method: req.method,
      headers,
      // Stream body directly — avoids buffering large file uploads in memory
      body: isBodyMethod ? req.body : undefined,
      // @ts-expect-error — Node 18 fetch supports duplex for streaming
      duplex: isBodyMethod ? "half" : undefined,
    })
    const body = await res.text()
    return new NextResponse(body, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") || "application/json" },
    })
  } catch (err) {
    console.error("[proxy] fetch error:", url, String(err))
    return NextResponse.json({ success: false, message: "proxy_error", detail: String(err) }, { status: 502 })
  }
}

export const GET    = proxy
export const POST   = proxy
export const PUT    = proxy
export const DELETE = proxy
export const PATCH  = proxy
