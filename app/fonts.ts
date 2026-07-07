import localFont from "next/font/local";

// Tajawal font for main body text (Arabic sans-serif)
export const tajawal = localFont({
  src: [
    {
      path: "./assets/fonts/Tajawal/Tajawal-Regular.ttf",
      weight: "400",
      style: "normal",
  },
  {
      path: "./assets/fonts/Tajawal/Tajawal-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/fonts/Tajawal/Tajawal-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/fonts/Tajawal/Tajawal-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./assets/fonts/Tajawal/Tajawal-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./assets/fonts/Tajawal/Tajawal-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./assets/fonts/Tajawal/Tajawal-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-tajawal",
  display: "swap",
  declarations: [
    {
      prop: 'ascent-override',
      value: '105%',
    },
  ],
});

// NotoKufiArabic font for code blocks (Arabic monospace-style)
export const notoKufiArabic = localFont({
  src: [
    {
      path: "./assets/fonts/NotoKufiArabic/NotoKufiArabic-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./assets/fonts/NotoKufiArabic/NotoKufiArabic-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/fonts/NotoKufiArabic/NotoKufiArabic-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/fonts/NotoKufiArabic/NotoKufiArabic-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./assets/fonts/NotoKufiArabic/NotoKufiArabic-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./assets/fonts/NotoKufiArabic/NotoKufiArabic-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./assets/fonts/NotoKufiArabic/NotoKufiArabic-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./assets/fonts/NotoKufiArabic/NotoKufiArabic-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./assets/fonts/NotoKufiArabic/NotoKufiArabic-Thin.ttf",
      weight: "100",
      style: "normal",
    },
  ],
  variable: "--font-noto-kufi-arabic",
  display: "swap",
});