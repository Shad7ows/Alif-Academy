/**
 * حساب سلسلة الأيام (Streak)
 * @param currentStreak - السلسلة الحالية
 * @param lastActiveDate - آخر تاريخ نشاط (ISO string أو YYYY-MM-DD)
 * @param longestStreak - أطول سلسلة سابقة
 * @param today - تاريخ اليوم (يفترض التاريخ الحالي)
 * @returns كائن يحتوي على السلسلة الجديدة وأطول سلسلة
 */
export function calculateStreak(
  currentStreak: number,
  lastActiveDate: string | null,
  longestStreak: number,
  today: Date = new Date()
): { streak: number; longestStreak: number } {
  let newStreak: number;

  if (lastActiveDate === null) {
    newStreak = 1; // أول نشاط
  } else {
    // تحويل التاريخ إلى UTC date string (YYYY-MM-DD)
    const toUTCDate = (date: Date): string => {
      const y = date.getUTCFullYear();
      const m = String(date.getUTCMonth() + 1).padStart(2, "0");
      const d = String(date.getUTCDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    const todayStr = toUTCDate(today);
    const lastActiveDateObj = new Date(lastActiveDate);
    const lastActiveStr = toUTCDate(lastActiveDateObj);

    // حساب الفرق بالأيام
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.round(
      (new Date(todayStr).getTime() - new Date(lastActiveStr).getTime()) /
        msPerDay
    );

    if (diffDays === 0) {
      newStreak = currentStreak; // نفس اليوم
    } else if (diffDays === 1) {
      newStreak = currentStreak + 1; // أمس
    } else {
      newStreak = 1; // فات يوم أو أكثر
    }
  }

  const newLongestStreak = Math.max(newStreak, longestStreak);

  return {
    streak: newStreak,
    longestStreak: newLongestStreak,
  };
}
