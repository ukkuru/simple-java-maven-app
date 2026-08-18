"use client";

import { useState } from "react";
import { Menu, Moon, Sun, HelpCircle, UserCircle } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useFramework } from "@/components/layout/framework-context";
import { Tooltip } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export function TopNav({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { theme, toggle } = useTheme();
  const { framework } = useFramework();
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))]/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
          className="focus-ring rounded-lg p-2 hover:bg-[rgb(var(--surface-2))] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-xs text-[rgb(var(--text-muted))]">Framework</span>
          <Badge tone="brand">{framework}</Badge>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Tooltip content={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}>
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle color theme"
            className="focus-ring rounded-lg p-2 hover:bg-[rgb(var(--surface-2))]"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </Tooltip>

        <div className="relative">
          <Tooltip content="Help & tips">
            <button
              type="button"
              onClick={() => setHelpOpen((v) => !v)}
              aria-expanded={helpOpen}
              aria-label="Help"
              className="focus-ring rounded-lg p-2 hover:bg-[rgb(var(--surface-2))]"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </Tooltip>
          {helpOpen && (
            <div
              role="dialog"
              aria-label="Help"
              className="absolute right-0 top-full mt-2 w-72 animate-fade-in rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 text-sm shadow-xl"
            >
              <p className="font-medium">Quick tips</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[rgb(var(--text-muted))]">
                <li>Paste a user story and its acceptance criteria, pick SMART or INVEST, then click Analyze.</li>
                <li>Use a template or example to try the analyzer instantly.</li>
                <li>After editing based on recommendations, click Re-analyze to see your score improve.</li>
              </ul>
            </div>
          )}
        </div>

        <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--surface-2))] text-[rgb(var(--text-muted))]">
          <UserCircle className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
}
