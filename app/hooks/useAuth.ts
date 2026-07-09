"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth state changes (cross-tab sync, session refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setLoading(false);
    } finally {
      // اختياري: إذا اردنا التأكد دائماً
      setLoading(false);
    }
  }, [supabase]);

  const signInWithGitHub = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setLoading(false);
    } finally {
      // اختياري: إذا اردنا التأكد دائماً
      setLoading(false);
    }
  }, [supabase]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw "فشل تسجيل الدخول";
      } catch (e: unknown) {
        const message = e instanceof Error ? e : "فشل تسجيل الدخول";
        throw message;
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  // ── Helper: Check email via Edge Function ─────────────────────────────
  const checkEmailExists = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/check-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        if (!response.ok) return false;

        const { exists } = await response.json();
        return exists;
      } catch {
        return false; // Fail-safe: افترض أنه غير موجود
      }
    },
    []
  );

  // ── Sign Up with Pre-check ─────────────────────────────────────────────
  const signUpWithEmail = useCallback(
    async (
      fullName: string,
      age: number | "",
      email: string,
      password: string
    ) => {
      setError(null);
      setLoading(true);

      try {
        // الخطوة 1: التحقق من وجود البريد
        const exists = await checkEmailExists(email);

        if (exists) {
          throw new Error(
            "هذا البريد الإلكتروني مسجل مسبقاً. يرجى تسجيل الدخول أو استعادة كلمة المرور."
          );
        }

        // الخطوة 2: إنشاء الحساب
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              age: age !== "" ? age : null,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;

        return {
          success: true,
          message: "تم إرسال بريد التأكيد. يرجى التحقق من بريدك الإلكتروني.",
        };
      } catch (e: unknown) {
        const message = e instanceof Error ? e : "فشل إنشاء الحساب";
        throw message;
      } finally {
        setLoading(false);
      }
    },
    [supabase, checkEmailExists]
  );

  const signOut = useCallback(async () => {
    try {
      // 1. تسجيل خروج على العميل لتحديث الحالة فوراً
      await supabase.auth.signOut();
      // 2. استدعاء السيرفر لتنظيف الكوكيز
      await fetch("/auth/sign-out", { method: "POST" });
      // 3. إعادة تحميل الصفحة
      window.location.href = "/";
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }, [supabase]);

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    checkEmailExists,
  };
}
