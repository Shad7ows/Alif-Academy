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
}

export function SideMenu({
  isOpen,
  onClose,
  xp = 0,
  completedLessons = 0,
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
        className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out ${
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
          <div className="bg-white/85 rounded-2xl shadow-lg border border-slate-100 p-5 backdrop-blur-sm">
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
                <h3 className="font-bold text-slate-800 text-lg truncate mb-1">
                  {getDisplayName()}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-amber-700 text-sm">
                    {xp} نقطة
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg">
                  <Trophy className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-emerald-700 text-sm">
                    {completedLessons} دروس مكتملة
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-6 pt-12 space-y-3">
          {/* الملف الشخصي Button */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-100/80 hover:bg-sky-50 rounded-xl transition-all duration-200 text-slate-700 font-medium border border-transparent hover:border-sky-100 group">
            <div className="p-2 bg-slate-200/50 group-hover:bg-sky-100 rounded-lg transition-colors">
              <User className="w-5 h-5 text-slate-500 group-hover:text-sky-600" />
            </div>
            <span>الملف الشخصي</span>
          </button>

          {/* زر الإعدادات */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-100/80 hover:bg-sky-50 rounded-xl transition-all duration-200 text-slate-700 font-medium border border-transparent hover:border-sky-100 group">
            <div className="p-2 bg-slate-200/50 group-hover:bg-sky-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-slate-500 group-hover:text-sky-600" />
            </div>
            <span>الإعدادات</span>
          </button>

          {/* زر الإنجازات/الشهادات */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-100/80 hover:bg-sky-50 rounded-xl transition-all duration-200 text-slate-700 font-medium border border-transparent hover:border-sky-100 group">
            <div className="p-2 bg-slate-200/50 group-hover:bg-sky-100 rounded-lg transition-colors">
              <Medal className="w-5 h-5 text-slate-500 group-hover:text-sky-600" />
            </div>
            <span>الإنجازات</span>
          </button>

          {/* زر الإحصائيات */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-100/80 hover:bg-sky-50 rounded-xl transition-all duration-200 text-slate-700 font-medium border border-transparent hover:border-sky-100 group">
            <div className="p-2 bg-slate-200/50 group-hover:bg-sky-100 rounded-lg transition-colors">
              <BarChart3 className="w-5 h-5 text-slate-500 group-hover:text-sky-600" />
            </div>
            <span>الإحصائيات</span>
          </button>

          {/* زر المساعدة/الدعم */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-100/80 hover:bg-sky-50 rounded-xl transition-all duration-200 text-slate-700 font-medium border border-transparent hover:border-sky-100 group">
            <div className="p-2 bg-slate-200/50 group-hover:bg-sky-100 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5 text-slate-500 group-hover:text-sky-600" />
            </div>
            <span>المساعدة</span>
          </button>

          {/* زر حول التطبيق */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-100/80 hover:bg-sky-50 rounded-xl transition-all duration-200 text-slate-700 font-medium border border-transparent hover:border-sky-100 group">
            <div className="p-2 bg-slate-200/50 group-hover:bg-sky-100 rounded-lg transition-colors">
              <Info className="w-5 h-5 text-slate-500 group-hover:text-sky-600" />
            </div>
            <span>حول التطبيق</span>
          </button>
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-15 left-0 right-0 px-6 py-4 bg-linear-to-t from-white via-white to-transparent pt-12">
          {/* Ko-fi Button */}
          <a
            href="https://ko-fi.com/aliflang"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl font-medium transition-all duration-200 mb-4 border border-orange-100 hover:border-orange-200 group"
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 border border-rose-100 hover:border-rose-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>تسجيل الخروج</span>
          </button>
        </div>

        {/* Footer */}
        <div
          dir="ltr"
          className="absolute bottom-0 left-0 right-0 bg-slate-50 border-t border-slate-100 pt-4 pb-4"
        >
          <p className="text-center text-xs text-slate-400">
            © 2026 مدرسة ألف - جميع الحقوق محفوظة لصالح منظمة ألف
          </p>
        </div>
      </div>
    </>
  );
}
