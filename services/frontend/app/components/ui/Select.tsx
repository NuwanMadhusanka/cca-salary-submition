import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export function Select({ label, error, options, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        className={`bg-slate-800 border rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none transition-colors cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
          error
            ? "border-rose-500"
            : "border-slate-700 hover:border-slate-600"
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-800">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
