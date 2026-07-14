import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { tajawal, notoKufiArabic } from "./fonts";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Alif Academy",
  description:
    "منصة تعليمية رائدة في تعليم البرمجة باللغة العربية - لغة البرمجة العربية ألف النسخة 5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${notoKufiArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeInitializer />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
