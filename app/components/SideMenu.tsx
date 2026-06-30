"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, User, Mail, LogOut, Star, Trophy } from "lucide-react";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  xp?: number;
  completedLessons?: number;
}

// Simple Google icon component
const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// Simple GitHub icon component
const GitHubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export function SideMenu({
  isOpen,
  onClose,
  xp = 0,
  completedLessons = 0,
}: SideMenuProps) {
  const {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithGitHub,
    signUpWithEmail,
    signOut,
  } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSignIn = useCallback(async () => {
    setSubmitting(true);
    setFormError("");
    try {
      await signInWithGoogle();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "فشل تسجيل الدخول";
      setFormError(errorMessage);
    }
    setSubmitting(false);
  }, [signInWithGoogle]);

  const handleGitHubSignIn = useCallback(async () => {
    setSubmitting(true);
    setFormError("");
    try {
      await signInWithGitHub();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "فشل تسجيل الدخول";
      setFormError(errorMessage);
    }
    setSubmitting(false);
  }, [signInWithGitHub]);

  const handleSignUp = useCallback(async () => {
    setSubmitting(true);
    setFormError("");
    try {
      await signUpWithEmail(fullName, email, password);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "فشل إنشاء الحساب";
      setFormError(errorMessage);
    }
    setSubmitting(false);
  }, [signUpWithEmail, fullName, email, password]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    onClose();
  }, [signOut, onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-linear-to-br from-slate-900 to-indigo-900 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Menu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black">مدرسة ألف</h2>
                <p className="text-indigo-200 text-xs">رحلة تعلم البرمجة</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto h-[calc(100vh-200px)] p-6">
          {user ? (
            /* Logged In State */
            <div className="space-y-6">
              {/* User Profile */}
              <div className="bg-linear-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">
                      {user.email?.split("@")[0] || "المستخدم"}
                    </h3>
                    <p className="text-slate-500 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-orange-600">
                    <Star className="w-4 h-4 fill-orange-500" />
                    <span className="font-bold">{xp} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Trophy className="w-4 h-4" />
                    <span className="font-bold">{completedLessons} دروس</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-700 font-medium">
                  <User className="w-5 h-5" />
                  الملف الشخصي
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-700 font-medium">
                  <Trophy className="w-5 h-5" />
                  الإنجازات
                </button>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-medium disabled:opacity-50"
              >
                <LogOut className="w-5 h-5" />
                تسجيل الخروج
              </button>
            </div>
          ) : showSignUp ? (
            /* Sign Up Form */
            <div className="space-y-4">
              <button
                onClick={() => setShowSignUp(false)}
                className="text-indigo-600 text-sm hover:underline mb-2 block"
              >
                ← العودة لتسجيل الدخول
              </button>

              <h3 className="text-xl font-bold text-slate-800 mb-4">
                إنشاء حساب جديد
              </h3>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {formError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {formError}
                </div>
              )}

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
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <button
                onClick={handleSignUp}
                disabled={loading || submitting}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? "جاري الإنشاء..." : "إنشاء حساب"}
              </button>
            </div>
          ) : (
            /* Sign In State */
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                مرحباً بك في مدرسة ألف
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                سجل دخولك لحفظ تقدم الدراسي ومزامنة بياناتك على جميع الأجهزة.
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Social Sign In */}
              <button
                onClick={handleSignIn}
                disabled={loading || submitting}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <GoogleIcon className="w-5 h-5" />
                {loading ? "جاري..." : "تسجيل الدخول بـ Google"}
              </button>

              <button
                onClick={handleGitHubSignIn}
                disabled={loading || submitting}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                <GitHubIcon className="w-5 h-5" />
                {loading ? "جاري..." : "تسجيل الدخول بـ GitHub"}
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-slate-400 text-sm">أو</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <button
                onClick={() => setShowSignUp(true)}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                إنشاء حساب جديد
              </button>

              {/* Footer Info */}
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-indigo-800 text-sm mb-2">
                  مميزات الحساب:
                </h4>
                <ul className="space-y-1.5 text-indigo-700 text-xs">
                  <li>✓ حفظ تقدم الدراسي سحابياً</li>
                  <li>✓ المزامنة على جميع الأجهزة</li>
                  <li>✓ تتبع الإنجازات والنقاط</li>
                  <li>✓ الوصول للدروس المتقدمة</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-slate-50 border-t border-slate-100">
          <p className="text-center text-xs text-slate-400">
            مدرسة ألف © 2026 - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </>
  );
}
