export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleServerError = (error: unknown, context = "SERVER") => {
  console.error(`[${context}] Server Error:`, {
    message: error instanceof Error ? error.message : "Unknown error",
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    context,
  })

  // In production, return a generic error
  if (process.env.NODE_ENV === "production") {
    return new AppError("An internal server error occurred", 500)
  }

  return error instanceof Error ? error : new AppError("Unknown error occurred", 500)
}

export const asyncHandler = (fn: Function) => {
  return async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (error) {
      throw handleServerError(error, "ASYNC_HANDLER")
    }
  }
}
