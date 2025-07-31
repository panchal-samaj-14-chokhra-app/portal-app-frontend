#!/usr/bin/env node

import { getApiHealth, getApiVersion } from "../data-hooks/requests/village-family"

interface SyncCheckResult {
  status: "success" | "warning" | "error"
  message: string
  details?: any
}

async function checkBackendHealth(): Promise<SyncCheckResult> {
  try {
    const startTime = Date.now()
    const health = await getApiHealth()
    const latency = Date.now() - startTime

    if (health.status === "ok") {
      return {
        status: "success",
        message: `Backend is healthy (${latency}ms)`,
        details: { latency, health },
      }
    } else {
      return {
        status: "warning",
        message: "Backend is responding but may have issues",
        details: health,
      }
    }
  } catch (error) {
    return {
      status: "error",
      message: `Backend health check failed: ${error.message}`,
      details: error,
    }
  }
}

async function checkBackendVersion(): Promise<SyncCheckResult> {
  try {
    const version = await getApiVersion()
    const frontendVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"

    if (version.version === frontendVersion) {
      return {
        status: "success",
        message: `Version sync OK (${version.version})`,
        details: version,
      }
    } else {
      return {
        status: "warning",
        message: `Version mismatch: Frontend(${frontendVersion}) vs Backend(${version.version})`,
        details: { frontend: frontendVersion, backend: version.version },
      }
    }
  } catch (error) {
    return {
      status: "error",
      message: `Version check failed: ${error.message}`,
      details: error,
    }
  }
}

async function checkEnvironmentVariables(): Promise<SyncCheckResult> {
  const requiredVars = ["NEXT_PUBLIC_REQUEST_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length === 0) {
    return {
      status: "success",
      message: "All required environment variables are set",
      details: { requiredVars },
    }
  } else {
    return {
      status: "error",
      message: `Missing environment variables: ${missingVars.join(", ")}`,
      details: { missing: missingVars, required: requiredVars },
    }
  }
}

async function runSyncCheck() {
  console.log("🔄 Starting Backend Sync Check...\n")

  const checks = [
    { name: "Environment Variables", fn: checkEnvironmentVariables },
    { name: "Backend Health", fn: checkBackendHealth },
    { name: "Version Compatibility", fn: checkBackendVersion },
  ]

  let hasErrors = false
  let hasWarnings = false

  for (const check of checks) {
    try {
      console.log(`⏳ Checking ${check.name}...`)
      const result = await check.fn()

      switch (result.status) {
        case "success":
          console.log(`✅ ${check.name}: ${result.message}`)
          break
        case "warning":
          console.log(`⚠️  ${check.name}: ${result.message}`)
          hasWarnings = true
          break
        case "error":
          console.log(`❌ ${check.name}: ${result.message}`)
          hasErrors = true
          break
      }

      if (result.details && process.env.VERBOSE) {
        console.log(`   Details:`, JSON.stringify(result.details, null, 2))
      }
    } catch (error) {
      console.log(`❌ ${check.name}: Unexpected error - ${error.message}`)
      hasErrors = true
    }

    console.log("")
  }

  // Summary
  console.log("📊 Sync Check Summary:")
  if (hasErrors) {
    console.log("❌ Some critical issues found. Please fix them before proceeding.")
    process.exit(1)
  } else if (hasWarnings) {
    console.log("⚠️  Some warnings found. Review them but you can proceed.")
    process.exit(0)
  } else {
    console.log("✅ All checks passed! Backend sync is ready.")
    process.exit(0)
  }
}

// Run the sync check
if (require.main === module) {
  runSyncCheck().catch((error) => {
    console.error("💥 Sync check failed with unexpected error:", error)
    process.exit(1)
  })
}

export { runSyncCheck, checkBackendHealth, checkBackendVersion, checkEnvironmentVariables }
