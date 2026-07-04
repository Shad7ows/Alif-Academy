"use client";

import { useState } from "react";
import {
  ArrowRight,
  HelpCircle,
  BookOpen,
  LifeBuoy,
  MessageCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  Rocket,
  Lightbulb,
  Mail,
  Globe,
  Users,
} from "lucide-react";

interface HelpViewProps {
  onBack: () => void;
}

// FAQ Data
interface FAQ {
  question: string;
  answer: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FAQ_DATA: FAQ[] = [
  {
    question: "ما هي مدرسة ألف؟",
    answer:
      "مدرسة ألف هي منصة تعليمية عربية متخصصة في تعليم البرمجة بلغة HTML5. نوفر لك مسارًا تعليميًا منظمًا يبدأ معك من الصفر حتى أن تصبح قادرًا على إنشاء مواقع ويب تفاعلية باستخدام أدوات قوية مثل VS Code.",
    icon: BookOpen,
  },
  {
    question: "كيف أبدأ التعلم؟",
    answer:
      "ابدأ بالانتقال إلى لوحة التحكم والضغط على أول فصل. كل درس يحتوي على شرح تفاعبي في محرر ألف آي دي (Alif IDE) مع أمثلة عملية. بعد إكمال كل درس ستحصل على اختبار صغير لتثبيت المعلومات.",
    icon: Rocket,
  },
  {
    question: "هل التعلم مجاني؟",
    answer:
      "نعم! منصة مدرسة ألف مجانية بالكامل. نحن نؤمن بأن التعليم يجب أن يكون حقًا للجميع. يمكنك الوصول لجميع الدروس والمحتوى التعليمي بدون أي رسوم.",
    icon: Zap,
  },
  {
    question: "هل أحتاج لتثبيت برامج؟",
    answer:
      "لا! محرر ألف آي دي يعمل مباشرة في المتصفح. كل ما تحتاجه هو متصفح ويب واتصال بالإنترنت. يمكنك أيضًا استخدام VS Code على جهازك لتجربة أكثر تقدمًا.",
    icon: Lightbulb,
  },
  {
    question: "كيف يعمل نظام النقاط والإنجازات؟",
    answer:
      "عند إكمال كل درس ونجاحك في الاختبار تحصل على نقاط خبرة (XP). كلما زادت نقاطك، كلما فتحت إنجازات جديدة. هذا النظام يساعدك على تتبع تقدمك ويحفزك على الاستمرار.",
    icon: Users,
  },
  {
    question: "هل يمكنني التواصل مع الفريق؟",
    answer:
      "طبعًا! يمكنك التواصل معنا عبر البريد الإلكتروني أو من خلال صفحة حول التطبيق. نحن نقدر ملاحظاتك واقتراحاتك وسنسعى للرد عليها في أقرب وقت.",
    icon: MessageCircle,
  },
];

// Quick Start Steps
interface Step {
  step: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const QUICK_START_STEPS: Step[] = [
  {
    step: 1,
    title: "تصفح الفصول",
    description:
      "انتقل إلى لوحة التحكم واختر الفصل الذي تريد البدء فيه. كل فصل يحتوي على مجموعة دروس مترتبة.",
    icon: BookOpen,
    color: "from-blue-500 to-blue-600",
  },
  {
    step: 2,
    title: "اقرأ الدرس",
    description:
      "اقرأ الشرح بعناية في محرر ألف آي دي. كل درس يحتوي على أكواد عملية وأمثلة تفاعلية.",
    icon: Lightbulb,
    color: "from-amber-500 to-amber-600",
  },
  {
    step: 3,
    title: "جرّب بنفسك",
    description:
      "عدّل على الأكواد وجرب بنفسك في المحرر التفاعلي. التجربة العملية هي أفضل طريقة للتعلم.",
    icon: Rocket,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    step: 4,
    title: "أجتز الاختبار",
    description:
      "بعد إكمال الدرس، انتقل للاختبار. يجب أن تجتاز الاختبار للحصول على نقاط الخبرة وإكمال الدرس.",
    icon: Zap,
    color: "from-purple-500 to-purple-600",
  },
];

export function HelpView({ onBack }: HelpViewProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
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
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black">مركز المساعدة</h2>
              <p className="text-indigo-100 text-sm">
                كل ما تحتاج معرفته عن مدرسة ألف
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="mb-10">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Rocket className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          كيفية البدء
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_START_STEPS.map((step) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.step}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${step.color} flex items-center justify-center shadow-md`}
                  >
                    <StepIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 dark:text-slate-700">
                    0{step.step}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-10">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          الأسئلة الشائعة
        </h3>
        <div className="space-y-3">
          {FAQ_DATA.map((faq, index) => {
            const FaqIcon = faq.icon;
            const isOpen = openFAQ === index;

            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-right"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                      <FaqIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {faq.question}
                    </span>
                  </div>
                  <div className="ml-4 shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pr-16">
                    <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mb-10">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          نصائح للتعلم الفعال
        </h3>
        <div className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-6 border border-amber-200 dark:border-amber-800/30">
          <ul className="space-y-4">
            {[
              {
                title: "تعلم يوميًا",
                desc: "خصص 20-30 دقيقة يوميًا للتعلم. الاستمرارية أهم من الكمية.",
              },
              {
                title: "جرّب بنفسك",
                desc: "لا تكتفِ بالقراءة. عدّل الأكواد وجرب أشياء جديدة في المحرر.",
              },
              {
                title: "لا تخف من الخطأ",
                desc: "الأخطاء جزء طبيعي من التعلم. كل خطأ تتعلم منه شيء جديد.",
              },
              {
                title: "راجع ما تعلمته",
                desc: "عد للدروس القديمة من وقت لآخر لتثبيت المعلومات.",
              },
              {
                title: "شارك مع الآخرين",
                desc: "شرح المفاهيم للآخرين هو أفضل طريقة لتثبيت فهمك.",
              },
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 dark:bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 dark:text-white text-sm">
                    {tip.title}{" "}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 text-sm">
                    {tip.desc}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contact Section */}
      <div>
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <LifeBuoy className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          تواصل معنا
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Email */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl inline-block mb-3">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white mb-1">
              البريد الإلكتروني
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              support@aliflang.dev
            </p>
          </div>

          {/* Website */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl inline-block mb-3">
              <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white mb-1">
              الموقع الإلكتروني
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              aliflang.dev
            </p>
          </div>

          {/* Community */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl inline-block mb-3">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white mb-1">
              المجتمع
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              انضم لمجتمع مدرسة ألف
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
