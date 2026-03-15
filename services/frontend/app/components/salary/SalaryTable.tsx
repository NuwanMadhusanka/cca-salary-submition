import { Link } from "react-router";
import type { SalaryRecord } from "~/types";
import { StatusBadge } from "./StatusBadge";
import { EmptyState } from "~/components/ui/EmptyState";
import { Button } from "~/components/ui/Button";

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

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
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="pb-3 pr-4 font-medium text-gray-500">Period</th>
            <th className="pb-3 pr-4 font-medium text-gray-500">Amount</th>
            <th className="pb-3 pr-4 font-medium text-gray-500">Status</th>
            <th className="pb-3 font-medium text-gray-500">Submitted</th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b border-gray-100 last:border-0">
              <td className="py-3 pr-4 text-gray-900">
                {MONTH_NAMES[record.month]} {record.year}
              </td>
              <td className="py-3 pr-4 text-gray-900 font-medium">
                {record.currency} {record.amount.toLocaleString()}
              </td>
              <td className="py-3 pr-4">
                <StatusBadge status={record.status} />
              </td>
              <td className="py-3 pr-4 text-gray-500">
                {new Date(record.submittedAt).toLocaleDateString()}
              </td>
              <td className="py-3 text-right">
                <Link
                  to={`/salary/${record.id}`}
                  className="text-blue-600 hover:underline text-xs"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
