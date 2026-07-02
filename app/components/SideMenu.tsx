"use client";

import { useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  X,
  Star,
  Trophy,
  LogOut,
  User,
  Mail,
  TerminalSquare,
  Settings,
  Medal,
  BarChart3,
  HelpCircle,
  Info,
} from "lucide-react";
import Image from "next/image";
import KoFiCOIN from "@/assets/icons/Ko-fi_COIN.gif";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  xp?: number;
  completedLessons?: number;
  onNavigateToStatistics?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToSettings?: () => void;
}

export function SideMenu({
  isOpen,
  onClose,
  xp = 0,
  completedLessons = 0,
  onNavigateToStatistics,
  onNavigateToProfile,
  onNavigateToSettings,
}: SideMenuProps) {
  const { user, loading, signOut } = useAuth();

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

  const handleSignOut = useCallback(async () => {
    await signOut();
    onClose();
  }, [signOut, onClose]);

  // Get user display name and avatar
  const getDisplayName = (): string => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split("@")[0] || "المستخدم";
  };

  const getAvatarInitial = (): string => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.charAt(0);
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const getUserAvatarUrl = (): string | null => {
    return user?.user_metadata?.avatar_url || null;
  };

  // Only show menu when user is logged in
  if (!user) {
    return null;
  }

  const avatarUrl = getUserAvatarUrl();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white dark:bg-slate-800 shadow-2xl z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full shadow-none"
        }`}
      >
        {/* Header Section - Light Blue */}
        <div className="relative bg-indigo-600 p-6 pb-16 overflow-hidden rounded-b-4xl">
          {/* Header Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                {/* Black Code Icon */}
                <div className=" transition-transform -rotate-10 bg-white/25 backdrop-blur-sm p-2.5 rounded-xl shadow-lg border border-white/20">
                  <TerminalSquare className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wide">
                    مدرسة ألف
                  </h2>
                  <p className="text-sky-100 text-xs font-medium mt-0.5">
                    تعلم البرمجة بالعربي مع ألف نـ5
                  </p>
                </div>
              </div>
              {/* Exit Button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 border border-white/10"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* User Info Card - Overlapping Header */}
        <div className="relative -mt-12 px-6">
          <div className="bg-white/85 dark:bg-slate-700/85 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-600 p-5 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              {/* Circular Avatar */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-md ring-4 ring-white">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xl font-bold">
                      {getAvatarInitial()}
                    </span>
                  )}
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg truncate mb-1">
                  {getDisplayName()}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg">
                  <Star className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                  <span className="font-bold text-amber-700 dark:text-amber-300 text-sm">
                    {xp} نقطة
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg">
                  <Trophy className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                    {completedLessons} دروس مكتملة
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items - Scrollable Container */}
        <div className="px-6 pt-12 pb-36 overflow-y-auto flex flex-col space-y-3 h-[calc(100svh-14rem)] side-menu-scroll">
          {/* الملف الشخصي Button */}
          <button
            onClick={() => {
              onNavigateToProfile?.();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-100/80 dark:bg-slate-700/50 hover:bg-sky-50 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 text-slate-700 dark:text-slate-200 font-medium border border-transparent hover:border-sky-100 dark:border-slate-600 group"
          >
            <div className="p-2 bg-slate-200/50 dark:bg-slate-600 group-hover:bg-sky-100 dark:group-hover:bg-slate-500 rounded-lg transition-colors">
              <User className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400" />
            </div>
            <span>الملف الشخصي</span>
          </button>

          {/* زر الإعدادات */}
          <button
            onClick={() => {
              onNavigateToSettings?.();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-100/80 dark:bg-slate-700/50 hover:bg-sky-50 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 text-slate-700 dark:text-slate-200 font-medium border border-transparent hover:border-sky-100 dark:border-slate-600 group"
          >
            <div className="p-2 bg-slate-200/50 dark:bg-slate-600 group-hover:bg-sky-100 dark:group-hover:bg-slate-500 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400" />
            </div>
            <span>الإعدادات</span>
          </button>

          {/* زر الإنجازات/الشهادات */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-100/80 dark:bg-slate-700/50 hover:bg-sky-50 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 text-slate-700 dark:text-slate-200 font-medium border border-transparent hover:border-sky-100 dark:border-slate-600 group">
            <div className="p-2 bg-slate-200/50 dark:bg-slate-600 group-hover:bg-sky-100 dark:group-hover:bg-slate-500 rounded-lg transition-colors">
              <Medal className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400" />
            </div>
            <span>الإنجازات</span>
          </button>

          {/* زر الإحصائيات */}
          <button
            onClick={onNavigateToStatistics}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-100/80 dark:bg-slate-700/50 hover:bg-sky-50 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 text-slate-700 dark:text-slate-200 font-medium border border-transparent hover:border-sky-100 dark:border-slate-600 group"
          >
            <div className="p-2 bg-slate-200/50 dark:bg-slate-600 group-hover:bg-sky-100 dark:group-hover:bg-slate-500 rounded-lg transition-colors">
              <BarChart3 className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400" />
            </div>
            <span>الإحصائيات</span>
          </button>

          {/* زر المساعدة/الدعم */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-100/80 dark:bg-slate-700/50 hover:bg-sky-50 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 text-slate-700 dark:text-slate-200 font-medium border border-transparent hover:border-sky-100 dark:border-slate-600 group">
            <div className="p-2 bg-slate-200/50 dark:bg-slate-600 group-hover:bg-sky-100 dark:group-hover:bg-slate-500 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400" />
            </div>
            <span>المساعدة</span>
          </button>

          {/* زر حول التطبيق */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-100/80 dark:bg-slate-700/50 hover:bg-sky-50 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 text-slate-700 dark:text-slate-200 font-medium border border-transparent hover:border-sky-100 dark:border-slate-600 group">
            <div className="p-2 bg-slate-200/50 dark:bg-slate-600 group-hover:bg-sky-100 dark:group-hover:bg-slate-500 rounded-lg transition-colors">
              <Info className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400" />
            </div>
            <span>حول التطبيق</span>
          </button>

          {/* Spacer to push the Bottom Section to the bottom */}
          <div className="flex-1 " />

          {/* Bottom Section */}
          <div className="pt-7 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
            {/* Ko-fi Button */}
            <a
              href="https://ko-fi.com/aliflang"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl font-medium transition-all duration-200 mb-4 border border-orange-100 dark:border-orange-800 hover:border-orange-200 dark:hover:border-orange-700 group"
            >
              <Image
                src={KoFiCOIN}
                alt="Ko-fi"
                width={20}
                height={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span>ادعمنا على Ko-fi</span>
            </a>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 border border-rose-100 dark:border-red-800 hover:border-rose-200 dark:hover:border-red-700 group"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          dir="ltr"
          className="absolute bottom-0 left-0 right-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 pt-4 pb-4"
        >
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            © 2026 مدرسة ألف - جميع الحقوق محفوظة لصالح منظمة ألف
          </p>
        </div>
      </div>
    </>
  );
}
