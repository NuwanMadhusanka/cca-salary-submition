type AlertVariant = "error" | "success" | "warning" | "info";

interface AlertProps {
  variant?: AlertVariant;
  message: string;
}

const styles: Record<AlertVariant, string> = {
  error: "bg-rose-950/50 border-rose-800 text-rose-300",
  success: "bg-emerald-950/50 border-emerald-800 text-emerald-300",
  warning: "bg-amber-950/50 border-amber-800 text-amber-300",
  info: "bg-indigo-950/50 border-indigo-800 text-indigo-300",
};

const icons: Record<AlertVariant, string> = {
  error: "✕",
  success: "✓",
  warning: "⚠",
  info: "ℹ",
};

export function Alert({ variant = "error", message }: AlertProps) {
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm flex items-start gap-3 ${styles[variant]}`}>
      <span className="font-bold shrink-0 mt-0.5">{icons[variant]}</span>
      <span>{message}</span>
    </div>
  );
}
