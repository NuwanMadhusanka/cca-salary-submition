import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`bg-slate-800 border rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
          error
            ? "border-rose-500"
            : "border-slate-700 hover:border-slate-600"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
