"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Lock, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ─── Schema ────────────────────────────────────────────────────────────────

const passwordSchema = z
  .object({
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

// ─── Content Component ─────────────────────────────────────────────────────

function UpdatePasswordContent() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);

  // Check session on mount (async, no sync setState in effect body)
  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!cancelled) {
        if (!session) {
          router.push("/auth/sign-in");
        } else {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [supabase, router]);

  // Handle password update
  const handleUpdatePassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError("");

      const result = passwordSchema.safeParse({ password, confirmPassword });
      if (!result.success) {
        setFormError(result.error.issues[0].message);
        return;
      }

      setUpdating(true);
      try {
        const { error } = await supabase.auth.updateUser({
          password,
        });
        if (error) throw error;
        setSuccess(true);
      } catch (e: unknown) {
        const errorMessage =
          e instanceof Error ? e.message : "فشل تحديث كلمة المرور";
        setFormError(errorMessage);
      } finally {
        setUpdating(false);
      }
    },
    [password, confirmPassword, supabase]
  );

  // ─── Loading State ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
        dir="rtl"
      >
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-slate-200 rounded-full" />
          <div className="w-32 h-4 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  // ─── Success State ───────────────────────────────────────────────────────

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
        dir="rtl"
      >
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            تم تحديث كلمة المرور!
          </h2>
          <p className="text-slate-500 mb-6">
            تم إعادة تعيين كلمة المرور بنجاح.
          </p>
          <button
            onClick={() => router.push("/auth/sign-in")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  // ─── Form State ──────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 w-full max-w-md">
        <h1 className="text-2xl font-black text-slate-800 text-center mb-2">
          تحديث كلمة المرور
        </h1>
        <p className="text-slate-500 text-center mb-6">
          أدخل كلمة المرور الجديدة
        </p>

        {formError && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 text-center">
            {formError}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 pl-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={updating}
              />
              <Lock className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 pl-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={updating}
              />
              <Lock className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {updating ? "جاري التحديث..." : "تحديث كلمة المرور"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          <a
            href="/auth/sign-in"
            className="text-indigo-600 font-medium hover:underline"
          >
            ← العودة لتسجيل الدخول
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── Page Wrapper with Suspense ────────────────────────────────────────────

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
          dir="rtl"
        >
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-slate-200 rounded-full" />
            <div className="w-32 h-4 bg-slate-200 rounded" />
          </div>
        </div>
      }
    >
      <UpdatePasswordContent />
    </Suspense>
  );
}
