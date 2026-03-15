import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Card } from "~/components/ui/Card";
import { Alert } from "~/components/ui/Alert";
import { api } from "~/lib/api";

export function meta() {
  return [{ title: "Submit Salary | Salary Portal" }];
}

const MONTH_OPTIONS = [
  { value: "", label: "Select month" },
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => ({
  value: currentYear - i,
  label: String(currentYear - i),
}));

export default function Submit() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(String(currentYear));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/salaries", {
        amount: Number(amount),
        month: Number(month),
        year: Number(year),
      });
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Submit Salary</h1>
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Amount (LKR)"
            type="number"
            min="0"
            placeholder="e.g. 150000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Select
            label="Month"
            value={month}
            options={MONTH_OPTIONS}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
          <Select
            label="Year"
            value={year}
            options={YEAR_OPTIONS}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          {error && <Alert message={error} />}
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>
              Submit
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
