"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Settings,
  Palette,
  Sun,
  Moon,
  Trash2,
  AlertTriangle,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface SettingsViewProps {
  onBack: () => void;
}

export const SettingsView = ({ onBack }: SettingsViewProps) => {
  const { user } = useAuth();
  const supabase = createClient();

  // Theme state - initialize from localStorage
  const getInitialTheme = (): "light" | "dark" => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | null;
      if (savedTheme === "dark") {
        return "dark";
      }
    }
    return "light";
  };

  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme());
  const [themeLoading, setThemeLoading] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleThemeChange = async (newTheme: "light" | "dark") => {
    setThemeLoading(true);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save to localStorage (theme column may not exist in profiles table)
    localStorage.setItem("user_theme", newTheme);

    setThemeLoading(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");

    // Verify email matches
    if (deleteConfirmEmail !== user?.email) {
      setDeleteError("البريد الإلكتروني غير متطابق");
      return;
    }

    setDeleteLoading(true);

    try {
      // Delete the auth user (this will also delete associated profile due to CASCADE)
      const { error } = await supabase.auth.admin.deleteUser(user!.id);

      if (error) throw error;

      // Show success message
      setDeleteSuccess(true);

      // Clear localStorage
      localStorage.removeItem("theme");
      document.documentElement.classList.remove("dark");

      // Sign out and redirect after a brief delay
      await supabase.auth.signOut();
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : "فشل حذف الحساب");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-20">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-400 dark:hover:text-indigo-400"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة للرئيسية</span>
      </button>

      {/* Header */}
      <div className="bg-slate-800 dark:bg-slate-900 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Settings Icon */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30">
              <Settings className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center md:text-right flex-1">
            <h2 className="text-3xl font-black mb-1">الإعدادات</h2>
            <p className="text-slate-300 text-sm dark:text-slate-400">
              تحكم في مظهر حسابك وإعدادات الخصوصية
            </p>
          </div>
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 dark:text-white">
          <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          المظهر
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Light Mode */}
          <button
            onClick={() => handleThemeChange("light")}
            disabled={theme === "light" || themeLoading}
            className={`relative p-6 rounded-2xl border-2 transition-all text-right ${
              theme === "light"
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md"
                : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-slate-500"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Sun
                className={`w-8 h-8 ${
                  theme === "light"
                    ? "text-amber-500"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              />
              {theme === "light" && (
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>
            <span
              className={`font-bold ${
                theme === "light"
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              الوضع الفاتح
            </span>
            <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
              خلفية فاتحة للقراءة المريحة
            </p>
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => handleThemeChange("dark")}
            disabled={theme === "dark" || themeLoading}
            className={`relative p-6 rounded-2xl border-2 transition-all text-right ${
              theme === "dark"
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md"
                : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-slate-500"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Moon
                className={`w-8 h-8 ${
                  theme === "dark"
                    ? "text-indigo-500"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              />
              {theme === "dark" && (
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>
            <span
              className={`font-bold ${
                theme === "dark"
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              الوضع الداكن
            </span>
            <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
              خلفية داكنة لراحة العين
            </p>
          </button>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-black text-red-600 mb-6 flex items-center gap-2 dark:text-red-400">
          <Trash2 className="w-5 h-5" />
          منطقة الخطر
        </h3>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-5 border border-red-100 dark:border-red-800">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-700 mb-1 dark:text-red-300">
                حذف الحساب نهائياً
              </h4>
              <p className="text-sm text-red-600/80 dark:text-red-400/70">
                عند حذف حسابك، سيتم إزالة جميع بياناتك ودروسك المكملة ونقاط
                خبرتك بشكل لا يمكن التراجع عنه.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setDeleteError("");
              setDeleteConfirmEmail("");
              setShowDeleteModal(true);
            }}
            className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
          >
            حذف حسابي
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {deleteSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2 dark:text-white">
                  تم حذف الحساب
                </h3>
                <p className="text-slate-500 text-sm dark:text-slate-400">
                  تم حذف حسابك وجميع بياناتك بنجاح
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-red-600 flex items-center gap-2 dark:text-red-400">
                    <Trash2 className="w-5 h-5" />
                    تأكيد حذف الحساب
                  </h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors dark:hover:bg-slate-700"
                  >
                    <X className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  </button>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6 border border-red-100 dark:border-red-800">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      هذه العملية لا رجعة فيها. سيتم حذف جميع بياناتك بشكل
                      نهائي.
                    </p>
                  </div>
                </div>

                {deleteError && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-4 text-center border border-red-100 dark:border-red-800">
                    {deleteError}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                    اكتب بريدك الإلكتروني للتأكيد
                  </label>
                  <input
                    type="email"
                    value={deleteConfirmEmail}
                    onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-center font-medium bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    placeholder="بريدك الإلكتروني"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={
                      deleteLoading || deleteConfirmEmail !== user?.email
                    }
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري الحذف...
                      </>
                    ) : (
                      "حذف نهائي"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
