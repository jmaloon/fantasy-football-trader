"use client";

import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  function onChange() {
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
    document.documentElement.classList.toggle("dark", !isDarkMode);
    setIsDarkMode(!isDarkMode);
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
      return;
    }
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  return (
    <Switch
      checked={isDarkMode}
      onChange={onChange}
      className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
    >
      <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
    </Switch>
  );
}
