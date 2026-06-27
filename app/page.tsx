"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  ChevronRight,
  Play,
  Code2,
  GitBranch,
  Repeat,
  TerminalSquare,
  Sparkles,
  Trophy,
  Star,
  ArrowLeft,
  LayoutList,
  Check,
  Calculator,
  Scale,
  Zap,
  ArrowRightLeft,
  Trash2,
  Box,
  Layers,
  PlayCircle,
  Lock,
  Package,
} from "lucide-react";

const CHAPTERS = [
  {
    id: "ch1",
    title: "الأساسيات والعمليات",
    description: "ابنِ أساسك البرمجي. تعلم المتغيرات، الحساب، وإدارة الذاكرة.",
    icon: Layers,
    color: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    textDark: "text-blue-700",
    lessons: [
      {
        id: "l1_1",
        title: "أهلاً بك في عالم ألف",
        icon: Code2,
        content:
          "لغة **ألف** صُممت لتكون بديهية. للتواصل مع الحاسوب وجعله يعرض رسالة، نستخدم أمر `اطبع`.\n\nلتخزين معلومة (مثل اسمك) لاستخدامها لاحقاً، نقوم بإنشاء **متغير** ببساطة بكتابة اسمه ثم علامة التساوي `=`. \n\n*اضغط على زر التشغيل بالأسفل لترى كيف تعمل الشفرة.*",
        code: 'الاسم = "طارق"\nالنقاط = 100\n\nاطبع("مرحباً بك يا " + الاسم)\nاطبع("نقاطك الحالية هي: " + النقاط)',
        expectedOutput: "مرحباً بك يا طارق\nنقاطك الحالية هي: 100",
        quiz: {
          question:
            "كيف نقوم بتعريف متغير يحمل اسم 'العمر' وقيمته 25 في لغة ألف؟",
          code: "",
          options: [
            "متغير العمر : 25",
            "العمر = 25",
            "اجعل العمر 25",
            "عرف العمر = 25",
          ],
          correctAnswer: 1,
          explanation:
            "في لغة ألف، تعريف المتغيرات بسيط جداً. نكتب اسم المتغير مباشرة (العمر) متبوعاً بعلامة التساوي (=) ثم القيمة (25).",
        },
      },
      {
        id: "l1_2",
        title: "العمليات الحسابية",
        icon: Calculator,
        content:
          "تدعم لغة **ألف** جميع العمليات الحسابية الأساسية:\n\n• **الجمع:** `+`\n• **الطرح:** `-`\n• **الضرب:** `*`\n• **القسمة:** `/`\n• **باقي القسمة:** `%`",
        code: 'س = 10\nص = 3\n\nالجمع = س + ص\nالضرب = س * ص\nالباقي = س % ص\n\nاطبع("الضرب: " + الضرب)\nاطبع("باقي القسمة: " + الباقي)',
        expectedOutput: "الضرب: 30\nباقي القسمة: 1",
        quiz: {
          question: "ما هي النتيجة التي سيطبعها هذا البرنامج؟",
          code: "النتيجة = 5 * 2 + 3\nاطبع(النتيجة)",
          options: ["25", "13", "10", "خطأ برمجي"],
          correctAnswer: 1,
          explanation:
            "تعطى الأولوية لعملية الضرب قبل الجمع. لذا يتم حساب (5 * 2) أولاً لتصبح 10، ثم يضاف إليها 3 لتصبح النتيجة النهائية 13.",
        },
      },
      {
        id: "l1_3",
        title: "الإسناد الرجعي",
        icon: Zap,
        content:
          "لتحديث قيمة متغير بناءً على قيمته الحالية باحترافية، توفر ألف اختصارات تسمى **الإسناد الرجعي**:\n\n• **الزيادة:** `+=`\n• **النقصان:** `-=`\n• **الضرب في:** `*=`\n• **القسمة على:** `/=`",
        code: 'النقاط = 50\nالنقاط += 20\nاطبع("بعد الزيادة: " + النقاط)\n\nالنقاط /= 2\nاطبع("بعد القسمة: " + النقاط)',
        expectedOutput: "بعد الزيادة: 70\nبعد القسمة: 35",
        quiz: {
          question: "ما هي قيمة المتغير 'س' بعد تنفيذ الشفرة التالية؟",
          code: "س = 5\nس *= 3\nس += 2",
          options: ["10", "17", "15", "20"],
          correctAnswer: 1,
          explanation:
            "نبدأ بقيمة 5. العملية (س *= 3) تضرب بـ 3 لتصبح 15. ثم (س += 2) تضيف 2 لتصبح 17.",
        },
      },
      {
        id: "l1_4",
        title: "حذف المتغيرات",
        icon: Trash2,
        content:
          "عندما لا نعود بحاجة إلى متغير معين، يمكننا التخلص منه لتحرير ذاكرة الحاسوب باستخدام الأمر `احذف`.\n\nبمجرد حذفه، أي محاولة لاستخدامه لاحقاً ستسبب **خطأ برمجي**.",
        code: 'الرسالة = "مرحباً"\nاطبع(الرسالة)\n\nاحذف الرسالة\nاطبع("تم تنظيف الذاكرة!")',
        expectedOutput: "مرحباً\nتم تنظيف الذاكرة!",
        quiz: {
          question: "ما هي النتيجة المتوقعة لتشغيل هذه الشفرة البرمجية؟",
          code: "الرقم = 99\nاحذف الرقم\nاطبع(الرقم)",
          options: ["99", "0", "خطأ برمجي", "فراغ"],
          correctAnswer: 2,
          explanation:
            "الأمر 'احذف' يقوم بمسح المتغير. محاولة طباعته لاحقاً ستنتج خطأ لأن المتغير لم يعد موجوداً.",
        },
      },
    ],
  },
  {
    id: "ch2",
    title: "المنطق والقرارات",
    description: "علم برنامجك كيف يقارن البيانات ويتخذ قرارات ذكية معقدة.",
    icon: GitBranch,
    color: "from-emerald-400 to-teal-500",
    bgLight: "bg-emerald-50",
    textDark: "text-emerald-700",
    lessons: [
      {
        id: "l2_1",
        title: "المقارنة والروابط",
        icon: Scale,
        content:
          "نستخدم رموز المقارنة مثل: `==` (يساوي)، `!=` (لا يساوي)، `>`، `<`.\n\nونربط الشروط باستخدام:\n• **`و`**: يجب تحقق جميع الشروط.\n• **`او`**: يكفي تحقق شرط واحد.",
        code: 'العمر = 20\nالخبرة = 3\n\nاذا العمر >= 18 و الخبرة > 2:\n    اطبع("مؤهل للوظيفة")',
        expectedOutput: "مؤهل للوظيفة",
        quiz: {
          question: "ما هو المخرج المتوقع لهذه الشفرة؟",
          code: 'اذا 5 == 5 و 10 < 5:\n    اطبع("صحيح")\nوالا:\n    اطبع("خطأ")',
          options: ["صحيح", "خطأ", "لا شيء", "خطأ برمجي"],
          correctAnswer: 1,
          explanation:
            "الشرط الأول صحيح، لكن الثاني (10 < 5) خاطئ. وبما أننا استخدمنا 'و'، يجب أن يكون كلاهما صحيحاً لينفذ القسم الأول، لذا سينفذ قسم 'والا'.",
        },
      },
      {
        id: "l2_2",
        title: "الشروط (اذا / والا)",
        icon: GitBranch,
        content:
          "تستخدم `اذا` للتحقق من شرط ما. يجب وضع **نقطتين رأسيتين `:`** بعد الشرط، وترك **مسافة بادئة** للأسطر التابعة له.",
        code: 'الدرجة = 85\n\nاذا الدرجة >= 50:\n    اطبع("ناجح")\nوالا:\n    اطبع("راسب")',
        expectedOutput: "ناجح",
        quiz: {
          question: "ما هو الخطأ في الشفرة البرمجية التالية؟",
          code: 'حرارة = 40\nاذا حرارة > 35\n    اطبع("حار")',
          options: [
            "يجب وضع أقواس",
            "لا يوجد خطأ",
            "نسيان النقطتين الرأسيتين (:)",
            "كلمة 'اذا' غير صحيحة",
          ],
          correctAnswer: 2,
          explanation:
            "الجمل الشرطية يجب أن تنتهي بنقطتين رأسيتين `:` لإعلام المترجم ببدء الكتلة البرمجية التابعة.",
        },
      },
      {
        id: "l2_3",
        title: "الإسناد الشرطي",
        icon: ArrowRightLeft,
        content:
          "لتحديد قيمة متغير بناءً على شرط في سطر واحد، نستخدم الإسناد الشرطي.\n\nالصيغة: `المتغير = القيمة_الأولى اذا (الشرط) والا القيمة_الثانية`",
        code: 'الحرارة = 35\nالطقس = "حار" اذا الحرارة > 30 والا "معتدل"\nاطبع("الطقس اليوم: " + الطقس)',
        expectedOutput: "الطقس اليوم: حار",
        quiz: {
          question: "ما هي قيمة المتغير 'النتيجة' هنا؟",
          code: 'العمر = 15\nالنتيجة = "مسموح" اذا العمر >= 18 والا "مرفوض"',
          options: ["مسموح", "مرفوض", "15", "18"],
          correctAnswer: 1,
          explanation:
            "الشرط خاطئ (15 ليس أكبر من 18). لذلك سيتم اختيار القيمة الموجودة بعد 'والا' وهي 'مرفوض'.",
        },
      },
    ],
  },
  {
    id: "ch3",
    title: "الهياكل والتكرار",
    description: "نظم بياناتك في مصفوفات، واستخدم الحلقات لتنفيذ المهام بسرعة.",
    icon: Repeat,
    color: "from-amber-400 to-orange-500",
    bgLight: "bg-amber-50",
    textDark: "text-amber-700",
    lessons: [
      {
        id: "l3_1",
        title: "المصفوفات (Lists)",
        icon: LayoutList,
        content:
          "لحفظ بيانات متعددة، نستخدم المصفوفات `[]`. يمكننا الوصول لأي عنصر باستخدام موقعه (المؤشر)، والعد يبدأ من **الصفر**.",
        code: 'الفواكه = ["تفاح", "موز", "برتقال"]\nاطبع(الفواكه[0])\nاطبع(الفواكه[2])',
        expectedOutput: "تفاح\nبرتقال",
        quiz: {
          question: "كيف نستخرج كلمة 'أزرق'؟",
          code: 'الألوان = ["أحمر", "أخضر", "أزرق", "أصفر"]',
          options: ["الألوان[3]", "الألوان(2)", "الألوان[2]", 'استخرج("أزرق")'],
          correctAnswer: 2,
          explanation:
            "العد يبدأ من الصفر: أحمر(0)، أخضر(1)، أزرق(2). ونستخدم الأقواس المربعة [].",
        },
      },
      {
        id: "l3_2",
        title: "حلقة 'لكل' و 'مدى'",
        icon: Repeat,
        content:
          "لتكرار أمر عدة مرات، نستخدم حلقة `لكل`. الدالة `مدى(الرقم)` تنشئ أرقاماً متسلسلة تبدأ من الصفر.",
        code: 'لكل دورة في مدى(3):\n    اطبع("دورة رقم: " + دورة)\n\nاطبع("انتهى!")',
        expectedOutput: "دورة رقم: 0\nدورة رقم: 1\nدورة رقم: 2\nانتهى!",
        quiz: {
          question: "كم مرة سيتم تنفيذ ما بداخل الحلقة؟",
          code: 'لكل س في مدى(5):\n    اطبع("مرحباً")',
          options: ["مرة واحدة", "4 مرات", "5 مرات", "إلى المالانهاية"],
          correctAnswer: 2,
          explanation:
            "الدالة مدى(5) تولد خمسة أرقام (0,1,2,3,4)، وبالتالي تعمل الحلقة 5 مرات.",
        },
      },
    ],
  },
  {
    id: "ch4",
    title: "الدوال والأدوات",
    description:
      "تعرف على الدوال الجاهزة، وتعلم كيف تنشئ دوالك الخاصة المتقدمة.",
    icon: Box,
    color: "from-violet-400 to-purple-500",
    bgLight: "bg-violet-50",
    textDark: "text-violet-700",
    lessons: [
      {
        id: "l4_1",
        title: "الدوال الضمنية",
        icon: Box,
        content:
          "ألف مزودة بدوال جاهزة لتسهيل عملك:\n\n• **`طول(س)`**: لعد عناصر مصفوفة أو حروف نص.\n• **`نوع(س)`**: لمعرفة نوع البيانات.\n• **`صحيح(س)`**، **`عشري(س)`**، **`نص(س)`**: لتحويل البيانات.",
        code: 'رسالة = "ألف"\nنص_رقمي = "100"\n\nاطبع("الحروف: " + طول(رسالة))\nاطبع("كرقم: " + صحيح(نص_رقمي))',
        expectedOutput: "الحروف: 3\nكرقم: 100",
        quiz: {
          question: "ما النتيجة التي يرجعها `طول([1, 2, 3, 4])`؟",
          code: "",
          options: ["4", "3", "10", "خطأ"],
          correctAnswer: 0,
          explanation:
            "دالة 'طول' ترجع عدد العناصر في المصفوفة، وهي هنا 4 عناصر.",
        },
      },
      {
        id: "l4_2",
        title: "إنشاء الدوال الخاصة",
        icon: TerminalSquare,
        content:
          "لإنشاء قوالب برمجية يمكن إعادة استخدامها، نستخدم الكلمة `دالة` متبوعة باسمها وأقواس المعاملات. ولإخراج النتيجة نستخدم `ارجع`.",
        code: "دالة مضاعفة(رقم):\n    ارجع رقم * 2\n\nاطبع(مضاعفة(5))\nاطبع(مضاعفة(10))",
        expectedOutput: "10\n20",
        quiz: {
          question: "ما هي الأداة المستخدمة لإرجاع نتيجة من دالة إلى البرنامج؟",
          code: "",
          options: ["اطبع", "ارجع", "يساوي", "نتيجة"],
          correctAnswer: 1,
          explanation:
            "الكلمة المحجوزة 'ارجع' (Return) تُستخدم لإيقاف الدالة وإرسال النتيجة للخارج.",
        },
      },
    ],
  },
  {
    id: "ch5",
    title: "الاستيراد والمكتبات",
    description:
      "استفد من الشفرات الجاهزة والمكتبات الخارجية لتوسيع قدرات برنامجك.",
    icon: Package,
    color: "from-fuchsia-500 to-pink-600",
    bgLight: "bg-fuchsia-50",
    textDark: "text-fuchsia-700",
    lessons: [
      {
        id: "l5_1",
        title: "استيراد مكتبة كاملة",
        icon: Package,
        content:
          "لا تحتاج لكتابة كل شيء بنفسك! توفر لغة ألف **مكتبات** (Modules) تحتوي على أدوات ودوال جاهزة للاستخدام.\n\nلجلب مكتبة كاملة إلى برنامجك، نستخدم الأمر `استورد` متبوعاً باسم المكتبة. للوصول إلى أداة داخل هذه المكتبة نكتب اسمها، ثم نقطة `.`، ثم الأداة.",
        code: 'استورد رياضيات\n\nالنتيجة = رياضيات.جذر(16)\nاطبع("الجذر التربيعي للعدد 16 هو: " + النتيجة)',
        expectedOutput: "الجذر التربيعي للعدد 16 هو: 4",
        quiz: {
          question: "أي الكلمات المحجوزة نستخدمها لجلب مكتبة 'نظام' للبرنامج؟",
          code: "",
          options: ["جلب نظام", "استورد نظام", "تضمين نظام", "مكتبة نظام"],
          correctAnswer: 1,
          explanation:
            "الكلمة المحجوزة 'استورد' هي الأداة القياسية في لغة ألف لجلب المكتبات الخارجية للبرنامج.",
        },
      },
      {
        id: "l5_2",
        title: "الاستيراد المخصص",
        icon: Zap,
        content:
          "إذا كنت تحتاج إلى أداة واحدة أو دالة محددة فقط من مكتبة ضخمة، يمكنك استيراد هذه الأداة بالتحديد لتوفير الذاكرة وتسهيل الكتابة.\n\nنستخدم لذلك الصيغة: `من (اسم_المكتبة) استورد (الأداة)`.",
        code: 'من رياضيات استورد قوة\n\nالنتيجة = قوة(2, 3)\nاطبع("2 أس 3 يساوي: " + النتيجة)',
        expectedOutput: "2 أس 3 يساوي: 8",
        quiz: {
          question:
            "ما هي الطريقة الصحيحة لاستيراد الدالة 'وقت_حالي' من مكتبة 'زمن' فقط؟",
          code: "",
          options: [
            "استورد وقت_حالي من زمن",
            "من وقت_حالي استورد زمن",
            "من زمن استورد وقت_حالي",
            "استورد زمن.وقت_حالي",
          ],
          correctAnswer: 2,
          explanation:
            "نبدأ بتحديد المصدر بكلمة 'من' (زمن)، ثم نستخدم 'استورد' لجلب الأداة المحددة (وقت_حالي).",
        },
      },
    ],
  },
];

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
    },
  );

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
      "g",
    );
    h = h.replace(reg, (match, p1, p2) => {
      tokens.push(`<span class="text-pink-400 font-bold">${p2}</span>`);
      return `${p1}__TOKEN_${tokenIdx++}_END__`;
    });
  });

  h = h.replace(
    /(==|!=|&gt;=|&lt;=|&gt;|&lt;|\+=|-=|\*=|\/=|%=|=|\+|-|\*|\/|%|:)/g,
    (match) => {
      tokens.push(`<span class="text-cyan-400">${match}</span>`);
      return `__TOKEN_${tokenIdx++}_END__`;
    },
  );

  for (let i = tokenIdx - 1; i >= 0; i--) {
    h = h.replace(new RegExp(`__TOKEN_${i}_END__`, "g"), () => tokens[i]);
  }
  return h;
};

interface IDEBlockProps {
  code: string; // source code to display/edit
  expectedOutput?: string; // expected console/output result (optional)
  showRunButton?: boolean;
}

const IDEBlock = ({
  code,
  expectedOutput,
  showRunButton = false,
}: IDEBlockProps) => {
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
      className="rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-[#0d1117] my-6 font-Tajawal text-right"
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
            <span key={i}>{i + 1}</span>
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
      activeLesson.id,
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
      0,
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
              userData.completedLessons.includes(l.id),
            ).length;
            const isFullyCompleted =
              chapterCompleted === chapter.lessons.length;
            // Lock logic: first chapter is unlocked. Next chapters unlock if previous is fully completed.
            const isLocked =
              idx > 0 &&
              CHAPTERS[idx - 1].lessons.filter((l) =>
                userData.completedLessons.includes(l.id),
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
                  activeChapter.lessons[idx - 1].id,
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
          <IDEBlock
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
              <IDEBlock code={quiz.code} />
            </div>
          )}

          <div className="grid gap-4">
            {quiz.options.map((opt, idx) => {
              let stateClass =
                "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700";
              if (isSubmitted) {
                if (idx === quiz.correctAnswer)
                  stateClass =
                    "bg-emerald-50 border-emerald-500 text-emerald-800 ring-4 ring-emerald-500/20";
                else if (idx === selectedOpt)
                  stateClass = "bg-rose-50 border-rose-500 text-rose-800";
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
                  {isSubmitted && idx === quiz.correctAnswer && (
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
