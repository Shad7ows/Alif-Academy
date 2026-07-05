"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { GoogleIcon, GitHubIcon } from "@/components/Auth/Icons";
import Link from "next/link";

const signInSchema = z.object({
  email: z.email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export default function SignInPage() {
  const router = useRouter();
  const {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // التوجيه التلقائي إلى الصفحة الرئيسية عند تسجيل الدخول
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      setFormError(result.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
    } catch (e: unknown) {
      // Check error code (stable) and status code as fallback
      const err = e as Error & { code?: string; status?: number };
      let errorMessage = "فشل تسجيل الدخول";
      if (err != null) {
        // Check Supabase error code (stable across Supabase updates)
        if (err.code === "email_not_confirmed") {
          errorMessage = "لم يتم التحقق من البريد الإلكتروني";
        }
        // Fallback: check HTTP status 403 (Supabase uses it for unconfirmed emails)
        else if (err.status === 403) {
          errorMessage = "لم يتم التحقق من البريد الإلكتروني";
        }
        // If it's an Error object, use its message as fallback
        else if (e instanceof Error && e.message) {
          errorMessage = e.message;
        }
      }
      setFormError(errorMessage);
    }
    setSubmitting(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 w-full max-w-md">
        <h1 className="text-3xl font-black text-slate-800 text-center mb-2">
          تسجيل الدخول
        </h1>
        <p className="text-slate-500 text-center mb-8">
          مرحباً بك في مدرسة ألف
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {formError && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 text-center">
            {formError}
          </div>
        )}

        <div className="space-y-3 mb-6">
          <button
            onClick={signInWithGoogle}
            disabled={loading || submitting}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <GoogleIcon className="w-5 h-5" />
            {loading ? "جاري..." : "تسجيل الدخول بـ Google"}
          </button>

          <button
            onClick={signInWithGitHub}
            disabled={loading || submitting}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <GitHubIcon className="w-5 h-5" />
            {loading ? "جاري..." : "تسجيل الدخول بـ GitHub"}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-sm">أو</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-slate-300 text-slate-700  rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="your@email.com"
              />
              <Mail className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 pe-10 border border-slate-300 text-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <Lock className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || submitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          ليس لديك حساب؟{" "}
          <a href="/auth/sign-up" className="text-indigo-600 font-medium">
            إنشاء حساب جديد
          </a>
        </p>

        <p className="text-center text-sm text-slate-500 mt-2">
          <a
            href="/auth/reset-password"
            className="text-slate-400 hover:text-slate-600"
          >
            نسيت كلمة المرور؟
          </a>
        </p>
      </div>
    </div>
  );
}
