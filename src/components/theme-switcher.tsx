"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-8 w-8" />; // Placeholder
    }

    return (
        <button
            onClick={() => {
                if (theme === "dark") setTheme("light");
                else if (theme === "light") setTheme("system");
                else setTheme("dark");
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 dark:border-white/10 border-black/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground"
            aria-label="Toggle theme"
        >
            {theme === "light" ? (
                <Sun className="h-4 w-4" />
            ) : theme === "dark" ? (
                <Moon className="h-4 w-4" />
            ) : (
                <Monitor className="h-4 w-4" />
            )}
        </button>
    );
}
