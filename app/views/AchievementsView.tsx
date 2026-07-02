"use client";

import { useMemo } from "react";
import {
  Trophy,
  Star,
  Medal,
  Zap,
  Target,
  BookOpen,
  Flame,
  Crown,
  Rocket,
  Gem,
  CheckCircle2,
  Lock,
  ArrowRight,
  Award,
} from "lucide-react";

interface AchievementsViewProps {
  userData: {
    completedLessons: string[];
    xp: number;
  };
  onBack: () => void;
}

// Achievement definitions
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "lessons" | "xp" | "milestone";
  requirement: number;
  getValue(userData: { completedLessons: string[]; xp: number }): number;
  color: string;
  bgLight: string;
  borderColor: string;
}

const ACHIEVEMENTS: Achievement[] = [
  // Lesson completion achievements
  {
    id: "first-step",
    title: "أول خطوة",
    description: "أكمل أول درس لك",
    icon: BookOpen,
    category: "lessons",
    requirement: 1,
    getValue: (data) => data.completedLessons.length,
    color: "text-blue-600 dark:text-blue-400",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-700",
  },
  {
    id: "five-lessons",
    title: "متعلم نشيط",
    description: "أكمل 5 دروس",
    icon: BookOpen,
    category: "lessons",
    requirement: 5,
    getValue: (data) => data.completedLessons.length,
    color: "text-blue-600 dark:text-blue-400",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-700",
  },
  {
    id: "ten-lessons",
    title: "طالب مجتهد",
    description: "أكمل 10 دروس",
    icon: Medal,
    category: "lessons",
    requirement: 10,
    getValue: (data) => data.completedLessons.length,
    color: "text-indigo-600 dark:text-indigo-400",
    bgLight: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-700",
  },
  {
    id: "twenty-lessons",
    title: "متعلم متفاني",
    description: "أكمل 20 درس",
    icon: Trophy,
    category: "lessons",
    requirement: 20,
    getValue: (data) => data.completedLessons.length,
    color: "text-purple-600 dark:text-purple-400",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700",
  },
  {
    id: "thirty-lessons",
    title: "خبير متعلم",
    description: "أكمل 30 درس",
    icon: Crown,
    category: "lessons",
    requirement: 30,
    getValue: (data) => data.completedLessons.length,
    color: "text-amber-600 dark:text-amber-400",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-700",
  },
  // XP achievements
  {
    id: "xp-hunter-100",
    title: "جامع النقاط",
    description: "اجمع 100 نقطة خبرة",
    icon: Star,
    category: "xp",
    requirement: 100,
    getValue: (data) => data.xp,
    color: "text-amber-600 dark:text-amber-400",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-700",
  },
  {
    id: "xp-hunter-500",
    title: "صائد الخبرة",
    description: "اجمع 500 نقطة خبرة",
    icon: Star,
    category: "xp",
    requirement: 500,
    getValue: (data) => data.xp,
    color: "text-orange-600 dark:text-orange-400",
    bgLight: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-700",
  },
  {
    id: "xp-hunter-1000",
    title: "أسطورة الخبرة",
    description: "اجمع 1000 نقطة خبرة",
    icon: Zap,
    category: "xp",
    requirement: 1000,
    getValue: (data) => data.xp,
    color: "text-yellow-600 dark:text-yellow-400",
    bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-700",
  },
  {
    id: "xp-master-2500",
    title: "ماستر النقاط",
    description: "اجمع 2500 نقطة خبرة",
    icon: Zap,
    category: "xp",
    requirement: 2500,
    getValue: (data) => data.xp,
    color: "text-red-600 dark:text-red-400",
    bgLight: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-700",
  },
  {
    id: "xp-legends-5000",
    title: "أسطورة النقاط",
    description: "اجمع 5000 نقطة خبرة",
    icon: Crown,
    category: "xp",
    requirement: 5000,
    getValue: (data) => data.xp,
    color: "text-purple-600 dark:text-purple-400",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700",
  },
  // Milestone achievements
  {
    id: "on-fire",
    title: "على النار 🔥",
    description: "أكمل 3 دروس على الأقل",
    icon: Flame,
    category: "milestone",
    requirement: 3,
    getValue: (data) => data.completedLessons.length,
    color: "text-red-600 dark:text-red-400",
    bgLight: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-700",
  },
  {
    id: "speed-learner",
    title: "متعلم سريع ⚡",
    description: "أكمل 10 دروس واجمع 250 نقطة خبرة",
    icon: Rocket,
    category: "milestone",
    requirement: 10,
    getValue: (data) => {
      // Special check: both conditions must be met
      if (data.completedLessons.length >= 10 && data.xp >= 250) {
        return 1;
      }
      return 0;
    },
    color: "text-sky-600 dark:text-sky-400",
    bgLight: "bg-sky-50 dark:bg-sky-900/20",
    borderColor: "border-sky-200 dark:border-sky-700",
  },
  {
    id: "diamond-student",
    title: "طالب ألماسي 💎",
    description: "أكمل 20 درس واجمع 1000 نقطة خبرة",
    icon: Gem,
    category: "milestone",
    requirement: 20,
    getValue: (data) => {
      if (data.completedLessons.length >= 20 && data.xp >= 1000) {
        return 1;
      }
      return 0;
    },
    color: "text-cyan-600 dark:text-cyan-400",
    bgLight: "bg-cyan-50 dark:bg-cyan-900/20",
    borderColor: "border-cyan-200 dark:border-cyan-700",
  },
  {
    id: "perfect-10",
    title: "عشرة كاملة",
    description: "أكمل 10 دروس بالضبط",
    icon: Target,
    category: "milestone",
    requirement: 10,
    getValue: (data) => (data.completedLessons.length === 10 ? 1 : 0),
    color: "text-emerald-600 dark:text-emerald-400",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-700",
  },
];

export const AchievementsView = ({
  userData,
  onBack,
}: AchievementsViewProps) => {
  // Calculate achievement progress
  const achievementStatuses = useMemo(() => {
    return ACHIEVEMENTS.map((achievement) => {
      const currentValue = achievement.getValue(userData);
      const progress =
        achievement.category === "milestone"
          ? currentValue >= 1
            ? 100
            : 0
          : Math.min((currentValue / achievement.requirement) * 100, 100);

      const isUnlocked =
        achievement.category === "milestone"
          ? currentValue >= 1
          : currentValue >= achievement.requirement;

      return {
        achievement,
        currentValue:
          achievement.category === "milestone"
            ? currentValue >= 1
              ? currentValue
              : 0
            : currentValue,
        progress,
        isUnlocked,
      };
    });
  }, [userData]);

  // Calculate stats
  const stats = useMemo(() => {
    const unlocked = achievementStatuses.filter((s) => s.isUnlocked).length;
    const total = ACHIEVEMENTS.length;
    const percentage = Math.round((unlocked / total) * 100);

    return {
      unlocked,
      total,
      percentage,
      nextAchievements: achievementStatuses
        .filter((s) => !s.isUnlocked)
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 3),
    };
  }, [achievementStatuses]);

  // Group achievements by category
  const groupedAchievements = useMemo(() => {
    const groups = {
      lessons: [] as typeof achievementStatuses,
      xp: [] as typeof achievementStatuses,
      milestone: [] as typeof achievementStatuses,
    };

    achievementStatuses.forEach((status) => {
      groups[status.achievement.category].push(status);
    });

    return groups;
  }, [achievementStatuses]);

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "lessons":
        return "إنجازات إكمال الدروس";
      case "xp":
        return "إنجازات نقاط الخبرة";
      case "milestone":
        return "الإنجازات الخاصة";
      default:
        return "";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "lessons":
        return BookOpen;
      case "xp":
        return Star;
      case "milestone":
        return Award;
      default:
        return Trophy;
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium dark:text-slate-400"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة للرئيسية</span>
      </button>

      {/* Header */}
      <div className="bg-indigo-500 dark:bg-indigo-700 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black">الإنجازات</h2>
              <p className="text-indigo-100 text-sm">
                اكتشف إنجازاتك وحقق أهدافًا جديدة
              </p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-indigo-100">التقدم العام</span>
              <span className="text-2xl font-black">
                {stats.unlocked}/{stats.total}
              </span>
            </div>
            <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
              <div
                className="bg-linear-to-l from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <p className="text-indigo-100 text-xs mt-2">
              {stats.percentage}% من الإنجازات
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              إنجازات مفتوحة
            </span>
          </div>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.unlocked}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              إنجازات مقفلة
            </span>
          </div>
          <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
            {stats.total - stats.unlocked}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              نقاط الخبرة
            </span>
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {userData.xp}
          </p>
        </div>
      </div>

      {/* Next Achievements (Upcoming) */}
      {stats.nextAchievements.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 mb-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            إنجازات قريبة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.nextAchievements.map((status) => {
              const { achievement, currentValue, progress } = status;
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-2xl border ${achievement.borderColor} ${achievement.bgLight} dark:bg-opacity-10`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                      <Icon className={`w-5 h-5 ${achievement.color}`} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                        {achievement.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">
                      {Math.round(progress)}%
                    </span>
                    <span className="font-bold text-slate-600 dark:text-slate-300">
                      {currentValue}/{achievement.requirement}
                    </span>
                  </div>
                  <div className="w-full bg-white/50 dark:bg-slate-600/50 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progress > 75
                          ? "bg-linear-to-l from-emerald-400 to-emerald-500"
                          : progress > 40
                            ? "bg-linear-to-l from-amber-400 to-amber-500"
                            : "bg-linear-to-l from-slate-400 to-slate-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements by Category */}
      <div className="space-y-8">
        {Object.entries(groupedAchievements).map(([category, statuses]) => {
          if (statuses.length === 0) return null;
          const CategoryIcon = getCategoryIcon(category);

          return (
            <div key={category}>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                <CategoryIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                {getCategoryTitle(category)}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statuses.map((status) => {
                  const { achievement, currentValue, progress, isUnlocked } =
                    status;
                  const Icon = achievement.icon;

                  return (
                    <div
                      key={achievement.id}
                      className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                        isUnlocked
                          ? `${achievement.borderColor} ${achievement.bgLight} shadow-md hover:shadow-lg transform hover:-translate-y-1`
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70"
                      }`}
                    >
                      {/* Unlocked Badge */}
                      {isUnlocked && (
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`p-3 rounded-2xl shadow-sm ${
                            isUnlocked
                              ? "bg-white dark:bg-slate-700"
                              : "bg-slate-200 dark:bg-slate-700/50 grayscale"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              isUnlocked
                                ? achievement.color
                                : "text-slate-400 dark:text-slate-500"
                            }`}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <h4
                            className={`font-black text-base mb-1 ${
                              isUnlocked
                                ? "text-slate-800 dark:text-white"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                            {achievement.description}
                          </p>

                          {/* Progress */}
                          {!isUnlocked && (
                            <>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-slate-500 dark:text-slate-400">
                                  {Math.round(progress)}%
                                </span>
                                <span className="font-bold text-slate-600 dark:text-slate-300">
                                  {currentValue}/{achievement.requirement}
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-600 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    progress > 75
                                      ? "bg-linear-to-l from-emerald-400 to-emerald-500"
                                      : progress > 40
                                        ? "bg-linear-to-l from-amber-400 to-amber-500"
                                        : "bg-linear-to-l from-slate-400 to-slate-500"
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </>
                          )}

                          {/* Unlocked Text */}
                          {isUnlocked && (
                            <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                              تم الإنجاز ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
