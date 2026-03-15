import { Card } from "~/components/ui/Card";

interface StatCardProps {
  label: string;
  value: string | number;
  valueClassName?: string;
}

export function StatCard({ label, value, valueClassName = "text-gray-900" }: StatCardProps) {
  return (
    <Card>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${valueClassName}`}>{value}</p>
    </Card>
  );
}
