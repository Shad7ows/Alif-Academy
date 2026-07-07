"use client";

import { Star, Check, Lock, ArrowRight } from "lucide-react";
import React from "react";
import {
  LEVELS,
  getChaptersForLevel,
  getLevelCompletedCount,
} from "../chapters";

interface DashboardViewProps {
  userData: {
    completedLessons: string[];
    xp: number;
  };
  selectedLevel: string | null;
  openChapter: (chapterIndex: number) => void;
  onBackToLevels: () => void;
}

export const DashboardView = ({
  userData,
  selectedLevel,
  openChapter,
  onBackToLevels,
}: DashboardViewProps) => {
  // Get chapters for the selected level
  const chapters = selectedLevel
    ? getChaptersForLevel(selectedLevel)
    : LEVELS.flatMap((level) => getChaptersForLevel(level.id));

  // Get the selected level info
  const levelInfo = selectedLevel
    ? LEVELS.find((l) => l.id === selectedLevel)
    : null;

  // Calculate total progress for the level
  const totalLessons = chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const completedCount = getLevelCompletedCount(
    selectedLevel || "l1",
    userData.completedLessons
  );
  const progressPerc =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Lock logic: first chapter is unlocked, next chapters unlock if previous is fully completed
  const isChapterLocked = (idx: number): boolean => {
    if (idx === 0) return false;
    const prevChapter = chapters[idx - 1];
    return (
      prevChapter.lessons.filter((l) =>
        userData.completedLessons.includes(l.id)
      ).length !== prevChapter.lessons.length
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      {/* Back button and level header */}
      {levelInfo && (
        <div className="mb-8">
          <button
            onClick={onBackToLevels}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6 group"
          >
            <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">العودة للمستويات</span>
          </button>

          {/* Level Dashboard Header */}
          <div
            className={`${levelInfo.bgLight} dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group`}
          >
            <div
              className={`absolute -right-20 -top-20 w-64 h-64 bg-linear-to-br ${levelInfo.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}
            />
            <div className="relative z-10 text-center md:text-right">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-linear-to-br ${levelInfo.color} shadow-lg`}
                >
                  <levelInfo.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white">
                  {levelInfo.name}
                </h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-base mb-4">
                {levelInfo.description}
              </p>
              <div className="w-full max-w-md">
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div
                    className={`bg-linear-to-l ${levelInfo.color} h-full rounded-full transition-all duration-1000`}
                    style={{ width: `${progressPerc}%` }}
                  />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mt-2">
                  أكملت {progressPerc}% من مستوى {levelInfo.name}
                </p>
              </div>
            </div>
            <div className="relative z-10 flex gap-4">
              <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-6 py-4 rounded-2xl flex flex-col items-center">
                <Star className="text-amber-500 dark:text-amber-400 w-8 h-8 mb-1 fill-amber-500 dark:fill-amber-400" />
                <span className="text-2xl font-black text-amber-600 dark:text-amber-300">
                  {userData.xp}
                </span>
                <span className="text-amber-600/90 dark:text-amber-400/80 text-base font-bold">
                  نقطة خبرة
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapters List */}
      <div className="space-y-6">
        {chapters.map((chapter, idx) => {
          const chapterCompleted = chapter.lessons.filter((l) =>
            userData.completedLessons.includes(l.id)
          ).length;
          const isFullyCompleted = chapterCompleted === chapter.lessons.length;
          const isLocked = isChapterLocked(idx);
          const ChapterIcon = chapter.icon;

          return (
            <div
              key={chapter.id}
              className={`flex flex-col md:flex-row gap-6 items-center md:items-stretch group ${
                isLocked
                  ? "opacity-60 grayscale cursor-not-allowed"
                  : "cursor-pointer hover:-translate-y-1"
              } transition-all duration-300`}
              onClick={() => !isLocked && openChapter(idx)}
            >
              <div
                className={`w-24 h-24 rounded-3xl shrink-0 flex items-center justify-center shadow-lg border-4 z-10 transition-transform ${
                  isFullyCompleted
                    ? "bg-linear-to-br from-emerald-400 to-emerald-500 border-white text-white"
                    : isLocked
                    ? "bg-slate-200 dark:bg-slate-700 border-white dark:border-slate-600 text-slate-400 dark:text-slate-500"
                    : `bg-linear-to-br ${chapter.color} border-white text-white scale-110 shadow-xl`
                }`}
              >
                {isFullyCompleted ? (
                  <Check className="w-10 h-10 stroke-3" />
                ) : isLocked ? (
                  <Lock className="w-10 h-10" />
                ) : (
                  <ChapterIcon className="w-10 h-10" />
                )}
              </div>
              <div
                className={`flex-1 bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 w-full ${
                  !isLocked &&
                  "group-hover:border-indigo-300 dark:group-hover:border-indigo-600 group-hover:shadow-md"
                } transition-all`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-2 block uppercase tracking-wider">
                    {levelInfo ? `القسم ${idx + 1}` : `القسم ${idx + 1}`}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      isFullyCompleted
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {chapterCompleted} / {chapter.lessons.length} دروس
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                  {chapter.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                  {chapter.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
