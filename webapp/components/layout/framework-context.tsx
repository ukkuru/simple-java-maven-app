"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Framework } from "@/types";

interface FrameworkContextValue {
  framework: Framework;
  setFramework: (f: Framework) => void;
}

const FrameworkContext = createContext<FrameworkContextValue | null>(null);

export function FrameworkProvider({ children }: { children: ReactNode }) {
  const [framework, setFramework] = useState<Framework>("INVEST");
  return (
    <FrameworkContext.Provider value={{ framework, setFramework }}>
      {children}
    </FrameworkContext.Provider>
  );
}

export function useFramework(): FrameworkContextValue {
  const ctx = useContext(FrameworkContext);
  if (!ctx) throw new Error("useFramework must be used within a FrameworkProvider");
  return ctx;
}
