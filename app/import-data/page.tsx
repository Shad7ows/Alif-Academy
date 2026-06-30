"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Link } from "lucide-react";

function getLocalStats() {
  try {
    const data = localStorage.getItem("alifProV3Data");
    if (data) {
      const parsed = JSON.parse(data);
      return {
        xp: parsed.xp || 0,
        lessons: parsed.completedLessons?.length || 0,
      };
    }
  } catch {
    // تجاهل البيانات التالفة
  }
  return { xp: 0, lessons: 0 };
}

export default function ImportDataPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    userData,
    importFromLocalStorage,
    loading: progressLoading,
  } = useUserProgress(user?.id ?? null);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const [localStats] = useState(getLocalStats);

  if (!user && !authLoading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">
          يجب تسجيل الدخول أولاً
        </h2>
        <a
          href="/auth/sign-in"
          className="text-indigo-600 underline mt-4 inline-block"
        >
          تسجيل الدخول
        </a>
      </div>
    );
  }

  const handleImport = async () => {
    setImporting(true);
    try {
      const localData = localStorage.getItem("alifProV3Data");
      if (localData) {
        await importFromLocalStorage(JSON.parse(localData));
        setDone(true);
      }
    } catch (e) {
      console.error("Import error:", e);
    }
    setImporting(false);
  };

  if (done) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-emerald-600">
          ✅ تم استيراد البيانات بنجاح!
        </h2>
        <p className="text-slate-500 mt-2">
          نقاطك: {userData.xp} | الدروس المكتملة:{" "}
          {userData.completedLessons.length}
        </p>
        <Link href="/" className="text-indigo-600 underline mt-4 inline-block">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-20 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-slate-800">
        📦 استيراد بياناتك القديمة
      </h2>
      <p className="text-slate-500 mt-2 mb-6">
        لديك <strong>{localStats.lessons}</strong> درس مكتمل و{" "}
        <strong>{localStats.xp}</strong> نقطة محفوظة محلياً.
        <br />
        استوردها الآن إلى حسابك السحابي.
      </p>
      <button
        onClick={handleImport}
        disabled={importing || progressLoading}
        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50"
      >
        {importing ? "جاري الاستيراد..." : "استيراد البيانات"}
      </button>
    </div>
  );
}
