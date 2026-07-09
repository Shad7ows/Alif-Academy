"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserProgress, UserData } from "@/types/database";
import { calculateStreak } from "@/utils/calculateStreak";

// ─── Helpers ───────────────────────────────────────────────────────────────

function hasLocalData(): boolean {
  try {
    const localData = localStorage.getItem("alifProV3Data");
    if (!localData) return false;
    const parsed = JSON.parse(localData);
    return parsed.completedLessons?.length > 0 || parsed.xp > 0;
  } catch {
    return false;
  }
}

function parseLocalData(): UserData | null {
  try {
    const raw = localStorage.getItem("alifProV3Data");
    if (!raw) return null;
    return JSON.parse(raw) as UserData;
  } catch {
    return null;
  }
}

function buildProgressEntries(
  userId: string,
  lessons: string[],
  score: number
): Omit<UserProgress, "id" | "attempts">[] {
  return lessons.map((lessonId) => ({
    user_id: userId,
    lesson_id: lessonId,
    completed_at: new Date().toISOString(),
    quiz_score: score,
  }));
}

function aggregateProgress(
  data: UserProgress[],
  profile?: { streak: number; longest_streak: number; last_active_date: string | null }
): UserData {
  return {
    completedLessons: data.map((p) => p.lesson_id),
    xp: data.reduce((sum, p) => sum + (p.quiz_score || 0), 0),
    currentStreak: profile?.streak ?? 0,
    lastActiveDate: profile?.last_active_date
      ? new Date(profile.last_active_date).toISOString()
      : null,
    longestStreak: profile?.longest_streak ?? 0,
  };
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useUserProgress(userId: string | null) {
  const [userData, setUserData] = useState<UserData>({
    completedLessons: [],
    xp: 0,
    currentStreak: 0,
    lastActiveDate: null,
    longestStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMigrated, setHasMigrated] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  // Track if we already attempted migration for this userId
  const migrationAttempted = useRef(false);

  // ── Effect: Fetch progress + profile (no synchronous setState in body) ─

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // No userId → just stop loading
      if (!userId) {
        if (!cancelled) setLoading(false);
        return;
      }

      if (!cancelled) setLoading(true);

      try {
        // 1. Fetch user_progress data
        const { data: progressData, error: fetchError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", userId);

        if (fetchError) throw fetchError;

        // 2. Fetch profile data (streak, last_active_date)
        // Note: longest_streak will be added to the database schema manually
        const { data: rawProfileData, error: profileError } = await supabase
          .from("profiles")
          .select("streak, last_active_date")
          .eq("id", userId)
          .single();

        if (profileError) throw profileError;

        const serverData = (progressData as UserProgress[]) || [];
        // Cast to include longest_streak (will be 0 until column is added)
        const profileData = {
          streak: (rawProfileData as { streak: number; last_active_date: string | null; longest_streak?: number })?.streak ?? 0,
          longest_streak: (rawProfileData as { streak: number; last_active_date: string | null; longest_streak?: number })?.longest_streak ?? 0,
          last_active_date: (rawProfileData as { streak: number; last_active_date: string | null; longest_streak?: number })?.last_active_date ?? null,
        };
        let currentData = aggregateProgress(serverData, profileData);

        if (!cancelled) setUserData(currentData);

        // 2. Auto-migrate local data (only once per userId)
        if (!migrationAttempted.current && !hasMigrated && hasLocalData()) {
          migrationAttempted.current = true;

          const localData = parseLocalData();
          if (localData && localData.completedLessons.length > 0) {
            try {
              const entries = buildProgressEntries(
                userId,
                localData.completedLessons,
                25 // default score for migrated lessons
              );

              const { error: upsertError } = await supabase
                .from("user_progress")
                .upsert(entries, { onConflict: "user_id,lesson_id" });

              if (!upsertError) {
                localStorage.removeItem("alifProV3Data");

                // Re-fetch merged data
                const { data: merged } = await supabase
                  .from("user_progress")
                  .select("*")
                  .eq("user_id", userId);

                const mergedProfileData = await supabase
                  .from("profiles")
                  .select("streak, last_active_date")
                  .eq("id", userId)
                  .single();

                const mergedProfile = {
                  streak: (mergedProfileData.data as { streak: number; last_active_date: string | null; longest_streak?: number })?.streak ?? 0,
                  longest_streak: (mergedProfileData.data as { streak: number; last_active_date: string | null; longest_streak?: number })?.longest_streak ?? 0,
                  last_active_date: (mergedProfileData.data as { streak: number; last_active_date: string | null; longest_streak?: number })?.last_active_date ?? null,
                };
                const mergedData = (merged as UserProgress[]) || [];
                currentData = aggregateProgress(mergedData, mergedProfile);

                if (!cancelled) {
                  setUserData(currentData);
                  setHasMigrated(true);
                }
              }
            } catch (migrationError) {
              console.error("Migration error:", migrationError);
            }
          }
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [userId, supabase, hasMigrated]);

  // ── completeLesson ──────────────────────────────────────────────────────

  const completeLesson = useCallback(
    async (lessonId: string, score: number = 0) => {
      if (!userId) return;

      const previousData = { ...userData };
      const hasNewLesson = !userData.completedLessons.includes(lessonId);

      // Calculate new streak using the pure function
      const newStreak = hasNewLesson
        ? calculateStreak(userData.currentStreak, userData.lastActiveDate)
        : userData.currentStreak;

      // Optimistic update
      setUserData((prev) => ({
        ...prev,
        completedLessons: hasNewLesson
          ? [...prev.completedLessons, lessonId]
          : prev.completedLessons,
        xp: hasNewLesson ? prev.xp + score : prev.xp,
        currentStreak: newStreak,
        lastActiveDate: hasNewLesson
          ? new Date().toISOString().split("T")[0]
          : prev.lastActiveDate,
      }));

      try {
        // Save user_progress
        const { error: progressError } = await supabase.from("user_progress").upsert(
          {
            user_id: userId,
            lesson_id: lessonId,
            completed_at: new Date().toISOString(),
            quiz_score: score,
            attempts: 1,
          },
          { onConflict: "user_id,lesson_id" }
        );

        if (progressError) throw progressError;

        // Update profile streak (last_active_date will be updated manually below)
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            streak: newStreak,
            last_active_date: new Date().toISOString(),
          })
          .eq("id", userId);

        if (profileError) throw profileError;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
        setUserData(previousData); // Rollback
      }
    },
    [userId, userData, supabase]
  );

  // ── importFromLocalStorage ──────────────────────────────────────────────

  const importFromLocalStorage = useCallback(
    async (localData: UserData) => {
      if (!userId) return;

      const previousData = { ...userData };

      const entries = buildProgressEntries(
        userId,
        localData.completedLessons,
        25
      );

      setUserData(localData);

      try {
        const { error } = await supabase
          .from("user_progress")
          .upsert(entries, { onConflict: "user_id,lesson_id" });

        if (error) throw error;

        // Refresh from server
        const { data: refreshed } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", userId);

        const refreshedData = (refreshed as UserProgress[]) || [];
        const merged = aggregateProgress(refreshedData);

        setUserData(merged);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
        setUserData(previousData);
        throw e;
      }
    },
    [userId, userData, supabase]
  );

  return {
    userData,
    loading,
    error,
    hasMigrated,
    completeLesson,
    importFromLocalStorage,
  };
}