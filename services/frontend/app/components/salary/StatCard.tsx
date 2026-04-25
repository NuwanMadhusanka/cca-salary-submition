interface StatCardProps {
  label: string;
  value: string | number;
  valueClassName?: string;
}

export function StatCard({ label, value, valueClassName = "text-white" }: StatCardProps) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col gap-2">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <p className={`text-3xl font-bold tracking-tight ${valueClassName}`}>{value}</p>
    </div>
  );
}
