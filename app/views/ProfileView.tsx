"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LEVELS, getChaptersForLevel } from "@/chapters";
import {
  User,
  Mail,
  Lock,
  Star,
  BarChart3,
  Percent,
  CheckCircle2,
  Loader2,
  Pencil,
  Save,
  X,
  Key,
  ArrowRight,
} from "lucide-react";

interface ProfileViewProps {
  userData: {
    completedLessons: string[];
    xp: number;
  };
  onBack: () => void;
}

export const ProfileView = ({ userData, onBack }: ProfileViewProps) => {
  const { user } = useAuth();
  const supabase = createClient();

  // Calculate total lessons from all levels
  const totalLessons = LEVELS.reduce(
    (acc, level) =>
      acc +
      getChaptersForLevel(level.id).reduce(
        (chapterAcc, chapter) => chapterAcc + chapter.lessons.length,
        0,
      ),
    0,
  );

  // Profile editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "المستخدم",
  );
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Fetch full name from profiles table on mount
  useEffect(() => {
    const fetchName = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (!error && data?.full_name) {
          setDisplayName(data.full_name);
        }
      } catch {
        // Fallback to user_metadata or email
      }
    };
    fetchName();
  }, [user?.id, supabase]);

  const handleSaveName = async () => {
    if (!displayName.trim() || !user?.id) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: displayName.trim() })
        .eq("id", user.id);

      if (error) throw error;

      // Also update auth user_metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: { full_name: displayName.trim() },
      });

      if (userError) throw userError;

      setSaveMessage({ type: "success", text: "تم تحديث الاسم بنجاح" });
      setIsEditingName(false);
    } catch {
      setSaveMessage({ type: "error", text: "فشل تحديث الاسم" });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleCancelName = () => {
    setDisplayName(
      user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        "المستخدم",
    );
    setIsEditingName(false);
    setSaveMessage(null);
  };

  const handlePasswordUpdate = async () => {
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("كلمتا المرور غير متطابقتين");
      return;
    }

    setPasswordLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (e: unknown) {
      setPasswordError(
        e instanceof Error ? e.message : "فشل تحديث كلمة المرور",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const getAvatarInitial = (): string => {
    if (displayName && displayName !== "المستخدم") {
      return displayName.charAt(0);
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-20">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium dark:text-slate-400"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة للرئيسية</span>
      </button>

      {/* Header */}
      <div className="bg-indigo-500 dark:bg-indigo-600 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30">
              <span className="text-white text-3xl font-black">
                {getAvatarInitial()}
              </span>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-400 rounded-full border-3 border-white shadow-sm" />
          </div>

          {/* User Info */}
          <div className="text-center md:text-right flex-1">
            <h2 className="text-3xl font-black mb-1">الملف الشخصي</h2>
            <p className="text-indigo-100 text-sm">
              إدارة حسابك ومعلوماتك الشخصية
            </p>
          </div>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div
          className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium text-center ${
            saveMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700"
              : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700"
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      {/* Personal Information Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          المعلومات الشخصية
        </h3>

        {/* Loading indicator for name */}
        {displayName === "المستخدم" && !isEditingName && (
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-400 dark:text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>جاري تحميل الاسم...</span>
          </div>
        )}

        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              الاسم الكامل
            </label>
            {isEditingName ? (
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border-2 border-indigo-300 dark:border-indigo-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-indigo-50 dark:bg-indigo-900/20 dark:text-white"
                    placeholder="اسمك الكامل"
                    autoFocus
                  />
                  <Pencil className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
                </div>
                <button
                  onClick={handleSaveName}
                  disabled={saving}
                  className="px-5 py-3 bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-700 dark:hover:bg-emerald-800 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span className="hidden sm:inline">حفظ</span>
                </button>
                <button
                  onClick={handleCancelName}
                  disabled={saving}
                  className="px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-lg">
                    {displayName}
                  </span>
                </div>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  <span>تعديل</span>
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              البريد الإلكتروني
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
              <Mail className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {user?.email}
              </span>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              كلمة المرور
            </label>
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  ••••••••
                </span>
              </div>
              <button
                onClick={() => {
                  setPasswordError("");
                  setPasswordSuccess(false);
                  setNewPassword("");
                  setConfirmPassword("");
                  setShowPasswordModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
              >
                <Key className="w-4 h-4" />
                <span>تغيير</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          إحصائيات التعلم
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* XP */}
          <div className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-amber-100 dark:border-amber-800 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
              <span className="text-3xl font-black text-amber-700 dark:text-amber-300">
                {userData.xp}
              </span>
            </div>
            <p className="text-amber-600/70 dark:text-amber-400/70 text-sm font-bold">
              نقطة خبرة
            </p>
          </div>

          {/* Completed Lessons */}
          <div className="bg-linear-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
              <span className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
                {userData.completedLessons.length}
              </span>
            </div>
            <p className="text-emerald-600/70 dark:text-emerald-400/70 text-sm font-bold">
              دروس مكتملة
            </p>
          </div>

          {/* Progress Percentage */}
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Percent className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              <span className="text-3xl font-black text-indigo-700 dark:text-indigo-300">
                {totalLessons > 0
                  ? Math.round(
                      (userData.completedLessons.length / totalLessons) * 100,
                    )
                  : 0}
              </span>
            </div>
            <p className="text-indigo-600/70 dark:text-indigo-400/70 text-sm font-bold">
              نسبة الإكمال
            </p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          أمان الحساب
        </h3>

        <div className="space-y-3">
          <button
            onClick={() => {
              setPasswordError("");
              setPasswordSuccess(false);
              setNewPassword("");
              setConfirmPassword("");
              setShowPasswordModal(true);
            }}
            className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-colors border border-slate-200 dark:border-slate-600 hover:border-indigo-200 dark:hover:border-indigo-700 group"
          >
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
              <div className="text-right">
                <span className="block font-bold text-slate-700 dark:text-slate-200">
                  تغيير كلمة المرور
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  تحديث كلمة مرور حسابك
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 rotate-180" />
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {passwordSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
                  تم تحديث كلمة المرور!
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  تم تحديث كلمة المرور بنجاح
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    تغيير كلمة المرور
                  </h3>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  </button>
                </div>

                {passwordError && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-4 text-center border border-red-200 dark:border-red-700">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-10 pl-12 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 dark:text-white"
                        placeholder="••••••••"
                        autoFocus
                      />
                      <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute right-3 top-3.5" />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showNewPassword ? (
                          <X className="w-5 h-5" />
                        ) : (
                          <Pencil className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      تأكيد كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-10 pl-12 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 dark:text-white"
                        placeholder="••••••••"
                      />
                      <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute right-3 top-3.5" />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showConfirmPassword ? (
                          <X className="w-5 h-5" />
                        ) : (
                          <Pencil className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handlePasswordUpdate}
                    disabled={passwordLoading}
                    className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-800 disabled:opacity-50 transition-colors"
                  >
                    {passwordLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري التحديث...
                      </span>
                    ) : (
                      "تحديث كلمة المرور"
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
