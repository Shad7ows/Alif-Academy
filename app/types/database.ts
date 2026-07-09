import type { Database as SupabaseDatabase } from "./supabase";

// ─── Re-export للتوافق مع الكود القديم ─────────────────────────────────────

export type Database = SupabaseDatabase;

// ─── Row Types (للقراءة) ───────────────────────────────────────────────────

export type Profile = SupabaseDatabase["public"]["Tables"]["profiles"]["Row"];
export type UserProgress =
  SupabaseDatabase["public"]["Tables"]["user_progress"]["Row"];
export type ActivityLog =
  SupabaseDatabase["public"]["Tables"]["activity_log"]["Row"];

// ─── Insert Types (للكتابة) ─────────────────────────────────────────────────

export type ProfileInsert =
  SupabaseDatabase["public"]["Tables"]["profiles"]["Insert"];
export type UserProgressInsert =
  SupabaseDatabase["public"]["Tables"]["user_progress"]["Insert"];
export type ActivityLogInsert =
  SupabaseDatabase["public"]["Tables"]["activity_log"]["Insert"];

// ─── Update Types ────────────────────────────────────────────────────────────

export type ProfileUpdate =
  SupabaseDatabase["public"]["Tables"]["profiles"]["Update"];
export type UserProgressUpdate =
  SupabaseDatabase["public"]["Tables"]["user_progress"]["Update"];
export type ActivityLogUpdate =
  SupabaseDatabase["public"]["Tables"]["activity_log"]["Update"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export interface UserData {
  completedLessons: string[];
  xp: number;
  currentStreak: number;
  lastActiveDate: string | null;
  longestStreak: number;
}

// ─── Generic helpers (اختياري) ──────────────────────────────────────────────

export type TableRow<T extends keyof SupabaseDatabase["public"]["Tables"]> =
  SupabaseDatabase["public"]["Tables"][T]["Row"];

export type TableInsert<T extends keyof SupabaseDatabase["public"]["Tables"]> =
  SupabaseDatabase["public"]["Tables"][T]["Insert"];

export type TableUpdate<T extends keyof SupabaseDatabase["public"]["Tables"]> =
  SupabaseDatabase["public"]["Tables"][T]["Update"];
