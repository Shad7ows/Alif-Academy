"use client";

import {
  Check,
  Lock,
  ArrowLeft,
  BookOpen,
  Lightbulb,
  Copy,
  Check as CheckIcon,
  Clock,
  Trophy,
} from "lucide-react";
import {
  LEVELS,
  getChaptersForLevel,
  getLevelLessonCount,
  getLevelCompletedCount,
} from "../chapters";
import { getDailyTip } from "../data/daily-tips";
import { useState } from "react";

interface LevelViewProps {
  userData: {
    completedLessons: string[];
    xp: number;
    currentStreak: number;
    lastActiveDate: string | null;
    longestStreak: number;
  };
  openLevel: (levelId: string) => void;
}

/**
 * Get the unlock threshold message for a level
 */
function getUnlockMessage(levelId: string, completedLessons: string[]): string {
  if (levelId === "l1") return "دائماً مفتوح";

  const prevLevel = levelId === "l2" ? "l1" : "l2";
  const totalLessons = getLevelLessonCount(prevLevel);
  const completed = getLevelCompletedCount(prevLevel, completedLessons);
  const percentage =
    totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

  const threshold = LEVELS.find((l) => l.id === levelId)?.unlockThreshold || 0;
  const remaining = threshold - percentage >= 0 ? threshold - percentage : 0;

  return `يتطلب إكمال ${remaining}% من المستوى السابق`;
}

/**
 * Check if a level is unlocked based on user progress
 */
function isLevelUnlocked(levelId: string, completedLessons: string[]): boolean {
  if (levelId === "l1") return true;

  // delete to open levels 2 nad 3
  if (levelId === "l2" || levelId === "l3") return false; // لفتح قفل المستوى الثاني والثالث فقط قم بحذف هذا السطر

  const prevLevelId = levelId === "l2" ? "l1" : "l2";
  const prevLevelThreshold =
    LEVELS.find((l) => l.id === levelId)?.unlockThreshold || 0;

  const prevLevelTotal = getLevelLessonCount(prevLevelId);
  const prevLevelCompleted = getLevelCompletedCount(
    prevLevelId,
    completedLessons
  );

  if (prevLevelTotal === 0) return false;

  const prevLevelPercentage = (prevLevelCompleted / prevLevelTotal) * 100;
  return prevLevelPercentage >= prevLevelThreshold;
}

/**
 * Calculate progress for a specific level
 */
function calculateLevelProgress(levelId: string, completedLessons: string[]) {
  const chapters = getChaptersForLevel(levelId);
  const levelLessonIds = new Set(
    chapters.flatMap((ch) => ch.lessons.map((l) => l.id))
  );

  const total = levelLessonIds.size;
  const completed = completedLessons.filter((id) =>
    levelLessonIds.has(id)
  ).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}

/**
 * Get the next unfinished lesson for a level
 */
function getNextLesson(
  levelId: string,
  completedLessons: string[]
): { id: string; title: string } | null {
  const chapters = getChaptersForLevel(levelId);
  const allLessons = chapters.flatMap((ch) => ch.lessons);

  // Find first lesson that hasn't been completed
  const firstLesson = allLessons.find(
    (l: { id: string; title: string }) => !completedLessons.includes(l.id)
  );
  return firstLesson || null;
}

/**
 * Check if all lessons across all levels are completed
 */
function areAllLessonsCompleted(completedLessons: string[]): boolean {
  const allChapters = LEVELS.flatMap((level) => getChaptersForLevel(level.id));
  const allLessons = allChapters.flatMap((ch) => ch.lessons);
  const totalLessons = allLessons.length;

  // Count unique completed lessons that exist in the curriculum
  const validCompletedLessons = completedLessons.filter((id) =>
    allLessons.some((l) => l.id === id)
  );

  return validCompletedLessons.length >= totalLessons && totalLessons > 0;
}

export const LevelView = ({ userData, openLevel }: LevelViewProps) => {
  const completedLessons = userData.completedLessons;

  // Calculate progress for each level
  const levelProgress = LEVELS.map((level) =>
    calculateLevelProgress(level.id, completedLessons)
  );

  // Check unlock status for each level
  const levelUnlocked = LEVELS.map((level) =>
    isLevelUnlocked(level.id, completedLessons)
  );

  // Get unlock messages
  const unlockMessages = LEVELS.map((level) =>
    getUnlockMessage(level.id, completedLessons)
  );

  // Get next lesson for the first unlocked level
  const firstUnlockedLevelId =
    LEVELS.find((_, i) => levelUnlocked[i])?.id || "l1";
  const nextLesson = getNextLesson(firstUnlockedLevelId, completedLessons);

  // Check if all lessons are completed
  const allCompleted = areAllLessonsCompleted(completedLessons);

  // Get last completed lesson from all levels
  const allChapters = LEVELS.flatMap((level) => getChaptersForLevel(level.id));
  const allLessons = allChapters.flatMap((ch) => ch.lessons);
  const lastCompletedLesson =
    [...allLessons]
      .reverse()
      .find((l: { id: string; title: string }) =>
        completedLessons.includes(l.id)
      ) || null;

  // Daily tip
  const dailyTip = getDailyTip();
  const [copied, setCopied] = useState(false);

  const handleCopyTip = () => {
    navigator.clipboard.writeText(dailyTip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get current date in Arabic format
  const today = new Date();
  const arabicDate = today.toLocaleDateString("ar-SA", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-20">
      {/* عنوان الصفحة */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-black dark:text-white text-slate-800 mb-4">
          هنا تبدأ رحلتك في عالم البرمجة بالعربية 🚀
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-xl max-w-2xl mx-auto">
          الرحلة تبدأ هنا ولكنها لا تنتهي في هذا المكان
        </p>
      </div>

      {/* بطاقات المستويات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {LEVELS.map((level, index) => {
          const CardIcon = level.icon;
          const progress = levelProgress[index];
          const unlocked = levelUnlocked[index];

          return (
            <div
              key={level.id}
              onClick={unlocked ? () => openLevel(level.id) : undefined}
              className={`relative rounded-3xl p-8 shadow-sm border transition-all duration-500 min-h-90 flex flex-col ${
                unlocked
                  ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-600"
                  : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-70"
              }`}
            >
              {/* شريط التقدم في الأعلى */}
              {unlocked && progress.total > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      التقدم
                    </span>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                      {progress.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 bg-linear-to-l ${level.color}`}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* علامة القفل */}
              {!unlocked && (
                <div className="absolute top-6 left-6">
                  <span className="bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold px-4 py-1.5 rounded-full">
                    قريباً
                  </span>
                </div>
              )}

              {/* أيقونة المستوى */}
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
                  unlocked
                    ? `bg-linear-to-br ${level.color} shadow-lg`
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                {unlocked ? (
                  <CardIcon className="w-10 h-10 text-white" />
                ) : (
                  <Lock className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                )}
              </div>

              {/* معلومات المستوى */}
              <div className="mb-4 flex-1">
                <span
                  className={`text-xs font-bold uppercase tracking-wider mb-2 block ${
                    unlocked
                      ? "text-indigo-500 dark:text-indigo-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {unlocked ? `المستوى ${index + 1}` : "مقفل"}
                </span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-3">
                  {level.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                  {level.description}
                </p>
              </div>

              {/* إحصائيات المستوى */}
              {unlocked && progress.total > 0 && (
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {progress.completed}
                    </span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-slate-400" />
                    <span className="text-base font-bold text-slate-600 dark:text-slate-400">
                      {progress.total} درس
                    </span>
                  </div>
                </div>
              )}

              {/* رسالة فتح المستوى */}
              {!unlocked && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    {unlockMessages[index]}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* بطاقة الإكمال والنصيحة اليومية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* بطاقة أكمل تعلمك أو رسالة التهنئة */}
        {!allCompleted && nextLesson && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-2xl">
                <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">
                أكمل تعلمك
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  الدرس التالي:
                </p>
                <p className="font-bold text-slate-800 dark:text-white text-lg truncate">
                  {nextLesson.title}
                </p>
                {lastCompletedLesson && (
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    آخر درس أكملته: {lastCompletedLesson.title}
                  </p>
                )}
              </div>
              <button
                onClick={() => openLevel(firstUnlockedLevelId)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-colors whitespace-nowrap shadow-md hover:shadow-lg"
              >
                أكمل الآن
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* رسالة مبروك عند إكمال جميع الدروس */}
        {allCompleted && (
          <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-lg border border-emerald-400 dark:border-emerald-500">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-white/20 p-4 rounded-full">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white">🎉 مبروك!</h3>
              <p className="text-white/90 text-lg font-bold">
                لقد أتممت جميع الدروس!
              </p>
              <p className="text-white/80 text-sm">
                أنت بطل حقيقي في عالم البرمجة
              </p>
            </div>
          </div>
        )}

        {/* النصيحة اليومية */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-2xl">
                <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">
                  نصيحة اليوم
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{arabicDate}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCopyTip}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              title="نسخ النصيحة"
            >
              {copied ? (
                <CheckIcon className="w-5 h-5 text-emerald-500" />
              ) : (
                <Copy className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              )}
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed pt-7">
            {dailyTip}
          </p>
        </div>
      </div>
    </div>
  );
};
