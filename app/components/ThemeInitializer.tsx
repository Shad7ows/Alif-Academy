"use client";

import { useEffect } from "react";

export function ThemeInitializer() {
  useEffect(() => {
    // Initialize theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return null;
}
