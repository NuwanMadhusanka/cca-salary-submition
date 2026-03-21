import { useState, useEffect } from "react";
import { Card } from "~/components/ui/Card";
import { Spinner } from "~/components/ui/Spinner";
import { Alert } from "~/components/ui/Alert";
import { StatCard } from "~/components/salary/StatCard";
import { StatusBadge } from "~/components/salary/StatusBadge";
import { api } from "~/lib/api";
import type { SalaryRecord } from "~/types";

export function meta() {
  return [{ title: "Stats | Salary Portal" }];
}

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function Stats() {
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<SalaryRecord[]>("/salaries")
      .then(setRecords)
      .catch((err) => setError(err.message ?? "Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  const amounts = records.map((r) => r.amount);
  const average = amounts.length
    ? Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length)
    : 0;
  const highest = amounts.length ? Math.max(...amounts) : 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Statistics</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Alert message={error} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard label="Average Salary" value={`LKR ${average.toLocaleString()}`} />
            <StatCard label="Highest Salary" value={`LKR ${highest.toLocaleString()}`} />
          </div>

          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Breakdown</h2>
            {records.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 pr-4 font-medium text-gray-500">Period</th>
                      <th className="pb-3 pr-4 font-medium text-gray-500">Amount</th>
                      <th className="pb-3 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 pr-4 text-gray-900">
                          {MONTH_NAMES[record.month]} {record.year}
                        </td>
                        <td className="py-3 pr-4 font-medium text-gray-900">
                          {record.currency} {record.amount.toLocaleString()}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={record.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
