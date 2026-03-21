type AlertVariant = "error" | "success" | "warning" | "info";

interface AlertProps {
  variant?: AlertVariant;
  message: string;
}

const styles: Record<AlertVariant, string> = {
  error: "bg-red-50 border-red-200 text-red-700",
  success: "bg-green-50 border-green-200 text-green-700",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
  info: "bg-blue-50 border-blue-200 text-blue-700",
};

export function Alert({ variant = "error", message }: AlertProps) {
  return (
    <div className={`border rounded-md px-4 py-3 text-sm ${styles[variant]}`}>
      {message}
    </div>
  );
}
