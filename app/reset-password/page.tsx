"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mail, Key, Shield, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, Loader2, Clock } from "lucide-react"
import Link from "next/link"

type Step = "email" | "otp" | "password" | "success"

interface PasswordRequirement {
  text: string
  met: boolean
}

export default function ResetPasswordPage() {
  const [currentStep, setCurrentStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [otpTimer, setOtpTimer] = useState(0)

  // Password strength calculation
  const getPasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    return strength
  }

  const passwordStrength = getPasswordStrength(newPassword)
  const getStrengthColor = (strength: number): string => {
    if (strength < 25) return "bg-red-500"
    if (strength < 50) return "bg-orange-500"
    if (strength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = (strength: number): string => {
    if (strength < 25) return "कमजोर"
    if (strength < 50) return "मध्यम"
    if (strength < 75) return "अच्छा"
    return "मजबूत"
  }

  // Password requirements
  const passwordRequirements: PasswordRequirement[] = [
    { text: "कम से कम 8 अक्षर", met: newPassword.length >= 8 },
    { text: "एक बड़ा अक्षर (A-Z)", met: /[A-Z]/.test(newPassword) },
    { text: "एक छोटा अक्षर (a-z)", met: /[a-z]/.test(newPassword) },
    { text: "एक संख्या (0-9)", met: /[0-9]/.test(newPassword) },
  ]

  const getStepProgress = (): number => {
    switch (currentStep) {
      case "email":
        return 33
      case "otp":
        return 66
      case "password":
        return 100
      case "success":
        return 100
      default:
        return 0
    }
  }

  const getStepIcon = (step: Step, isActive: boolean, isCompleted: boolean) => {
    const iconClass = `w-5 h-5 ${isCompleted ? "text-green-600" : isActive ? "text-orange-600" : "text-gray-400"}`

    if (isCompleted) {
      return <CheckCircle className={iconClass} />
    }

    switch (step) {
      case "email":
        return <Mail className={iconClass} />
      case "otp":
        return <Key className={iconClass} />
      case "password":
        return <Shield className={iconClass} />
      default:
        return <Mail className={iconClass} />
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setCurrentStep("otp")
      setOtpTimer(300) // 5 minutes

      // Start countdown
      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      setError("ईमेल भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (otp === "123456") {
        setCurrentStep("password")
      } else {
        setError("गलत OTP। कृपया सही कोड दर्ज करें।")
      }
    } catch (error) {
      setError("OTP सत्यापन में त्रुटि हुई। कृपया पुनः प्रयास करें।")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (newPassword !== confirmPassword) {
      setError("पासवर्ड मेल नहीं खाते। कृपया दोबारा जांचें।")
      setIsLoading(false)
      return
    }

    if (passwordStrength < 75) {
      setError("कृपया एक मजबूत पासवर्ड चुनें।")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setCurrentStep("success")
    } catch (error) {
      setError("पासवर्ड रीसेट में त्रुटि हुई। कृपया पुनः प्रयास करें।")
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f97316' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Key className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">पासवर्ड रीसेट करें</h1>
            <p className="text-gray-600">अपना नया पासवर्ड सेट करने के लिए निम्नलिखित चरणों का पालन करें</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                {getStepIcon("email", currentStep === "email", ["otp", "password", "success"].includes(currentStep))}
                <span className="text-sm font-medium text-gray-700">ईमेल</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStepIcon("otp", currentStep === "otp", ["password", "success"].includes(currentStep))}
                <span className="text-sm font-medium text-gray-700">OTP</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStepIcon("password", currentStep === "password", currentStep === "success")}
                <span className="text-sm font-medium text-gray-700">पासवर्ड</span>
              </div>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
            <div className="text-center mt-2">
              <span className="text-sm text-gray-500">{getStepProgress()}% पूर्ण</span>
            </div>
          </div>

          {/* Main Card */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border border-white/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">
                {currentStep === "email" && "ईमेल पता दर्ज करें"}
                {currentStep === "otp" && "OTP कोड दर्ज करें"}
                {currentStep === "password" && "नया पासवर्ड सेट करें"}
                {currentStep === "success" && "सफलतापूर्वक रीसेट!"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Step 1: Email */}
              {currentStep === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      ईमेल पता
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="आपका पंजीकृत ईमेल पता"
                        className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-gray-500">हम आपके ईमेल पर एक OTP कोड भेजेंगे</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>भेजा जा रहा है...</span>
                      </div>
                    ) : (
                      "OTP भेजें"
                    )}
                  </Button>
                </form>
              )}

              {/* Step 2: OTP */}
              {currentStep === "otp" && (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                      OTP कोड
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="6 अंकों का कोड"
                        className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-center text-lg tracking-widest"
                        required
                        disabled={isLoading}
                        maxLength={6}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">कोड {email} पर भेजा गया</span>
                      {otpTimer > 0 && (
                        <div className="flex items-center space-x-1 text-orange-600">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(otpTimer)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-12 bg-transparent"
                      onClick={() => setCurrentStep("email")}
                      disabled={isLoading}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      वापस
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>सत्यापित कर रहे हैं...</span>
                        </div>
                      ) : (
                        "सत्यापित करें"
                      )}
                    </Button>
                  </div>

                  {/* Test OTP Helper */}
                  {process.env.NODE_ENV === "development" && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-600">
                        <strong>टेस्ट OTP:</strong> 123456
                      </p>
                    </div>
                  )}
                </form>
              )}

              {/* Step 3: New Password */}
              {currentStep === "password" && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                      नया पासवर्ड
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="नया पासवर्ड दर्ज करें"
                        className="pl-10 pr-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {newPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">पासवर्ड की मजबूती:</span>
                          <span
                            className={`text-xs font-medium ${
                              passwordStrength < 50
                                ? "text-red-600"
                                : passwordStrength < 75
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }`}
                          >
                            {getStrengthText(passwordStrength)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Password Requirements */}
                    {newPassword && (
                      <div className="space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                req.met ? "bg-green-100" : "bg-gray-100"
                              }`}
                            >
                              {req.met ? (
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              )}
                            </div>
                            <span className={`text-xs ${req.met ? "text-green-600" : "text-gray-500"}`}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      पासवर्ड की पुष्टि करें
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="पासवर्ड दोबारा दर्ज करें"
                        className="pl-10 pr-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-600">पासवर्ड मेल नहीं खाते</p>
                    )}
                    {confirmPassword && newPassword === confirmPassword && (
                      <p className="text-xs text-green-600">पासवर्ड मैच हो गए</p>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-12 bg-transparent"
                      onClick={() => setCurrentStep("otp")}
                      disabled={isLoading}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      वापस
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl"
                      disabled={isLoading || passwordStrength < 75 || newPassword !== confirmPassword}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>सेव कर रहे हैं...</span>
                        </div>
                      ) : (
                        "पासवर्ड सेट करें"
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 4: Success */}
              {currentStep === "success" && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">पासवर्ड सफलतापूर्वक रीसेट हो गया!</h3>
                    <p className="text-gray-600">आपका नया पासवर्ड सेट हो गया है। अब आप अपने नए पासवर्ड से लॉगिन कर सकते हैं।</p>
                  </div>
                  <Link href="/login">
                    <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl">
                      लॉगिन पेज पर जाएं
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Back to Login */}
          {currentStep !== "success" && (
            <div className="text-center mt-6">
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 text-sm text-orange-600 hover:text-orange-700 hover:underline transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>लॉगिन पेज पर वापस जाएं</span>
              </Link>
            </div>
          )}

          {/* Help Link */}
          <div className="text-center mt-4">
            <a href="/help" className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors">
              सहायता चाहिए? सहायता केंद्र पर जाएं
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
