"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, User, Calendar } from "lucide-react";
import Link from "next/link";

const signUpSchema = z.object({
  fullName: z.string().min(2, "الاسم الكامل يجب أن يكون حرفين على الأقل"),
  age: z.coerce
    .number()
    .min(5, "العمر يجب أن يكون 5 سنوات على الأقل")
    .max(120, "العمر يجب أن يكون 120 سنة على الأكثر"),
  email: z.email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export default function SignUpPage() {
  const { user, loading, error, signUpWithEmail } = useAuth();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);

  if (user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-emerald-600">
          ✅ أنت مسجل الدخول!
        </h2>
        <Link href="/" className="text-indigo-600 underline mt-4 inline-block">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const result = signUpSchema.safeParse({ fullName, age, email, password });
    if (!result.success) {
      setFormError(result.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      await signUpWithEmail(fullName, age, email, password);
      setSent(true);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "فشل إنشاء الحساب";
      setFormError(errorMessage);
    }
    setSubmitting(false);
  };

  if (sent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
        dir="rtl"
      >
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            ✅ تم إنشاء الحساب!
          </h2>
          <p className="text-slate-500 mb-6">
            تم إرسال بريد تأكيد إلى <strong>{email}</strong>. يرجى التحقق من
            بريدك والنقر على الرابط.
          </p>
          <a
            href="/auth/sign-in"
            className="text-indigo-600 font-medium hover:underline"
          >
            العودة لتسجيل الدخول
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 w-full max-w-md">
        <h1 className="text-3xl font-black text-slate-800 text-center mb-2">
          إنشاء حساب جديد
        </h1>
        <p className="text-slate-500 text-center mb-8">انضم إلى مدرسة ألف</p>

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

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              الاسم الكامل
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="طارق أحمد"
              />
              <User className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              العمر
            </label>
            <div className="relative">
              <input
                type="number"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value === "" ? "" : Number(e.target.value))
                }
                min={5}
                max={120}
                className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="25"
              />
              <Calendar className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                className="w-full px-4 py-3 pr-10 pe-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            {submitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          لديك حساب?{" "}
          <a href="/auth/sign-in" className="text-indigo-600 font-medium">
            تسجيل الدخول
          </a>
        </p>
      </div>
    </div>
  );
}
