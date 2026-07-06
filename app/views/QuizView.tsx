"use client";

import { useState } from "react";
import { AlifIDE } from "../components/AlifIDE";
import { CheckCircle, XCircle, Check } from "lucide-react";

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
  icon: React.FC;
  content: string;
  code: string;
  expectedOutput: string;
  quizzes: Quiz[];
}

interface QuizViewProps {
  activeLesson: Lesson;
  handleQuizSuccess: () => void;
  setView: (view: string) => void;
}

export const QuizView = ({
  activeLesson,
  handleQuizSuccess,
  setView,
}: QuizViewProps) => {
  const quizzes = activeLesson.quizzes;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<null | number>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuiz = quizzes[currentQuestionIndex];
  const isCorrect = selectedOpt === currentQuiz.correctAnswer;
  const totalQuestions = quizzes.length;
  const progressPercent =
    ((currentQuestionIndex + (isSubmitted && isCorrect ? 1 : 0)) /
      totalQuestions) *
    100;

  // Handle correct answer navigation
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      // Move to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
    } else {
      // All questions completed
      handleQuizSuccess();
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto animate-fade-in-up pb-32">
        {/* Header with progress */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setView("lesson")}
            className="text-slate-400 hover:text-slate-800 dark:hover:text-white"
          >
            <XCircle className="w-8 h-8" />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                السؤال {currentQuestionIndex + 1} من {totalQuestions}
              </span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {correctCount}/{totalQuestions} إجابات صحيحة
              </span>
            </div>
            <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-3xl md:text-4xl font-black mb-8 text-slate-800 dark:text-white leading-tight">
          {currentQuiz.question}
        </h2>
        {currentQuiz.code && (
          <div className="mb-10">
            <AlifIDE code={currentQuiz.code} />
          </div>
        )}

        {/* Options */}
        <div className="grid gap-4">
          {currentQuiz.options.map((opt: string, idx: number) => {
            let stateClass =
              "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-200";
            if (isSubmitted) {
              if (idx === currentQuiz.correctAnswer && idx === selectedOpt)
                stateClass =
                  "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-4 ring-emerald-500/20";
              else if (idx === selectedOpt)
                stateClass =
                  "bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-800 dark:text-rose-300";
              else
                stateClass =
                  "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-50";
            } else if (selectedOpt === idx) {
              stateClass =
                "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-800 dark:text-indigo-300 ring-4 ring-indigo-500/20";
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
                  idx === currentQuiz.correctAnswer &&
                  selectedOpt === currentQuiz.correctAnswer && (
                    <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0 ml-4 animate-bounce-in" />
                  )}
                {isSubmitted &&
                  idx === selectedOpt &&
                  idx !== currentQuiz.correctAnswer && (
                    <XCircle className="w-8 h-8 text-rose-500 shrink-0 ml-4 animate-bounce-in" />
                  )}
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-40">
            <div className="max-w-3xl mx-auto">
              <button
                onClick={() => {
                  if (selectedOpt !== null) {
                    if (selectedOpt === currentQuiz.correctAnswer) {
                      setCorrectCount((prev) => prev + 1);
                    }
                    setIsSubmitted(true);
                  }
                }}
                disabled={selectedOpt === null}
                className={`w-full py-5 rounded-2xl font-black text-xl transition-all ${
                  selectedOpt !== null
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                }`}
              >
                تحقق من الإجابة
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Result Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 p-6 md:p-8 border-t-2 z-50 ${
          isSubmitted
            ? "translate-y-0 opacity-100 visible transform transition-all duration-500"
            : "translate-y-full opacity-0 invisible transform transition-all duration-0"
        } ${
          isCorrect
            ? "border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20"
            : "border-rose-200 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/20"
        }`}
      >
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-full mt-1 ${
                isCorrect
                  ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300"
                  : "bg-rose-100 dark:bg-rose-800 text-rose-600 dark:text-rose-300"
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
                  isCorrect
                    ? "text-emerald-800 dark:text-emerald-200"
                    : "text-rose-800 dark:text-rose-200"
                }`}
              >
                {isCorrect ? "أحسنت بطل!" : "إجابة خاطئة"}
              </h3>
              <p
                className={`text-lg font-medium leading-relaxed ${
                  isCorrect
                    ? "text-emerald-700/80 dark:text-emerald-300/80"
                    : "text-rose-700/80 dark:text-rose-300/80"
                }`}
              >
                {currentQuiz.explanation}
              </p>
            </div>
          </div>
          <button
            onClick={
              isCorrect
                ? handleNextQuestion
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
            {isCorrect
              ? currentQuestionIndex < totalQuestions - 1
                ? "السؤال التالي"
                : "المتابعة"
              : "حاول مجدداً"}
          </button>
        </div>
      </div>
    </>
  );
};
