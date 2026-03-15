import type { SalaryRecord } from "~/types";
import { Card } from "~/components/ui/Card";
import { StatusBadge } from "./StatusBadge";

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface SalaryDetailCardProps {
  record: SalaryRecord;
}

export function SalaryDetailCard({ record }: SalaryDetailCardProps) {
  return (
    <Card>
      <dl className="flex flex-col gap-4 text-sm">
        <DetailRow label="ID" value={record.id} />
        <DetailRow
          label="Amount"
          value={`${record.currency} ${record.amount.toLocaleString()}`}
        />
        <DetailRow
          label="Period"
          value={`${MONTH_NAMES[record.month]} ${record.year}`}
        />
        <div className="flex justify-between items-center">
          <dt className="text-gray-500">Status</dt>
          <dd><StatusBadge status={record.status} /></dd>
        </div>
        <DetailRow
          label="Submitted At"
          value={new Date(record.submittedAt).toLocaleString()}
        />
      </dl>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900 text-right max-w-xs break-all">{value}</dd>
    </div>
  );
}
