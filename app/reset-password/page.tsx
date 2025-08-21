'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Mail, Key, Lock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/card'
import { Input } from '@/components/ui/input/input'
import { Label } from '@/components/ui/label/label'
import { Alert, AlertDescription } from '@/components/ui/alert/alert'
import { toast } from 'sonner'
import { useForgotPassword, useResetPassword, useVerifyOtp } from '@/data-hooks/mutation-query/useAuthQueryMutation'

export default function ResetPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

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

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    forgotPasswordMutation.mutate(email, {
      onSuccess: () => {
        toast.success(`OTP sent to ${email}`)
        setStep(2)
        setResendCooldown(590)
      },
      onError: (err: any) => {
        setError(
          err?.response?.data?.message || 'Failed to send OTP. Please try again.'
        )
        toast.error(error)
      },
      onSettled: () => {
        setLoading(false)
      },
    })
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    verifyOtpMutation.mutate(
      { email, otp },
      {
        onSuccess: () => {
          toast.success('OTP verified successfully')
          setStep(3)
        },
        onError: (err: any) => {
          setError(
            err?.response?.data?.message || 'Invalid or expired OTP, try again.'
          )
          toast.error(error)
        },
        onSettled: () => {
          setLoading(false)
        },
      }
    )
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    resetPasswordMutation.mutate(
      { email, newPassword },
      {
        onSuccess: () => {
          toast.success('Password reset successful! Redirecting to login...')
          // redirect handled inside useResetPassword hook
        },
        onError: (err: any) => {
          setError(
            err?.response?.data?.message ||
            'Failed to reset password. Please try again.'
          )
          toast.error(error)
          setLoading(false)
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={60}
                height={60}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  पासवर्ड रीसेट
                </h1>
                <p className="text-orange-100 text-sm md:text-lg">
                  पंचाल समाज 14 चोखरा
                </p>
              </div>
            </div>
            <Link href="/login">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस जाएं
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card
            className={`bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl`}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-orange-700">
                {step === 1 && 'पासवर्ड रीसेट करें'}
                {step === 2 && 'OTP सत्यापित करें'}
                {step === 3 && 'नया पासवर्ड सेट करें'}
              </CardTitle>
              <CardDescription>
                {step === 1 &&
                  'अपना ईमेल पता दर्ज करें और हम आपको पासवर्ड रीसेट करने के लिए एक OTP भेजेंगे।'}
                {step === 2 && (
                  <>
                    हमने <strong>{email}</strong> पर OTP भेजा है। OTP 10 मिनट तक मान्य है।
                  </>
                )}
                {step === 3 &&
                  'कृपया अपना नया पासवर्ड सेट करें। पासवर्ड और पुष्टि पासवर्ड दोनों मेल खाने चाहिए।'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Show error alert if error */}
              {error && (
                <Alert className="border-red-200 bg-red-50 mb-4">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {/* Step 1: Enter Email */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-orange-700 font-medium">
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
                        className="border-orange-200 focus:border-orange-400 pl-10"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    {loading ? 'भेजा जा रहा है...' : 'OTP भेजें'}
                  </Button>
                </form>
              )}

              {/* Step 2: Verify OTP */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <Label htmlFor="otp" className="text-orange-700 font-medium">
                      OTP *
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="OTP दर्ज करें"
                        className="border-orange-200 focus:border-orange-400 pl-10"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      type="submit"
                      disabled={loading || !otp}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    >
                      {loading ? 'सत्यापित हो रहा है...' : 'OTP सत्यापित करें'}
                    </Button>

                    <Button
                      type="button"
                      disabled={resendCooldown > 0}
                      variant="outline"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={handleSendOtp}
                    >
                      {resendCooldown > 0 ? `दोबारा भेजें (${resendCooldown}s)` : 'OTP दोबारा भेजें'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 3: Reset Password */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <Label htmlFor="newPassword" className="text-orange-700 font-medium">
                      नया पासवर्ड *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="नया पासवर्ड दर्ज करें"
                        className="border-orange-200 focus:border-orange-400 pl-10"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className="text-orange-700 font-medium"
                    >
                      पासवर्ड पुष्टि करें *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="पासवर्ड फिर से दर्ज करें"
                        className="border-orange-200 focus:border-orange-400 pl-10"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !newPassword || !confirmPassword}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    {loading ? 'रीसेट हो रहा है...' : 'पासवर्ड रीसेट करें'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-orange-100">
            © 2025 पंचाल समाज 14 चोखरा डिजिटल जनगणना। सभी अधिकार सुरक्षित।
          </p>
        </div>
      </footer>
    </div>
  )
}
