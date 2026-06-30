"use client";

import { useState } from "react";
import { z } from "zod";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const resetSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const result = resetSchema.safeParse({ email });
    if (!result.success) {
      setFormError(result.error.issues[0].message);
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "فشل إرسال الرابط";
      setFormError(errorMessage);
    }
    setSending(false);
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
            تم إرسال البريد!
          </h2>
          <p className="text-slate-500 mb-6">
            راجع بريدك الإلكتروني على <strong>{email}</strong> واتبع رابط إعادة
            تعيين كلمة المرور.
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
        <h1 className="text-2xl font-black text-slate-800 text-center mb-2">
          إعادة تعيين كلمة المرور
        </h1>
        <p className="text-slate-500 text-center mb-6">
          سنرسل لك رابطاً لإعادة تعيين كلمة المرور
        </p>

        {formError && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 text-center">
            {formError}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
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

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {sending ? "جاري الإرسال..." : "إرسال الرابط"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          <a href="/auth/sign-in" className="text-indigo-600 font-medium">
            ← العودة لتسجيل الدخول
          </a>
        </p>
      </div>
    </div>
  );
}
