import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios"
import { getSession, signIn } from "next-auth/react"

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REQUEST_URL || "http://localhost:3001",
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Client-Version": process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  },
})

request.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.metadata = { startTime: new Date() }

    const publicEndpoints = ["/health", "/api/public"]
    const isPublicEndpoint = publicEndpoints.some((endpoint) => config.url?.includes(endpoint))

    if (!isPublicEndpoint && !config.headers.Authorization) {
      try {
        const session = await getSession()
        if (session?.user?.token) {
          config.headers.Authorization = `Bearer ${session.user.token}`
        }
      } catch (error) {
        console.warn("Failed to get session for request:", error)
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      })
    }

    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response: AxiosResponse) => {
    const duration = new Date().getTime() - response.config.metadata?.startTime?.getTime()

    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
        status: response.status,
        data: response.data,
      })
    }

    return response
  },
  async (error) => {
    if (error.response) {
      if (
        error.request.responseType === "blob" &&
        error.response.data instanceof Blob &&
        error.response.data.type &&
        error.response.data.type.toLowerCase().indexOf("json") !== -1
      ) {
        await new Promise((resolve) => {
          const reader: FileReader = new FileReader()
          reader.onload = () => {
            try {
              error.response.data = JSON.parse((reader?.result || "") as string)
            } catch (parseError) {
              console.error("Failed to parse blob error response:", parseError)
            }
            resolve("")
          }
          reader.onerror = () => {
            resolve("")
          }
          reader.readAsText(error.response.data)
        })
      }

      const { status, data } = error.response

      if (process.env.NODE_ENV === "development") {
        console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status,
          data,
          message: error.message,
        })
      }

      switch (status) {
        case 400:
          console.error("Bad Request:", data)
          break
        case 401:
          console.error("Unauthorized:", data)
          if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
            signIn(process.env.NEXT_PUBLIC_AUTH_AAD_B2C_PROVIDER_ID)
          }
          break
        case 403:
          console.error("Forbidden:", data)
          break
        case 404:
          console.error("Not Found:", data)
          break
        case 422:
          console.error("Validation Error:", data)
          break
        case 429:
          console.error("Rate Limited:", data)
          break
        case 500:
          console.error("Internal Server Error:", data)
          break
        case 502:
          console.error("Bad Gateway:", data)
          break
        case 503:
          console.error("Service Unavailable:", data)
          break
        default:
          console.error("API Error:", data)
          break
      }
    } else if (error.request) {
      console.error("Network Error:", error.message)
    } else {
      console.error("Request Setup Error:", error.message)
    }

    return Promise.reject(error)
  },
)

export default request

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await request.get("/health")
    return response.status === 200
  } catch (error) {
    console.error("Backend health check failed:", error)
    return false
  }
}

export const checkApiCompatibility = async (): Promise<{ compatible: boolean; backendVersion?: string }> => {
  try {
    const response = await request.get("/api/version")
    const backendVersion = response.data.version
    const frontendVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"

    const compatible = backendVersion === frontendVersion

    return { compatible, backendVersion }
  } catch (error) {
    console.error("API compatibility check failed:", error)
    return { compatible: false }
  }
}
