"use client";

import { useEffect, useState } from "react";
import { getSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { homeFor, safeCallbackPath } from "@/lib/auth/client";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Alert, AlertDescription } from "@/components/ui/alert/alert";

// What the person sees for each reason the login did not (or could not) work
const SIGN_IN_ERRORS: Record<string, string> = {
  InvalidCredentials: "गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।",
  CredentialsSignin: "गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।",
  AccountDisabled: "आपका खाता निष्क्रिय है। कृपया प्रशासक से संपर्क करें।",
  TooManyAttempts: "बहुत अधिक गलत प्रयास हुए। कृपया कुछ देर बाद पुनः प्रयास करें।",
  ServerUnavailable: "सर्वर से संपर्क नहीं हो पा रहा। कृपया कुछ देर बाद पुनः प्रयास करें।",
};
const GENERIC_ERROR = "लॉगिन में समस्या हुई। कृपया पुनः प्रयास करें।";

export default function LoginForm({ hasStoredLogin = false }: { hasStoredLogin?: boolean }) {
  const [formData, setFormData] = useState({ email: "", password: "", showPassword: false });
  const params = useSearchParams();
  const reason = params.get("reason");
  const urlError = params.get("error");
  const [error, setError] = useState(
    urlError ? SIGN_IN_ERRORS[urlError] || GENERIC_ERROR : ""
  );
  const [loading, setLoading] = useState(false);
  // The form only works once the page is interactive. Before that a click would be a plain browser form
  // submit, which could put the e-mail and password into the address bar.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  // while an existing login is being checked/renewed, don't flash the form
  const [checking, setChecking] = useState(hasStoredLogin);
  const router = useRouter();

  const goHome = (user: any) => {
    const target = safeCallbackPath(params.get("callbackUrl")) || homeFor(user);
    if (!target) return false;
    router.replace(target);
    router.refresh();
    return true;
  };

  // A login cookie is present: if it still works (or can be renewed) continue straight into the portal,
  // otherwise clear it so the user can sign in again.
  useEffect(() => {
    if (!hasStoredLogin) return;
    let cancelled = false;
    (async () => {
      const session: any = await getSession().catch(() => null);
      if (cancelled) return;
      if (session && !session.error && session.user?.token && goHome(session.user)) return;
      await signOut({ redirect: false }).catch(() => null);
      if (!cancelled) setChecking(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStoredLogin]);

  const notice =
    reason === "expired"
      ? "आपका सत्र समाप्त हो गया है। कृपया फिर से लॉगिन करें।"
      : reason === "disabled"
        ? "आपका खाता निष्क्रिय कर दिया गया है। कृपया प्रशासक से संपर्क करें।"
        : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: formData.email.trim(),
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      setError(SIGN_IN_ERRORS[result.error] || GENERIC_ERROR);
      setLoading(false);
      return;
    }

    const session: any = await getSession();
    if (!goHome(session?.user)) {
      setError("इस खाते के लिए कोई पोर्टल पेज उपलब्ध नहीं है। कृपया प्रशासक से संपर्क करें।");
      await signOut({ redirect: false });
      setLoading(false);
    }
    // on success the page navigates away, so the button stays disabled
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto mb-3"></div>
          <p className="text-orange-700 text-sm">सत्र जाँचा जा रहा है...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={60}
                height={60}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">पंचाल समाज 14 चोखरा</h1>
                <p className="text-orange-100 text-sm md:text-lg">डिजिटल जनगणना 2025 - एडमिन लॉगिन</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-orange-700">एडमिन लॉगिन पोर्टल</CardTitle>
              <CardDescription>जनगणना प्रबंधन प्रणाली में प्रवेश के लिए साइन इन करें</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} method="post" className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-orange-700 font-medium">
                    ईमेल पता *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="अपना ईमेल पता दर्ज करें"
                      className="border-orange-200 focus:border-orange-400 pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="text-orange-700 font-medium">
                    पासवर्ड *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={formData.showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="पासवर्ड दर्ज करें"
                      className="border-orange-200 focus:border-orange-400 pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                    >
                      {formData.showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                {notice && !error && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertDescription className="text-amber-800">{notice}</AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  disabled={!ready || loading || !formData.email || !formData.password}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {loading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
                </Button>
              </form>
              {/* Support Options */}
              <div className="mt-6 pt-6 border-t border-orange-200">
                <div className="flex justify-between text-sm">
                  <Link href="/reset-password" className="text-orange-600 hover:text-orange-700 hover:underline">
                    पासवर्ड भूल गए?
                  </Link>
                  <Link
                    href="/help"
                    className="text-orange-600 hover:text-orange-700 hover:underline flex items-center"
                  >
                    <HelpCircle className="w-4 h-4 mr-1" />
                    सहायता
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link href="/">
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent">
                मुख्य पेज पर वापस जाएं
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mb-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>सिस्टम ऑनलाइन</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>सुरक्षित</span>
          </div>
        </div>



        <div className="mt-2">
          <a href="/help" className="text-xs text-orange-600 hover:text-orange-700 underline">
            सहायता चाहिए? यहाँ क्लिक करें
          </a>
        </div>
      </div>
      <div className="bg-white/80 rounded-xl p-4 mb-4">
        <div className="text-center mb-3">
          <h3 className="text-sm font-medium text-gray-700">उपयोगकर्ता प्रकार</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-blue-50 rounded-lg">
            <div className="text-blue-600 text-xs font-medium">सुपर एडमिन</div>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <div className="text-green-600 text-xs font-medium">गांव सदस्य</div>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <div className="text-purple-600 text-xs font-medium">चोखला सदस्य</div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-orange-100">© 2025 पंचाल समाज 14 चोखरा डिजिटल जनगणना। सभी अधिकार सुरक्षित।</p>
        </div>
      </footer>
    </div>
  );
}
