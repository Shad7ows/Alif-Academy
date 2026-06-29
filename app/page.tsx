"use client";

import { useState, useEffect } from "react";
import { DashboardView } from "./views/DashboardView";
import { ChapterView } from "./views/ChapterView";
import { LessonView } from "./views/LessonView";
import { QuizView } from "./views/QuizView";
import { CHAPTERS } from "./chapters";
import { TerminalSquare, Trophy, Star } from "lucide-react";

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
  useState(() => {
    try {
      const saved = localStorage.getItem("alifProV3Data");
      if (saved) setUserData(JSON.parse(saved));
    } catch (e) {
      console.error("Error loading save data", e);
    }
  });

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
        {view === "quiz" && (
          <QuizView
            activeLesson={activeLesson}
            handleQuizSuccess={handleQuizSuccess}
            setView={setView}
          />
        )}
      </main>
    </div>
  );
}
