import { Badge } from "~/components/ui/Badge";
import type { SalaryRecord } from "~/types";

interface StatusBadgeProps {
  status: SalaryRecord["status"];
}

const variantMap = {
  approved: "green",
  pending: "yellow",
  rejected: "red",
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={variantMap[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
