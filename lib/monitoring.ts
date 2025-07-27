export const logError = (error: Error, context?: string) => {
  console.error(`[${context || "APP"}] Error:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  })
}

export const logInfo = (message: string, data?: any) => {
  console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : "")
}

export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_REQUEST_URL}/health`)
    return response.ok
  } catch (error) {
    logError(error as Error, "API_HEALTH_CHECK")
    return false
  }
}
