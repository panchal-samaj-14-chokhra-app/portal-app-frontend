"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Mail, Key, Lock, CheckCircle, Eye, EyeOff, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { useForgotPassword, useResetPassword, useVerifyOtp } from "@/data-hooks/mutation-query/useAuthQueryMutation"

export default function ResetPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const forgotPasswordMutation = useForgotPassword()
  const verifyOtpMutation = useVerifyOtp()
  const resetPasswordMutation = useResetPassword()

  // Handle resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendCooldown])

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    return strength
  }

  const passwordStrength = getPasswordStrength(newPassword)

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    forgotPasswordMutation.mutate(email, {
      onSuccess: () => {
        toast.success(`OTP sent to ${email}`)
        setStep(2)
        setResendCooldown(590)
      },
      onError: (err: any) => {
        const errorMessage = err?.response?.data?.message || "Failed to send OTP. Please try again."
        setError(errorMessage)
        toast.error(errorMessage)
      },
      onSettled: () => {
        setLoading(false)
      },
    })
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    verifyOtpMutation.mutate(
      { email, otp },
      {
        onSuccess: () => {
          toast.success("OTP verified successfully")
          setStep(3)
        },
        onError: (err: any) => {
          const errorMessage = err?.response?.data?.message || "Invalid or expired OTP, try again."
          setError(errorMessage)
          toast.error(errorMessage)
        },
        onSettled: () => {
          setLoading(false)
        },
      },
    )
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword !== confirmPassword) {
      const errorMessage = "Passwords do not match"
      setError(errorMessage)
      toast.error(errorMessage)
      return
    }
    if (newPassword.length < 6) {
      const errorMessage = "Password must be at least 6 characters"
      setError(errorMessage)
      toast.error(errorMessage)
      return
    }

    setLoading(true)
    resetPasswordMutation.mutate(
      { email, newPassword },
      {
        onSuccess: () => {
          toast.success("Password reset successful! Redirecting to login...")
          // redirect handled inside useResetPassword hook
        },
        onError: (err: any) => {
          const errorMessage = err?.response?.data?.message || "Failed to reset password. Please try again."
          setError(errorMessage)
          toast.error(errorMessage)
          setLoading(false)
        },
      },
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={50}
                height={50}
                className="rounded-full shadow-lg sm:w-[60px] sm:h-[60px]"
              />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">पासवर्ड रीसेट</h1>
                <p className="text-orange-100 text-xs sm:text-sm md:text-lg">पंचाल समाज 14 चोखरा</p>
              </div>
            </div>
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">वापस जाएं</span>
                <span className="sm:hidden">वापस</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600">Step {step} of 3</span>
            <span className="text-xs sm:text-sm text-gray-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className={step >= 1 ? "text-orange-600 font-medium" : ""}>Email</span>
            <span className={step >= 2 ? "text-orange-600 font-medium" : ""}>OTP</span>
            <span className={step >= 3 ? "text-orange-600 font-medium" : ""}>Password</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl">
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                {step === 1 && <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />}
                {step === 2 && <Key className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />}
                {step === 3 && <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />}
              </div>
              <CardTitle className="text-xl sm:text-2xl text-orange-700">
                {step === 1 && "पासवर्ड रीसेट करें"}
                {step === 2 && "OTP सत्यापित करें"}
                {step === 3 && "नया पासवर्ड सेट करें"}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base px-2">
                {step === 1 && "अपना ईमेल पता दर्ज करें और हम आपको पासवर्ड रीसेट करने के लिए एक OTP भेजेंगे।"}
                {step === 2 && (
                  <div className="space-y-2">
                    <p>
                      हमने <strong className="text-orange-700">{email}</strong> पर OTP भेजा है।
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>OTP 10 मिनट तक मान्य है</span>
                    </div>
                  </div>
                )}
                {step === 3 && "कृपया अपना नया पासवर्ड सेट करें। पासवर्ड मजबूत और सुरक्षित होना चाहिए।"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Show error alert if error */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Step 1: Enter Email */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-orange-700 font-medium text-sm">
                      ईमेल पता *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="अपना ईमेल पता दर्ज करें"
                        className="border-orange-200 focus:border-orange-400 pl-10 h-11 text-base"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-11 text-base font-medium"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>भेजा जा रहा है...</span>
                      </div>
                    ) : (
                      "OTP भेजें"
                    )}
                  </Button>
                </form>
              )}

              {/* Step 2: Verify OTP */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-orange-700 font-medium text-sm">
                      OTP *
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="6-अंकीय OTP दर्ज करें"
                        className="border-orange-200 focus:border-orange-400 pl-10 h-11 text-base text-center tracking-widest"
                        required
                        disabled={loading}
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-11 text-base font-medium"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>सत्यापित हो रहा है...</span>
                        </div>
                      ) : (
                        "OTP सत्यापित करें"
                      )}
                    </Button>

                    <Button
                      type="button"
                      disabled={resendCooldown > 0 || loading}
                      variant="outline"
                      className="flex-1 sm:flex-none border-orange-200 text-orange-600 hover:bg-orange-50 h-11 text-sm"
                      onClick={() => handleSendOtp(new Event("submit") as any)}
                    >
                      {resendCooldown > 0 ? (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(resendCooldown)}</span>
                        </div>
                      ) : (
                        "दोबारा भेजें"
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 3: Reset Password */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-orange-700 font-medium text-sm">
                      नया पासवर्ड *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="नया पासवर्ड दर्ज करें"
                        className="border-orange-200 focus:border-orange-400 pl-10 pr-10 h-11 text-base"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {newPassword && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Password Strength</span>
                          <span
                            className={`font-medium ${
                              passwordStrength < 50
                                ? "text-red-600"
                                : passwordStrength < 75
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }`}
                          >
                            {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Medium" : "Strong"}
                          </span>
                        </div>
                        <Progress
                          value={passwordStrength}
                          className={`h-2 ${
                            passwordStrength < 50
                              ? "[&>div]:bg-red-500"
                              : passwordStrength < 75
                                ? "[&>div]:bg-yellow-500"
                                : "[&>div]:bg-green-500"
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-orange-700 font-medium text-sm">
                      पासवर्ड पुष्टि करें *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="पासवर्ड फिर से दर्ज करें"
                        className="border-orange-200 focus:border-orange-400 pl-10 pr-10 h-11 text-base"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-600">Passwords do not match</p>
                    )}
                    {confirmPassword && newPassword === confirmPassword && (
                      <div className="flex items-center space-x-1 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>Passwords match</span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-11 text-base font-medium"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>रीसेट हो रहा है...</span>
                      </div>
                    ) : (
                      "पासवर्ड रीसेट करें"
                    )}
                  </Button>
                </form>
              )}

              {/* Help Text */}
              <div className="text-center pt-4 border-t border-orange-100">
                <p className="text-xs text-gray-600">
                  समस्या हो रही है?{" "}
                  <Link href="/help" className="text-orange-600 hover:text-orange-700 font-medium">
                    सहायता केंद्र
                  </Link>{" "}
                  पर जाएं
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-orange-100 text-xs sm:text-sm">
            © 2025 पंचाल समाज 14 चोखरा डिजिटल जनगणना। सभी अधिकार सुरक्षित।
          </p>
        </div>
      </footer>
    </div>
  )
}
