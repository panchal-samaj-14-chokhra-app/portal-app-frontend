"use client"

import { useEffect, useState } from "react"
import { getSession, signIn, signOut } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { homeFor, safeCallbackPath } from "@/lib/auth/client"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, Loader2, ShieldCheck, ArrowLeft } from "lucide-react"

const SIGN_IN_ERRORS: Record<string, string> = {
  InvalidCredentials: "गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।",
  CredentialsSignin: "गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।",
  AccountDisabled: "आपका खाता निष्क्रिय है। कृपया प्रशासक से संपर्क करें।",
  TooManyAttempts: "बहुत अधिक गलत प्रयास हुए। कृपया कुछ देर बाद पुनः प्रयास करें।",
  ServerUnavailable: "सर्वर से संपर्क नहीं हो पा रहा। कृपया कुछ देर बाद पुनः प्रयास करें।",
}
const GENERIC_ERROR = "लॉगिन में समस्या हुई। कृपया पुनः प्रयास करें।"

export default function LoginForm({ hasStoredLogin = false }: { hasStoredLogin?: boolean }) {
  const [formData, setFormData] = useState({ email: "", password: "", showPassword: false })
  const params = useSearchParams()
  const reason = params.get("reason")
  const urlError = params.get("error")
  const [error, setError] = useState(urlError ? SIGN_IN_ERRORS[urlError] || GENERIC_ERROR : "")
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const [checking, setChecking] = useState(hasStoredLogin)
  const router = useRouter()

  const goHome = (user: any) => {
    const target = safeCallbackPath(params.get("callbackUrl")) || homeFor(user)
    if (!target) return false
    router.replace(target)
    router.refresh()
    return true
  }

  useEffect(() => {
    if (!hasStoredLogin) return
    let cancelled = false;
    (async () => {
      const session: any = await getSession().catch(() => null)
      if (cancelled) return
      if (session && !session.error && session.user?.token && goHome(session.user)) return
      await signOut({ redirect: false }).catch(() => null)
      if (!cancelled) setChecking(false)
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStoredLogin])

  const notice =
    reason === "expired" ? "आपका सत्र समाप्त हो गया है। कृपया फिर से लॉगिन करें।" :
    reason === "disabled" ? "आपका खाता निष्क्रिय कर दिया गया है। कृपया प्रशासक से संपर्क करें।" : ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await signIn("credentials", {
      email: formData.email.trim(),
      password: formData.password,
      redirect: false,
    })
    if (result?.error) {
      setError(SIGN_IN_ERRORS[result.error] || GENERIC_ERROR)
      setLoading(false)
      return
    }
    const session: any = await getSession()
    if (!goHome(session?.user)) {
      setError("इस खाते के लिए कोई पोर्टल पेज उपलब्ध नहीं है। कृपया प्रशासक से संपर्क करें।")
      await signOut({ redirect: false })
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg,#fff7ed 0%,#fffbf5 50%,#fef3c7 100%)" }}>
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto" />
          <p className="text-orange-700 text-sm font-medium">सत्र जाँचा जा रहा है...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg,#fff7ed 0%,#fffbf5 50%,#fef3c7 100%)", fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>
      {/* Top nav bar */}
      <div className="h-1.5" style={{ background: "repeating-linear-gradient(90deg,#fbbf24 0,#fbbf24 8px,#c2410c 8px,#c2410c 16px)" }} />
      <header style={{ background: "linear-gradient(90deg,#7c2d12,#9a3412,#c2410c)" }} className="shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <Image src="/images/main-logo.png" alt="लोगो" width={36} height={36}
              className="w-9 h-9 rounded-full border-2 border-white/40 shadow-sm" />
            <div>
              <div className="font-bold text-white text-sm">पंचाल समाज चौदह चौखरा</div>
              <div className="text-orange-200 text-[11px]">कार्यकारिणी पोर्टल</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden">
            {/* Card header */}
            <div className="px-7 pt-8 pb-6 text-center border-b border-orange-50"
              style={{ background: "linear-gradient(135deg,#fff7ed,#fffbf5)" }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md"
                style={{ background: "linear-gradient(135deg,#c2410c,#ea580c)" }}>
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-xl font-extrabold text-gray-900 mb-1">कार्यकारिणी लॉगिन</h1>
              <p className="text-gray-400 text-xs">जनगणना प्रबंधन प्रणाली में प्रवेश करें</p>
            </div>

            {/* Form */}
            <div className="px-7 py-6">
              {notice && !error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
                  {notice}
                </div>
              )}
              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} method="post" className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    ईमेल पता
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="email" type="email" required
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      placeholder="ईमेल दर्ज करें"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    पासवर्ड
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="password" type={formData.showPassword ? "text" : "password"} required
                      value={formData.password}
                      onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                      placeholder="पासवर्ड दर्ज करें"
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                    />
                    <button type="button"
                      onClick={() => setFormData(p => ({ ...p, showPassword: !p.showPassword }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      {formData.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit"
                  disabled={!ready || loading || !formData.email || !formData.password}
                  className="w-full py-3 rounded-xl text-white text-sm font-bold shadow-lg shadow-orange-200 transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
                  style={{ background: "linear-gradient(135deg,#c2410c 0%,#ea580c 60%,#f97316 100%)" }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />लॉगिन हो रहा है...
                    </span>
                  ) : "लॉगिन करें →"}
                </button>
              </form>

              {/* Footer links */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <Link href="/reset-password" className="text-orange-600 hover:text-orange-800 font-medium hover:underline">
                  पासवर्ड भूल गए?
                </Link>
                <Link href="/help" className="text-gray-400 hover:text-gray-600 font-medium hover:underline">
                  सहायता
                </Link>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-5 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />सिस्टम ऑनलाइन
            </span>
            <span className="text-gray-200">|</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />सुरक्षित लॉगिन
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
