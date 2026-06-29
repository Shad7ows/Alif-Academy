"use client";

import { useState, useEffect } from "react";
import { CHAPTERS } from "./chapters";
import { AlifIDE } from "./components/AlifIDE";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  ChevronRight,
  TerminalSquare,
  Trophy,
  Star,
  ArrowLeft,
  Check,
  PlayCircle,
  Lock,
} from "lucide-react";

const formatContent = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-slate-800 font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="bg-slate-100 text-indigo-600 px-1.5 py-0.5 mx-1 rounded font-mono text-sm md:text-base border border-slate-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return (
      <span key={i} className="whitespace-pre-wrap">
        {part}
      </span>
    );
  });
};

interface UserData {
  completedLessons: string[];
  xp: number;
}

export default function AlifProPlatform() {
  const [view, setView] = useState("dashboard"); // dashboard, chapter, lesson, quiz
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    completedLessons: [],
    xp: 0,
  });

  // Load from localStorage AFTER hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem("alifProV3Data");
      if (saved) setUserData(JSON.parse(saved));
    } catch (e) {
      console.error("Error loading save data", e);
    }
  }, []);

  // Save user data
  useEffect(() => {
    try {
      localStorage.setItem("alifProV3Data", JSON.stringify(userData));
    } catch (e) {
      console.error("Error saving data", e);
    }
  }, [userData]);

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

  const handleLessonComplete = () => {
    setView("quiz");
    window.scrollTo(0, 0);
  };

  const handleQuizSuccess = () => {
    const isAlreadyCompleted = userData.completedLessons.includes(
      activeLesson.id
    );
    if (!isAlreadyCompleted) {
      setUserData((prev: UserData) => ({
        ...prev,
        completedLessons: [...prev.completedLessons, activeLesson.id],
        xp: prev.xp + 25, // 25 XP per lesson
      }));
    }
    setView("chapter"); // Return to chapter timeline
    window.scrollTo(0, 0);
  };

  const DashboardView = () => {
    // Calculate total progress
    const totalLessons = CHAPTERS.reduce(
      (acc, ch) => acc + ch.lessons.length,
      0
    );
    const progressPerc =
      Math.round((userData.completedLessons.length / totalLessons) * 100) || 0;

    return (
      <div className="max-w-4xl mx-auto animate-fade-in pb-20">
        <div className="bg-white rounded-3xl p-8 mb-10 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-linear-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 text-center md:text-right">
            <h2 className="text-3xl font-black text-slate-800 mb-2">
              تابع رحلتك البرمجية 🚀
            </h2>
            <div className="w-full bg-slate-100 h-3 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressPerc}%` }}
              ></div>
            </div>
            <p className="text-slate-500 text-sm font-bold mt-2">
              أكملت {progressPerc}% من المنهج
            </p>
          </div>
          <div className="relative z-10 flex gap-4">
            <div className="bg-amber-50 border border-amber-200 px-6 py-4 rounded-2xl flex flex-col items-center min-w-30">
              <Star className="text-amber-500 w-8 h-8 mb-1 fill-amber-500" />
              <span className="text-2xl font-black text-amber-600">
                {userData.xp}
              </span>
              <span className="text-amber-700/70 text-sm font-bold">
                نقطة (XP)
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
            const isFullyCompleted =
              chapterCompleted === chapter.lessons.length;
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
                      ? "bg-slate-200 border-white text-slate-400"
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
                  className={`flex-1 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 w-full ${
                    !isLocked &&
                    "group-hover:border-indigo-300 group-hover:shadow-md"
                  } transition-all`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-slate-400 mb-2 block uppercase tracking-wider">
                      القسم {idx + 1}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isFullyCompleted
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {chapterCompleted} / {chapter.lessons.length} دروس
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">
                    {chapter.title}
                  </h3>
                  <p className="text-slate-500 text-lg leading-relaxed">
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

  const ChapterView = () => {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in-up pb-20">
        <button
          onClick={() => setView("dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-bold group"
        >
          <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
          العودة للمسار{" "}
        </button>

        <div className="bg-white rounded-4xl p-8 shadow-sm border border-slate-200 mb-10 text-center">
          <div
            className={`w-20 h-20 mx-auto rounded-3xl mb-4 flex items-center justify-center bg-linear-to-br ${activeChapter.color} text-white shadow-lg`}
          >
            <activeChapter.icon className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">
            {activeChapter.title}
          </h1>
          <p className="text-slate-500 text-lg">{activeChapter.description}</p>
        </div>

        <div className="relative pl-4 md:pl-0">
          {/* Timeline Line */}
          <div className="absolute right-10 md:right-1/2 top-4 bottom-4 w-1 bg-slate-200 rounded-full transform md:translate-x-1/2"></div>

          <div className="space-y-12">
            {activeChapter.lessons.map((lesson, idx) => {
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
                      className={`bg-white p-5 rounded-2xl border-2 shadow-sm flex items-center gap-4 ${
                        isLocked
                          ? "border-slate-100"
                          : isCompleted
                          ? "border-emerald-200 hover:border-emerald-400"
                          : "border-indigo-200 hover:border-indigo-400"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-xl ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-600"
                            : isLocked
                            ? "bg-slate-100 text-slate-400"
                            : "bg-indigo-100 text-indigo-600"
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
                        <span className="text-xs font-bold text-slate-400">
                          الدرس {idx + 1}
                        </span>
                        <h4 className="text-lg font-bold text-slate-800 leading-tight">
                          {lesson.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute right-6 md:right-1/2 w-8 h-8 rounded-full border-4 border-white bg-slate-200 shadow-md transform md:translate-x-1/2 order-2 z-10 flex items-center justify-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isCompleted
                          ? "bg-emerald-500"
                          : isLocked
                          ? "bg-slate-300"
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

  const LessonView = () => (
    <div className="max-w-3xl mx-auto animate-fade-in-up pb-20">
      <button
        onClick={() => setView("chapter")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-bold group"
      >
        <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
        العودة للقسم{" "}
      </button>

      <div className="bg-white rounded-4xl p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-10">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-linear-to-br ${activeChapter.color} text-white shadow-lg`}
          >
            {activeLesson.icon ? (
              <activeLesson.icon className="w-8 h-8" />
            ) : (
              <BookOpen className="w-8 h-8" />
            )}
          </div>
          <div>
            <span className="text-slate-400 font-bold text-sm tracking-wider">
              الدرس {activeLessonIndex + 1}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 mt-1">
              {activeLesson.title}
            </h1>
          </div>
        </div>

        <div className="text-slate-600 text-xl leading-[1.8] mb-10 font-medium">
          {formatContent(activeLesson.content)}
        </div>

        <div className="mb-12">
          <AlifIDE
            code={activeLesson.code}
            expectedOutput={activeLesson.expectedOutput}
            showRunButton={true}
          />
        </div>

        <button
          onClick={handleLessonComplete}
          className="w-full bg-slate-900 hover:bg-black text-white p-5 rounded-2xl text-xl font-bold transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 hover:-translate-y-1"
        >
          استمرار إلى التحدي <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
      </div>
    </div>
  );

  const QuizView = () => {
    const quiz = activeLesson.quiz;
    const [selectedOpt, setSelectedOpt] = useState<null | number>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const isCorrect = selectedOpt === quiz.correctAnswer;

    return (
      <>
        <div className="max-w-3xl mx-auto animate-fade-in-up pb-32">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setView("lesson")}
              className="text-slate-400 hover:text-slate-800"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <div className="flex-1 bg-slate-200 h-4 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-1/2 rounded-full"></div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-black mb-8 text-slate-800 leading-tight">
            {quiz.question}
          </h2>
          {quiz.code && (
            <div className="mb-10">
              <AlifIDE code={quiz.code} />
            </div>
          )}

          <div className="grid gap-4">
            {quiz.options.map((opt, idx) => {
              let stateClass =
                "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700";
              if (isSubmitted) {
                // Only highlight correct answer if the user selected it correctly
                if (idx === quiz.correctAnswer && idx === selectedOpt)
                  stateClass =
                    "bg-emerald-50 border-emerald-500 text-emerald-800 ring-4 ring-emerald-500/20";
                // Highlight wrong selection in red
                else if (idx === selectedOpt)
                  stateClass = "bg-rose-50 border-rose-500 text-rose-800";
                // Dim all other options when wrong answer chosen
                else
                  stateClass =
                    "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
              } else if (selectedOpt === idx) {
                stateClass =
                  "bg-indigo-50 border-indigo-500 text-indigo-800 ring-4 ring-indigo-500/20";
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isSubmitted && setSelectedOpt(idx)}
                  disabled={isSubmitted}
                  className={`p-6 rounded-2xl text-xl font-bold text-right transition-all border-2 flex justify-between items-center ${stateClass}`}
                >
                  <span dir="ltr" className="text-right w-full font-mono">
                    {opt}
                  </span>
                  {isSubmitted &&
                    idx === quiz.correctAnswer &&
                    selectedOpt === quiz.correctAnswer && (
                      <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0 ml-4 animate-bounce-in" />
                    )}
                  {isSubmitted &&
                    idx === selectedOpt &&
                    idx !== quiz.correctAnswer && (
                      <XCircle className="w-8 h-8 text-rose-500 shrink-0 ml-4 animate-bounce-in" />
                    )}
                </button>
              );
            })}
          </div>

          {!isSubmitted && (
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-200 z-40">
              <div className="max-w-3xl mx-auto">
                <button
                  onClick={() => selectedOpt !== null && setIsSubmitted(true)}
                  disabled={selectedOpt === null}
                  className={`w-full py-5 rounded-2xl font-black text-xl transition-all ${
                    selectedOpt !== null
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  تحقق من الإجابة
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className={`fixed bottom-0 left-0 right-0 p-6 md:p-8 border-t-2 transform transition-all duration-500 z-50 ${
            isSubmitted
              ? "translate-y-0 opacity-100 visible"
              : "translate-y-full opacity-0 invisible"
          } ${
            isCorrect
              ? "border-emerald-200 bg-emerald-50"
              : "border-rose-200 bg-rose-50"
          }`}
        >
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full mt-1 ${
                  isCorrect
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-rose-100 text-rose-600"
                }`}
              >
                {isCorrect ? (
                  <Check className="w-8 h-8 stroke-3" />
                ) : (
                  <XCircle className="w-8 h-8 stroke-3" />
                )}
              </div>
              <div>
                <h3
                  className={`font-black text-2xl mb-2 ${
                    isCorrect ? "text-emerald-800" : "text-rose-800"
                  }`}
                >
                  {isCorrect ? "أحسنت بطل!" : "إجابة خاطئة"}
                </h3>
                <p
                  className={`text-lg font-medium leading-relaxed ${
                    isCorrect ? "text-emerald-700/80" : "text-rose-700/80"
                  }`}
                >
                  {quiz.explanation}
                </p>
              </div>
            </div>
            <button
              onClick={
                isCorrect
                  ? handleQuizSuccess
                  : () => {
                      setIsSubmitted(false);
                      setSelectedOpt(null);
                    }
              }
              className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black text-xl text-white transition-transform hover:scale-105 shrink-0 shadow-lg ${
                isCorrect
                  ? "bg-emerald-500 shadow-emerald-500/30"
                  : "bg-rose-500 shadow-rose-500/30"
              }`}
            >
              {isCorrect ? "المتابعة" : "حاول مجدداً"}
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen selection:bg-indigo-200 selection:text-indigo-900 pb-20"
    >
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 mb-8">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setView("dashboard")}
          >
            <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-md transform -rotate-6">
              <TerminalSquare className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800">
              ألف<span className="text-indigo-600">5.3</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 font-bold text-slate-700 text-sm">
            <div className="flex items-center gap-1.5 text-orange-600">
              <Star className="w-4 h-4 fill-orange-500" /> {userData.xp}
            </div>
            <div className="w-px h-4 bg-slate-300"></div>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Trophy className="w-4 h-4" /> {userData.completedLessons.length}{" "}
              دروس مكتملة
            </div>
          </div>
        </div>
      </header>
      <main className="px-6">
        {view === "dashboard" && <DashboardView />}
        {view === "chapter" && <ChapterView />}
        {view === "lesson" && <LessonView />}
        {view === "quiz" && <QuizView />}
      </main>
    </div>
  );
}
