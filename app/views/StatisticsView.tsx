"use client";

import { LEVELS, getChaptersForLevel } from "../chapters";
import {
  Star,
  Trophy,
  Target,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useMemo } from "react";

interface StatisticsViewProps {
  userData: {
    completedLessons: string[];
    xp: number;
  };
  onBack: () => void;
}

export const StatisticsView = ({ userData, onBack }: StatisticsViewProps) => {
  // Get all chapters from all levels
  const allChapters = useMemo(
    () => LEVELS.flatMap((level) => getChaptersForLevel(level.id)),
    []
  );

  // Calculate total lessons
  const totalLessons = allChapters.reduce(
    (acc, ch) => acc + ch.lessons.length,
    0
  );

  // Overall statistics
  const stats = useMemo(
    () => ({
      totalLessons,
      completedLessons: userData.completedLessons.length,
      xp: userData.xp,
      progressPercentage:
        totalLessons > 0
          ? Math.round((userData.completedLessons.length / totalLessons) * 100)
          : 0,
      remainingLessons: totalLessons - userData.completedLessons.length,
    }),
    [totalLessons, userData.completedLessons, userData.xp]
  );

  // Chapter-wise statistics
  const chapterStats = useMemo(() => {
    return allChapters.map((chapter) => {
      const completed = chapter.lessons.filter((l) =>
        userData.completedLessons.includes(l.id)
      ).length;
      const total = chapter.lessons.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        id: chapter.id,
        title: chapter.title,
        icon: chapter.icon,
        color: chapter.color,
        bgLight: chapter.bgLight,
        textDark: chapter.textDark,
        completed,
        total,
        percentage,
      };
    });
  }, [userData.completedLessons, allChapters]);

  // Lesson completion details per chapter
  const lessonDetails = useMemo(() => {
    return allChapters.map((chapter) => {
      const lessons = chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        completed: userData.completedLessons.includes(lesson.id),
      }));

      return {
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        lessons,
      };
    });
  }, [userData.completedLessons, allChapters]);

  // Streak calculation (mock - since we don't have date tracking in detail)
  const currentStreak = useMemo(() => {
    // Simple mock: calculate based on completed lessons
    return Math.min(stats.completedLessons * 2, 30);
  }, [stats.completedLessons]);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium dark:text-slate-400"
      >
        <span>→</span>
        <span>العودة للرئيسية</span>
      </button>

      {/* Header */}
      <div className="bg-indigo-500 dark:bg-indigo-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black">الإحصائيات</h2>
            <p className="text-indigo-100 text-sm">تتبع تقدمك في رحلة التعلم</p>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-black">{stats.completedLessons}</p>
            <p className="text-indigo-100 text-xs">دروس مكتملة</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-amber-400 fill-amber-300" />
            <p className="text-2xl font-black">{stats.xp}</p>
            <p className="text-indigo-100 text-xs">نقطة خبرة</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <p className="text-2xl font-black">{stats.progressPercentage}%</p>
            <p className="text-indigo-100 text-xs">نسبة الإكمال</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-sky-400" />
            <p className="text-2xl font-black">{currentStreak}</p>
            <p className="text-indigo-100 text-xs">سلسلة الأيام</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 mb-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          نظرة عامة على التقدم
        </h3>

        {/* Main Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
              التقدم الكلي
            </span>
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
              {stats.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-4 rounded-full overflow-hidden">
            <div
              className="bg-linear-to-l from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${stats.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">
              {stats.completedLessons}
            </p>
            <p className="text-emerald-600/70 dark:text-emerald-400/70 text-xs">
              مكتمل
            </p>
          </div>
          <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
            <Circle className="w-8 h-8 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
            <p className="text-xl font-black text-amber-700 dark:text-amber-300">
              {stats.remainingLessons}
            </p>
            <p className="text-amber-600/70 dark:text-amber-400/70 text-xs">
              متبقي
            </p>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
            <Target className="w-8 h-8 mx-auto mb-2 text-slate-600 dark:text-slate-300" />
            <p className="text-xl font-black text-slate-700 dark:text-slate-200">
              {stats.totalLessons}
            </p>
            <p className="text-slate-600/70 dark:text-slate-400/70 text-xs">
              الإجمالي
            </p>
          </div>
        </div>
      </div>

      {/* Chapter Statistics */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 mb-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          إحصائيات الأقسام
        </h3>

        <div className="space-y-5">
          {chapterStats.map((chapter) => {
            const ChapterIcon = chapter.icon;
            return (
              <div key={chapter.id} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 ${chapter.bgLight} dark:bg-slate-700 rounded-xl`}
                    >
                      <ChapterIcon
                        className={`w-5 h-5 ${chapter.textDark} dark:text-slate-300`}
                      />
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {chapter.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      {chapter.completed}/{chapter.total} دروس
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        chapter.percentage === 100
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {chapter.percentage}%
                    </span>
                  </div>
                </div>

                {/* Chapter Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      chapter.percentage === 100
                        ? "bg-linear-to-l from-emerald-400 to-emerald-500"
                        : `bg-linear-to-l ${chapter.color}`
                    }`}
                    style={{ width: `${chapter.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson Details */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          تفاصيل الدروس
        </h3>

        <div className="space-y-6">
          {lessonDetails.map((detail) => (
            <div key={detail.chapterId}>
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3 text-sm">
                {detail.chapterTitle}
              </h4>
              <div className="flex flex-wrap gap-2">
                {detail.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      lesson.completed
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700"
                        : "bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600"
                    }`}
                  >
                    {lesson.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    )}
                    <span className="truncate max-w-37.5">{lesson.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
