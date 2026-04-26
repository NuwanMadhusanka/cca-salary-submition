import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`bg-slate-900 rounded-2xl border border-slate-800 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
