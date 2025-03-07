"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react"; // Add Laptop icon for System mode
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // Function to toggle between light, dark, and system themes
  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("system"); // Switch to system mode
    } else {
      setTheme("dark");
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === "dark" || theme === "system" ? "opacity-0" : "opacity-100"}`}
      />

      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${theme === "light" || theme === "system" ? "opacity-0" : "opacity-100"}`}
      />

      <Laptop
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${theme !== "system" ? "opacity-0" : "opacity-100"}`}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
