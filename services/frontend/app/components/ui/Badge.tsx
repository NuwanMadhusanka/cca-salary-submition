type BadgeVariant = "green" | "yellow" | "red" | "gray" | "blue" | "indigo";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const styles: Record<BadgeVariant, string> = {
  green: "bg-emerald-950 text-emerald-400 border border-emerald-800/60",
  yellow: "bg-amber-950 text-amber-400 border border-amber-800/60",
  red: "bg-rose-950 text-rose-400 border border-rose-800/60",
  gray: "bg-slate-800 text-slate-400 border border-slate-700",
  blue: "bg-blue-950 text-blue-400 border border-blue-800/60",
  indigo: "bg-indigo-950 text-indigo-400 border border-indigo-800/60",
};

export function Badge({ variant = "gray", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
