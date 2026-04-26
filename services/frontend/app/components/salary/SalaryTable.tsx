import { Link } from "react-router";
import type { SalaryRecord } from "~/types";
import { StatusBadge } from "./StatusBadge";
import { EmptyState } from "~/components/ui/EmptyState";
import { Button } from "~/components/ui/Button";

interface SalaryTableProps {
  records: SalaryRecord[];
}

export function SalaryTable({ records }: SalaryTableProps) {
  if (records.length === 0) {
    return (
      <EmptyState
        title="No salary submissions"
        description="Submit your first salary record to get started."
        action={
          <Link to="/submit">
            <Button>Submit Salary</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="pb-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Company
            </th>
            <th className="pb-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Role
            </th>
            <th className="pb-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Country
            </th>
            <th className="pb-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Salary
            </th>
            <th className="pb-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Status
            </th>
            <th className="pb-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
              Date
            </th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {records.map((record) => (
            <tr key={record.id} className="group hover:bg-slate-800/30 transition-colors">
              <td className="py-3.5 pr-4 font-medium text-slate-200">{record.company}</td>
              <td className="py-3.5 pr-4 text-slate-400">{record.jobTitle}</td>
              <td className="py-3.5 pr-4 text-slate-500">{record.country ?? "—"}</td>
              <td className="py-3.5 pr-4 font-semibold text-slate-200">
                <span className="text-slate-500 text-xs mr-1">{record.currency}</span>
                {(record.totalCompensation ?? record.baseSalary).toLocaleString()}
              </td>
              <td className="py-3.5 pr-4">
                <StatusBadge status={record.status} />
              </td>
              <td className="py-3.5 pr-4 text-slate-500 text-xs">
                {record.createdAt
                  ? new Date(record.createdAt).toLocaleDateString()
                  : "—"}
              </td>
              <td className="py-3.5 text-right">
                <Link
                  to={`/salary/${record.id}`}
                  className="text-indigo-400 hover:text-indigo-300 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
