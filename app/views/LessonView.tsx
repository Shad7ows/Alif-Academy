import { AlifIDE } from "../components/AlifIDE";
import type { LucideProps } from "lucide-react";
import { BookOpen, ChevronRight, ArrowLeft } from "lucide-react";

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

interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: React.FC<LucideProps>;
  color: string;
  bgLight: string;
  textDark: string;
  lessons: Lesson[];
}

const formatContent = (text: string) => {
  // Process line by line to handle ## headings and ``` code blocks
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockKey = 0;
  let headingKey = 0;
  let textKey = 0;

  const processInline = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-slate-800 dark:text-white font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 mx-1 rounded font-mono text-sm md:text-base border border-slate-200 dark:border-slate-600"
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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code block opening
    if (line.trim() === "```" && !inCodeBlock) {
      inCodeBlock = true;
      codeBlockContent = [];
      continue;
    }

    // Handle code block closing
    if (line.trim() === "```" && inCodeBlock) {
      inCodeBlock = false;
      result.push(
        <pre
          key={`code-${codeBlockKey++}`}
          className="bg-slate-900 dark:bg-slate-950 text-white p-4 md:p-6 rounded-xl overflow-x-auto font-mono text-sm md:text-base my-4 border border-slate-700 dark:border-slate-800"
        >
          <code>{codeBlockContent.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // Handle code block content
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Handle ## headings
    if (line.startsWith("## ")) {
      result.push(
        <h2
          key={`heading-${headingKey++}`}
          className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mt-6 mb-3"
        >
          {processInline(line.slice(3))}
        </h2>
      );
      continue;
    }

    // Handle regular text lines
    if (line.trim() === "") {
      result.push(<div key={`blank-${textKey++}`} className="h-3" />);
    } else {
      result.push(
        <p key={`para-${textKey++}`} className="mb-2">
          {processInline(line)}
        </p>
      );
    }
  }

  // Handle unclosed code block (render what we have)
  if (inCodeBlock && codeBlockContent.length > 0) {
    result.push(
      <pre
        key={`code-${codeBlockKey++}`}
        className="bg-slate-900 dark:bg-slate-950 text-white p-4 md:p-6 rounded-xl overflow-x-auto font-mono text-sm md:text-base my-4 border border-slate-700 dark:border-slate-800"
      >
        <code>{codeBlockContent.join("\n")}</code>
      </pre>
    );
  }

  return result;
};

interface LessonViewProps {
  activeChapter: Chapter;
  activeLesson: Lesson;
  activeLessonIndex: number;
  onComplete: () => void;
  setView: (view: string) => void;
}

export const LessonView = ({
  activeChapter,
  activeLesson,
  activeLessonIndex,
  onComplete,
  setView,
}: LessonViewProps) => (
  <div className="max-w-3xl mx-auto animate-fade-in-up pb-20">
    <button
      onClick={() => setView("chapter")}
      className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors font-bold group dark:text-slate-400"
    >
      <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
      العودة للقسم{" "}
    </button>

    <div className="bg-white dark:bg-slate-800 rounded-4xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-700">
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
          <span className="text-slate-400 dark:text-slate-500 font-bold text-sm tracking-wider">
            الدرس {activeLessonIndex + 1}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mt-1">
            {activeLesson.title}
          </h1>
        </div>
      </div>

      <div className="text-slate-600 dark:text-slate-300 text-xl leading-[1.8] mb-10 font-medium">
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
        onClick={onComplete}
        className="w-full bg-slate-900 dark:bg-slate-950 hover:bg-black dark:hover:bg-slate-800 text-white p-5 rounded-2xl text-xl font-bold transition-all shadow-xl shadow-slate-900/20 dark:shadow-slate-950/40 flex items-center justify-center gap-3 hover:-translate-y-1"
      >
        استمرار إلى التحدي <ChevronRight className="w-6 h-6 rotate-180" />
      </button>
    </div>
  </div>
);
