"use client"

import type React from "react"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("Attempting to sign in...")

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      console.log("Sign in result:", result)

      if (result?.error) {
        setError("Invalid credentials. Please try again.")
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        console.log("Sign in successful, getting session...")

        // Get the session to determine redirect
        const session = await getSession()
        console.log("Session after login:", session)

        if (session?.user) {
          const { role, villageId, choklaId } = session.user as any

          // Manual redirect based on role
          if (role === "SUPER_ADMIN") {
            console.log("Redirecting to super admin...")
            router.push("/admin/superadmin")
          } else if (role === "VILLAGE_MEMBER" && villageId) {
            console.log("Redirecting to village admin...")
            router.push(`/admin/village/${villageId}`)
          } else if (role === "CHOKHLA_MEMBER" && choklaId) {
            console.log("Redirecting to chokhla admin...")
            router.push(`/admin/chokhla/${choklaId}`)
          } else {
            console.log("No valid role found, redirecting to login...")
            router.push("/login")
          }
        } else {
          console.log("No session found after login")
          setError("Login successful but session not found. Please try again.")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          ईमेल पता
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          पासवर्ड
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            साइन इन हो रहा है...
          </>
        ) : (
          "साइन इन करें"
        )}
      </Button>

      <div className="text-center">
        <a href="/reset-password" className="text-sm text-orange-600 hover:text-orange-700 underline">
          पासवर्ड भूल गए?
        </a>
      </div>
    </form>
  )
}
