"use client";

import { useState, useEffect } from "react";
import { DashboardView } from "./views/DashboardView";
import { ChapterView } from "./views/ChapterView";
import { LessonView } from "./views/LessonView";
import { CHAPTERS } from "./chapters";
import { AlifIDE } from "./components/AlifIDE";
import {
  CheckCircle,
  XCircle,
  TerminalSquare,
  Trophy,
  Star,
  Check,
} from "lucide-react";

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
        {view === "quiz" && <QuizView />}
      </main>
    </div>
  );
}
