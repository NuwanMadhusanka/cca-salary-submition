import type { SalaryRecord } from "~/types";
import { StatusBadge } from "./StatusBadge";

interface SalaryDetailCardProps {
  record: SalaryRecord;
}

export function SalaryDetailCard({ record }: SalaryDetailCardProps) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-800 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{record.company}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{record.jobTitle}</p>
        </div>
        <StatusBadge status={record.status} />
      </div>

      <div className="grid grid-cols-2 divide-x divide-slate-800 border-b border-slate-800">
        <div className="px-6 py-4">
          <p className="text-xs text-slate-500 mb-1">Base Salary</p>
          <p className="text-2xl font-bold text-white">
            <span className="text-slate-500 text-sm mr-1">{record.currency}</span>
            {record.baseSalary.toLocaleString()}
          </p>
        </div>
        {record.totalCompensation !== undefined && (
          <div className="px-6 py-4">
            <p className="text-xs text-slate-500 mb-1">Total Compensation</p>
            <p className="text-2xl font-bold text-indigo-400">
              <span className="text-slate-500 text-sm mr-1">{record.currency}</span>
              {record.totalCompensation.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <dl className="px-6 py-4 space-y-0">
        <DetailRow label="ID" value={`#${record.id}`} />
        {record.country && <DetailRow label="Country" value={record.country} />}
        {record.city && <DetailRow label="City" value={record.city} />}
        {record.yearsOfExperience !== undefined && (
          <DetailRow label="Experience" value={`${record.yearsOfExperience} years`} />
        )}
        {record.bonus !== undefined && record.bonus > 0 && (
          <DetailRow
            label="Bonus"
            value={`${record.currency} ${record.bonus.toLocaleString()}`}
          />
        )}
        {record.stockOptions !== undefined && record.stockOptions > 0 && (
          <DetailRow
            label="Stock Options"
            value={`${record.currency} ${record.stockOptions.toLocaleString()}`}
          />
        )}
        {record.employmentType && (
          <DetailRow label="Employment" value={record.employmentType} />
        )}
        {record.createdAt && (
          <DetailRow
            label="Submitted"
            value={new Date(record.createdAt).toLocaleString()}
          />
        )}
        {record.approvedAt && (
          <DetailRow
            label="Approved"
            value={new Date(record.approvedAt).toLocaleString()}
          />
        )}
      </dl>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800/60 last:border-0">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-200 text-right max-w-xs">{value}</dd>
    </div>
  );
}
