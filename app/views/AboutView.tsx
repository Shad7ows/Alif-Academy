"use client";

import {
  ArrowRight,
  Info,
  Heart,
  Code2,
  Globe,
  Users,
  Lightbulb,
  Shield,
  Star,
  CheckCircle2,
  Monitor,
  Target,
} from "lucide-react";

interface AboutViewProps {
  onBack: () => void;
}

// Features Data
interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgLight: string;
  borderColor: string;
}

const FEATURES: Feature[] = [
  {
    title: "تعلم تفاعلي",
    description:
      "محرر أكواد مدمج يعمل مباشرة في المتصفح مع أمثلة عملية وتطبيقات تفاعلية.",
    icon: Code2,
    color: "text-blue-600 dark:text-blue-400",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-700",
  },
  {
    title: "محتوى عربي 100%",
    description:
      "جميع الدروس والشروحات مكتوبة بالعربية الفصحى مع أمثلة من السياق المحلي.",
    icon: Globe,
    color: "text-emerald-600 dark:text-emerald-400",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-700",
  },
  {
    title: "مسار منظم",
    description:
      "محتوى مرتب ومنظم يأخذك من الأساسيات إلى المستويات المتقدمة خطوة بخطوة.",
    icon: Lightbulb,
    color: "text-amber-600 dark:text-amber-400",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-700",
  },
  {
    title: "نظام تحفيزي",
    description:
      "اجمع نقاط الخبرة وحقق الإنجازات لتتبع تقدمك والحفاظ على تحملك للاستمرار.",
    icon: Star,
    color: "text-purple-600 dark:text-purple-400",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700",
  },
  {
    title: "مجاني بالكامل",
    description:
      "المنصة مجانية بالكامل ومفتوحة المصدر. نؤمن بأن التعليم حق للجميع.",
    icon: Heart,
    color: "text-rose-600 dark:text-rose-400",
    bgLight: "bg-rose-50 dark:bg-rose-900/20",
    borderColor: "border-rose-200 dark:border-rose-700",
  },
  {
    title: "تجربة حديثة",
    description:
      "واجهة مستخدم عصرية وجذابة مع دعم كامل للوضع الداكن وتجربة سلسة.",
    icon: Monitor,
    color: "text-indigo-600 dark:text-indigo-400",
    bgLight: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-700",
  },
];

// Tech Stack Data
interface TechItem {
  name: string;
  category: string;
  description: string;
}

const TECH_STACK: TechItem[] = [
  {
    name: "Next.js",
    category: "إطار العمل",
    description: "إطار عمل React للتطبيقات الويب",
  },
  {
    name: "TypeScript",
    category: "لغة البرمجة",
    description: "لغة البرمجة الآمنة والفعالة",
  },
  {
    name: "Tailwind CSS",
    category: "التصميم",
    description: "إطار عمل CSS حديث",
  },
  {
    name: "Supabase",
    category: "الباك إند",
    description: "قاعدة بيانات والمصادقة",
  },
  {
    name: "Lucide Icons",
    category: "الواجهة",
    description: "مجموعة الأيقونات",
  },
  {
    name: "VS Code",
    category: "أدوات",
    description: "محرر الأكواد المدمج",
  },
];

export function AboutView({ onBack }: AboutViewProps) {
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
              <Info className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black">حول مدرسة ألف</h2>
              <p className="text-indigo-100 text-sm">
                تعرف على المزيد عن منصتنا ورؤيتنا
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mb-10">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
              <Users className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">
              ما هي مدرسة ألف؟
            </h3>
          </div>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              <span className="font-bold text-slate-800 dark:text-white">
                مدرسة ألف
              </span>{" "}
              هي منصة تعليمية عربية مفتوحة المصدر، مبادرة من{" "}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                منظمة ألف
              </span>
              ، متخصصة في تعليم البرمجة بلغة HTML5 للمبتدئين.
            </p>
            <p>
              نؤمن بأن التعليم يجب أن يكون حقًا للجميع، لذلك قمنا بتطوير محتوى
              تعليمي عربي عالي الجودة يساعد المتعلمين على رحلة تعلم البرمجة من
              الصفر حتى يتمكنوا من إنشاء مواقع ويب تفاعلية.
            </p>
            <p>
              تستخدم المنصة محرر أكواد مدمج فريد (Alif IDE) يعمل مباشرة في
              المتصفح، مما يتيح للمتعلمين تجربة عملية فورية دون الحاجة لتثبيت أي
              برامج إضافية.
            </p>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Vision */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Lightbulb className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="text-xl font-black text-slate-800 dark:text-white">
              رؤيتنا
            </h4>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            أن نكون المنصة العربية الأولى لتعليم البرمجة للمبتدئين، ونساعد في
            تشكيل جيل من المطورين العرب المبدعين.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-xl font-black text-slate-800 dark:text-white">
              رسالتنا
            </h4>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            توفير تعليم برمجي عربي عالي الجودة بطريقة تفاعلية وممتعة، مع إتاحة
            الأدوات والموارد اللازمة لنجاح كل متعلم.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-10">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          مميزات المنصة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={index}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${feature.borderColor} ${feature.bgLight}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                    <FeatureIcon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="mb-10">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Code2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          التكنولوجيا المستخدمة
        </h3>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TECH_STACK.map((tech, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg mt-0.5">
                  <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-white text-sm">
                      {tech.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                      {tech.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {tech.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-10">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          فريق العمل
        </h3>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-center mb-6">
            <div className="inline-flex p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl mb-4">
              <Users className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-2">
              منظمة ألف
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              فريق من المطورين والمعلمين العرب يعملون على تطوير أدوات تعليمية
              مبتكرة لجعل تعليم البرمجة في متناول الجميع.
            </p>
          </div>

          {/* Team Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "الابتكار",
                desc: "نبحث دائمًا عن طرق جديدة لتحسين تجربة التعلم",
              },
              {
                title: "الجودة",
                desc: "نلتزم بأعلى معايير الجودة في المحتوى والتعليم",
              },
              {
                title: "المجتمعية",
                desc: "نبني مجتمعًا تعليميًا عربيًا نشطًا ومتفاعلًا",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
              >
                <h5 className="font-bold text-slate-800 dark:text-white mb-1">
                  {value.title}
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* License Section */}
      <div>
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          الترخيص وحقوق النشر
        </h3>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
              <Shield className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                هذا المشروع مرخص تحت رخصة{" "}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  MIT
                </span>{" "}
                وهو مفتوح المصدر. يمكنك استخدامه وتعديله وتوزيعه بحرية وفقًا
                لأحكام الرخصة.
              </p>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center font-medium">
                  © 2026 مدرسة ألف - جميع الحقوق محفوظة لصالح منظمة ألف
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
