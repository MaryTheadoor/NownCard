import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/shared/lib/utils/cn";
import { X } from "lucide-react";

type ToastVariant = "default" | "success" | "error";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { ...t, id }]);
      const timer = setTimeout(() => dismiss(id), 5000);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const currentTimers = timers.current;
    return () => {
      currentTimers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastViewport>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  );
}

function ToastViewport({ children }: { children: ReactNode }) {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px]">
      {children}
    </div>
  );
}

const variantStyles: Record<ToastVariant, string> = {
  default: "border-line bg-tile",
  success: "border-green-500 bg-green-50",
  error: "border-red-500 bg-red-50",
};

const ToastItem = forwardRef<
  HTMLDivElement,
  { toast: Toast; onDismiss: () => void } & HTMLAttributes<HTMLDivElement>
>(({ toast: t, onDismiss, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all animate-in",
      variantStyles[t.variant ?? "default"],
      className,
    )}
    {...props}
  >
    <div className="grid gap-1">
      <p className="text-sm font-semibold">{t.title}</p>
      {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
    </div>
    <button onClick={onDismiss} className="shrink-0 rounded-md p-1 hover:bg-black/5" aria-label="Dismiss">
      <X className="h-4 w-4" />
    </button>
  </div>
));
ToastItem.displayName = "ToastItem";
