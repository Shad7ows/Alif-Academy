"use client";

import type { LucideProps } from "lucide-react";
import { CheckCircle, ArrowRight, PlayCircle, Lock } from "lucide-react";
import { LEVELS, getChaptersForLevel } from "../chapters";

interface Quiz {
  question: string;
  code: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Lesson {
  id: string;
  title: string;
  icon: React.FC<LucideProps>;
  content: string;
  code: string;
  expectedOutput: string;
  quizzes: Quiz[];
}

interface ChapterViewProps {
  activeChapterIndex: number;
  userData: {
    completedLessons: string[];
    xp: number;
    currentStreak: number;
    lastActiveDate: string | null;
    longestStreak: number;
  };
  selectedLevel: string | null;
  startLesson: (index: number) => void;
  setView: (view: string) => void;
}

export const ChapterView = ({
  activeChapterIndex,
  userData,
  selectedLevel,
  startLesson,
  setView,
}: ChapterViewProps) => {
  // Get chapters for the selected level
  const chapters = selectedLevel
    ? getChaptersForLevel(selectedLevel)
    : LEVELS.flatMap((level) => getChaptersForLevel(level.id));

  const activeChapter = chapters[activeChapterIndex];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up pb-20">
      <button
        onClick={() => setView("dashboard")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors font-bold group dark:text-slate-400"
      >
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        العودة للمسارات
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-4xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-10 text-center">
        <div
          className={`w-20 h-20 mx-auto rounded-3xl mb-4 flex items-center justify-center bg-linear-to-br ${activeChapter.color} text-white shadow-lg`}
        >
          <activeChapter.icon className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
          {activeChapter.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          {activeChapter.description}
        </p>
      </div>

      <div className="relative pl-4 md:pl-0">
        {/* Timeline Line */}
        <div className="absolute right-10 md:right-1/2 top-4 bottom-4 w-1 bg-slate-200 dark:bg-slate-700 rounded-full transform md:translate-x-1/2"></div>

        <div className="space-y-12">
          {activeChapter.lessons.map((lesson: Lesson, idx: number) => {
            const isCompleted = userData.completedLessons.includes(lesson.id);
            const isLocked =
              idx > 0 &&
              !userData.completedLessons.includes(
                activeChapter.lessons[idx - 1].id
              );
            const LessonIcon = lesson.icon || PlayCircle;

            return (
              <div
                key={lesson.id}
                className="relative flex flex-col md:flex-row items-center justify-between group"
              >
                {/* Lesson Card */}
                <div
                  className={`w-full md:w-5/12 ${
                    idx % 2 !== 0 ? "md:order-3" : "md:order-1"
                  } ${
                    isLocked
                      ? "opacity-50"
                      : "cursor-pointer hover:-translate-y-1"
                  } transition-all`}
                  onClick={() => !isLocked && startLesson(idx)}
                >
                  <div
                    className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 shadow-sm flex items-center gap-4 ${
                      isLocked
                        ? "border-slate-100 dark:border-slate-700"
                        : isCompleted
                        ? "border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500"
                        : "border-indigo-200 dark:border-indigo-700 hover:border-indigo-400 dark:hover:border-indigo-500"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl ${
                        isCompleted
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                          : isLocked
                          ? "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                          : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isLocked ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        <LessonIcon className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                        الدرس {idx + 1}
                      </span>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                        {lesson.title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="absolute right-6 md:right-1/2 w-8 h-8 rounded-full border-4 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 shadow-md transform md:translate-x-1/2 order-2 z-10 flex items-center justify-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isCompleted
                        ? "bg-emerald-500"
                        : isLocked
                        ? "bg-slate-300 dark:bg-slate-500"
                        : "bg-indigo-500 animate-pulse"
                    }`}
                  ></div>
                </div>

                {/* Empty spacer for alternating layout */}
                <div
                  className={`hidden md:block w-5/12 ${
                    idx % 2 !== 0 ? "order-1" : "order-3"
                  }`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
