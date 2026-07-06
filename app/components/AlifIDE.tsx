"use client";

import { useState } from "react";
import { Play, Code2 } from "lucide-react";

const highlightAlif = (code: string) => {
  if (!code) return "";
  let h = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const tokens: string[] = [];
  let tokenIdx = 0;

  h = h.replace(/(["'])(.*?)\1/g, (match) => {
    tokens.push(`<span class="text-emerald-300 font-medium">${match}</span>`);
    return `__TOKEN_${tokenIdx++}_END__`;
  });

  h = h.replace(
    /(^|[^a-zA-Z0-9_])(\d+)(?=[^a-zA-Z0-9_]|$)/g,
    (match, p1, p2) => {
      tokens.push(`<span class="text-orange-300">${p2}</span>`);
      return `${p1}__TOKEN_${tokenIdx++}_END__`;
    }
  );

  // Comments with #
  h = h.replace(/(^|(?<=\n))#[^\n]*/g, (match) => {
    tokens.push(`<span class="text-slate-500 italic">${match}</span>`);
    return `__TOKEN_${tokenIdx++}_END__`;
  });

  const keywords = [
    "دالة",
    "ارجع",
    "اذا",
    "والا",
    "لكل",
    "في",
    "مدى",
    "اطبع",
    "استمر",
    "توقف",
    "و",
    "او",
    "ليس",
    "صحيح",
    "صح",
    "خطأ",
    "احذف",
    "طول",
    "نوع",
    "ادخال",
    "عشري",
    "نص",
    "مصفوفة",
    "استورد",
    "من",
  ];
  keywords.forEach((kw) => {
    const reg = new RegExp(
      `(^|\\s|\\(|\\)|\\[|\\]|:)(${kw})(?=\\s|\\(|\\)|\\[|\\]|:|$)`,
      "g"
    );
    h = h.replace(reg, (match, p1, p2) => {
      tokens.push(`<span class="text-pink-400 font-bold">${p2}</span>`);
      return `${p1}__TOKEN_${tokenIdx++}_END__`;
    });
  });

  h = h.replace(
    /(==|!=|&gt;=|&lt;=|&gt;|&lt;|\+=|-=|\*=|\/=|\\=|=|\+|-|\*|\/|\\|:)/g,
    (match) => {
      tokens.push(`<span class="text-cyan-400">${match}</span>`);
      return `__TOKEN_${tokenIdx++}_END__`;
    }
  );

  for (let i = tokenIdx - 1; i >= 0; i--) {
    h = h.replace(new RegExp(`__TOKEN_${i}_END__`, "g"), () => tokens[i]);
  }
  return h;
};

interface AlifIDEProps {
  code: string; // source code to display/edit
  expectedOutput?: string; // expected console/output result (optional)
  showRunButton?: boolean;
}

export const AlifIDE = ({
  code,
  expectedOutput,
  showRunButton = false,
}: AlifIDEProps) => {
  const [output, setOutput] = useState<null | string>("");
  const [isRunning, setIsRunning] = useState(false);
  const lines = code.split("\n");

  const handleRun = () => {
    setIsRunning(true);
    setOutput(null);
    setTimeout(() => {
      setOutput(expectedOutput || "تم تنفيذ الشفرة بنجاح.");
      setIsRunning(false);
    }, 600);
  };

  return (
    <div
      className="rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-[#0d1117] my-6 text-right"
      dir="rtl"
    >
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
        </div>
        <div className="text-slate-400 text-xs tracking-wider flex items-center gap-2">
          <Code2 className="w-4 h-4" /> main.alif
        </div>
      </div>

      <div className="flex p-4 text-sm md:text-base overflow-x-auto">
        <div className="flex flex-col text-slate-600 pl-4 select-none border-l border-slate-700/50 ml-4 text-left">
          {lines.map((_, i) => (
            <span key={i} className="leading-relaxed">
              {i + 1}
            </span>
          ))}
        </div>
        <pre className="text-slate-100 flex-1 leading-relaxed">
          <code dangerouslySetInnerHTML={{ __html: highlightAlif(code) }} />
        </pre>
      </div>

      {showRunButton && (
        <div className="bg-slate-900 border-t border-slate-800 p-4">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all ${
              isRunning
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50"
            }`}
          >
            {isRunning ? (
              <>
                جاري التشغيل...{" "}
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              </>
            ) : (
              <>
                تشغيل الشفرة{" "}
                <Play className="w-4 h-4 fill-current rotate-180" />
              </>
            )}
          </button>

          {(output || isRunning) && (
            <div className="mt-4 bg-black p-4 rounded border border-slate-800 font-mono text-sm relative animate-fade-in-up">
              <div className="absolute top-0 left-0 px-2 py-1 text-[10px] text-slate-500 bg-slate-800 rounded-br">
                مخرجات النظام
              </div>
              {isRunning ? (
                <div className="text-slate-500 flex gap-1">
                  <span className="animate-pulse">_</span> <span>&lt;</span>
                </div>
              ) : (
                <div
                  className="text-green-400 whitespace-pre-wrap text-right"
                  dir="rtl"
                >
                  {output}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
