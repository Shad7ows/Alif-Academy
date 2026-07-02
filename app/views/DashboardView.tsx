import { CHAPTERS } from "../chapters";
import { Star, Check, Lock } from "lucide-react";

interface DashboardViewProps {
  userData: {
    completedLessons: string[];
    xp: number;
  };
  openChapter: (index: number) => void;
}

export const DashboardView = ({
  userData,
  openChapter,
}: DashboardViewProps) => {
  // Calculate total progress
  const totalLessons = CHAPTERS.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const progressPerc =
    Math.round((userData.completedLessons.length / totalLessons) * 100) || 0;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-10 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10 text-center md:text-right">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
            تابع رحلتك البرمجية 🚀
          </h2>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${progressPerc}%` }}
            ></div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mt-2">
            أكملت {progressPerc}% من المنهج
          </p>
        </div>
        <div className="relative z-10 flex gap-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-6 py-4 rounded-2xl flex flex-col items-center min-w-30">
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

      <div className="space-y-6">
        {CHAPTERS.map((chapter, idx) => {
          // Check chapter progress
          const chapterCompleted = chapter.lessons.filter((l) =>
            userData.completedLessons.includes(l.id)
          ).length;
          const isFullyCompleted = chapterCompleted === chapter.lessons.length;
          // Lock logic: first chapter is unlocked. Next chapters unlock if previous is fully completed.
          const isLocked =
            idx > 0 &&
            CHAPTERS[idx - 1].lessons.filter((l) =>
              userData.completedLessons.includes(l.id)
            ).length !== CHAPTERS[idx - 1].lessons.length;
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
                    القسم {idx + 1}
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
