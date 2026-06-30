"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardView } from "./views/DashboardView";
import { ChapterView } from "./views/ChapterView";
import { LessonView } from "./views/LessonView";
import { QuizView } from "./views/QuizView";
import { SideMenu } from "./components/SideMenu";
import { CHAPTERS } from "./chapters";
import { TerminalSquare, Trophy, Star, Menu, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";

export default function AlifProPlatform() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    userData,
    loading: progressLoading,
    error: progressError,
    completeLesson,
  } = useUserProgress(user?.id ?? null);
  const [view, setView] = useState("dashboard"); // dashboard, chapter, lesson, quiz
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ التحقق من المصادقة بعد hydration
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, authLoading, router]);

  // ✅ دالة إكمال الدرس المزامنة مع السيرفر
  const handleLessonComplete = useCallback(() => {
    setView("quiz");
    window.scrollTo(0, 0);
  }, []);

  const handleQuizSuccess = useCallback(
    (lessonId: string) => {
      // إرسال التقدم للسيرفر عبر completeLesson
      completeLesson(lessonId, 25);
      setView("chapter"); // Return to chapter timeline
      window.scrollTo(0, 0);
    },
    [completeLesson]
  );

  // عرض حالة التحميل
  if (authLoading || progressLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-50"
        dir="rtl"
      >
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // عرض خطأ إذا وجد
  if (progressError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-50"
        dir="rtl"
      >
        <div className="text-center max-w-md px-6">
          <p className="text-rose-600 font-bold mb-2">خطأ في تحميل البيانات</p>
          <p className="text-slate-500 text-sm">{progressError}</p>
          <p className="text-slate-400 text-xs mt-4">
            يمكنك استيراد بياناتك من{" "}
            <a href="/import-data" className="text-indigo-600 underline">
              صفحة الاستيراد
            </a>
          </p>
        </div>
      </div>
    );
  }

  const activeChapter = CHAPTERS[activeChapterIndex];
  const activeLesson = activeChapter?.lessons[activeLessonIndex];

  // Navigation Helpers
  const openChapter = (index: number) => {
    setActiveChapterIndex(index);
    setView("chapter");
    window.scrollTo(0, 0);
  };

  const startLesson = (index: number) => {
    setActiveLessonIndex(index);
    setView("lesson");
    window.scrollTo(0, 0);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen selection:bg-indigo-200 selection:text-indigo-900 pb-20"
    >
      {/* Side Menu */}
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        xp={userData.xp}
        completedLessons={userData.completedLessons.length}
      />

      <header className="bg-white/40 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 mb-8">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setView("dashboard")}
          >
            <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-md transform -rotate-6">
              <TerminalSquare className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black tracking-tight text-slate-800">
                مدرسة<span className="text-indigo-600"> ألف </span>
              </h1>
              <p className="text-indigo-600 text-xs font-medium pr-1">
                إبدأ رحلة تعلم البرمجة بالعربية مع النسخة 5.3 من لغة ألف
              </p>
            </div>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </button>

          {/* Desktop Stats + Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 font-bold text-slate-700 text-sm">
              <div className="flex items-center gap-1.5 text-orange-600">
                <Star className="w-4 h-4 fill-orange-500" /> {userData.xp}
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <Trophy className="w-4 h-4" />{" "}
                {userData.completedLessons.length} دروس مكتملة
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-700" />
            </button>
          </div>
        </div>
      </header>
      <main className="px-6">
        {view === "dashboard" && (
          <DashboardView userData={userData} openChapter={openChapter} />
        )}
        {view === "chapter" && (
          <ChapterView
            activeChapterIndex={activeChapterIndex}
            userData={userData}
            CHAPTERS={CHAPTERS}
            startLesson={startLesson}
            setView={setView}
          />
        )}
        {view === "lesson" && (
          <LessonView
            activeChapter={activeChapter}
            activeLesson={activeLesson}
            activeLessonIndex={activeLessonIndex}
            onComplete={handleLessonComplete}
            setView={setView}
          />
        )}
        {view === "quiz" && (
          <QuizView
            activeLesson={activeLesson}
            handleQuizSuccess={() => handleQuizSuccess(activeLesson.id)}
            setView={setView}
          />
        )}
      </main>
    </div>
  );
}
