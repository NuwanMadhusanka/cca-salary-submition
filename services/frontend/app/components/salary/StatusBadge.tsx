import { Badge } from "~/components/ui/Badge";
import type { SalaryRecord } from "~/types";

interface StatusBadgeProps {
  status: SalaryRecord["status"];
}

type BadgeVariant = "green" | "yellow" | "red" | "gray";

const variantMap: Record<string, BadgeVariant> = {
  APPROVED: "green",
  approved: "green",
  PENDING: "yellow",
  pending: "yellow",
  REJECTED: "red",
  rejected: "red",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = variantMap[status] ?? "gray";
  const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return <Badge variant={variant}>{label}</Badge>;
}
