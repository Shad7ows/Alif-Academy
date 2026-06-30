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
        if (error) throw error;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  const signUpWithEmail = useCallback(
    async (fullName: string, email: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [supabase]
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
  };
}