"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserProgress, UserData } from "@/types/database";

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

function aggregateProgress(data: UserProgress[]): UserData {
  return {
    completedLessons: data.map((p) => p.lesson_id),
    xp: data.reduce((sum, p) => sum + (p.quiz_score || 0), 0),
  };
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useUserProgress(userId: string | null) {
  const [userData, setUserData] = useState<UserData>({
    completedLessons: [],
    xp: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMigrated, setHasMigrated] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  // Track if we already attempted migration for this userId
  const migrationAttempted = useRef(false);

  // ── Effect: Fetch progress (no synchronous setState in body) ─────────────

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // No userId → just stop loading (setLoading inside async fn, not effect body)
      if (!userId) {
        if (!cancelled) setLoading(false);
        return;
      }

      if (!cancelled) setLoading(true);

      try {
        // 1. Fetch server data
        const { data, error: fetchError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", userId);

        if (fetchError) throw fetchError;

        const serverData = (data as UserProgress[]) || [];
        let currentData = aggregateProgress(serverData);

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

                const mergedData = (merged as UserProgress[]) || [];
                currentData = aggregateProgress(mergedData);

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

      setUserData((prev) => ({
        ...prev,
        completedLessons: prev.completedLessons.includes(lessonId)
          ? prev.completedLessons
          : [...prev.completedLessons, lessonId],
        xp: prev.xp + score,
      }));

      try {
        const { error } = await supabase.from("user_progress").upsert(
          {
            user_id: userId,
            lesson_id: lessonId,
            completed_at: new Date().toISOString(),
            quiz_score: score,
            attempts: 1,
          },
          { onConflict: "user_id,lesson_id" }
        );

        if (error) throw error;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
        setUserData(previousData);
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
          .upsert(entries, { onConflict: "user_id,lesson_id" }); // ✅ cast as any

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