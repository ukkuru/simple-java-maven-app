"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ToastTone = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (t: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneIcon: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-success-500" />,
  error: <XCircle className="h-5 w-5 text-danger-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning-500" />,
  info: <Info className="h-5 w-5 text-brand-500" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 4500);
  }, []);

  const dismiss = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
        aria-live="polite"
        aria-atomic="true"
      >
        {items.map((item) => (
          <div
            key={item.id}
            role="status"
            className="animate-fade-in flex items-start gap-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-lg"
          >
            {toneIcon[item.tone]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.title}</p>
              {item.description && (
                <p className="mt-0.5 text-sm text-[rgb(var(--text-muted))]">{item.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className={cn("focus-ring rounded p-0.5 text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--surface-2))]")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
