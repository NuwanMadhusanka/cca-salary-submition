import { useState, useEffect } from "react";
import { Spinner } from "~/components/ui/Spinner";
import { Alert } from "~/components/ui/Alert";
import { StatCard } from "~/components/salary/StatCard";
import { api } from "~/lib/api";
import type { SalaryStats } from "~/types";

export function meta() {
  return [{ title: "Stats | Salary Portal" }];
}

function fmt(value?: number, currency?: string) {
  if (value === undefined || value === null) return "—";
  const prefix = currency ? `${currency} ` : "";
  return `${prefix}${Number(value).toLocaleString()}`;
}

export default function Stats() {
  const [stats, setStats] = useState<SalaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<SalaryStats>("/api/stats")
      .then(setStats)
      .catch((err) => setError(err.message ?? "Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Statistics</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Compensation insights from approved submissions
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Alert message={error} />
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Sample Size" value={stats.sampleSize ?? 0} />
            <StatCard
              label="Average Salary"
              value={fmt(stats.averageSalary, stats.currency)}
              valueClassName="text-indigo-400"
            />
            <StatCard
              label="Median Salary"
              value={fmt(stats.medianSalary, stats.currency)}
              valueClassName="text-indigo-400"
            />
            <StatCard
              label="Highest Salary"
              value={fmt(stats.maxSalary, stats.currency)}
              valueClassName="text-emerald-400"
            />
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white">Salary Distribution</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Percentile
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  { label: "Minimum", value: stats.minSalary, highlight: false },
                  { label: "25th Percentile", value: stats.percentile25, highlight: false },
                  { label: "Median (50th)", value: stats.medianSalary, highlight: true },
                  { label: "75th Percentile", value: stats.percentile75, highlight: false },
                  { label: "90th Percentile", value: stats.percentile90, highlight: false },
                  { label: "Maximum", value: stats.maxSalary, highlight: false },
                ].map(({ label, value, highlight }) => (
                  <tr key={label} className={highlight ? "bg-indigo-950/20" : ""}>
                    <td
                      className={`px-6 py-3.5 ${
                        highlight ? "text-indigo-300 font-medium" : "text-slate-400"
                      }`}
                    >
                      {label}
                    </td>
                    <td
                      className={`px-6 py-3.5 text-right font-semibold ${
                        highlight ? "text-indigo-400" : "text-slate-200"
                      }`}
                    >
                      {fmt(value, stats.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Alert message="No statistics available." />
      )}
    </div>
  );
}
