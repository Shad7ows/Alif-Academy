/**
 * حساب سلسلة الأيام (Streak)
 * @param currentStreak - السلسلة الحالية
 * @param lastActiveDate - آخر تاريخ نشاط (ISO string أو YYYY-MM-DD)
 * @param today - تاريخ اليوم (يفترض التاريخ الحالي)
 * @returns السلسلة الجديدة
 */
export function calculateStreak(
  currentStreak: number,
  lastActiveDate: string | null,
  today: Date = new Date()
): number {
  if (lastActiveDate === null) {
    return 1; // أول نشاط
  }

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

  if (diffDays === 0) return currentStreak; // نفس اليوم
  if (diffDays === 1) return currentStreak + 1; // أمس
  return 1; // فات يوم أو أكثر
}