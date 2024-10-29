"use client";

import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function ThemeSwitch() {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex gap-2 items-center">
      <FontAwesomeIcon icon={faSun} />
      <Switch
        checked={isDark}
        onChange={() => setTheme(isDark ? "light" : "dark")}
        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition data-[checked]:bg-blue-600"
      >
        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
      </Switch>
      <FontAwesomeIcon icon={faMoon} />
    </div>
  );
}
