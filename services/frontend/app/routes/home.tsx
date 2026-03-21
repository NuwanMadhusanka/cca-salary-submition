import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Spinner } from "~/components/ui/Spinner";
import { Alert } from "~/components/ui/Alert";
import { StatCard } from "~/components/salary/StatCard";
import { SalaryTable } from "~/components/salary/SalaryTable";
import { api } from "~/lib/api";
import type { SalaryRecord } from "~/types";

export function meta() {
  return [{ title: "Dashboard | Salary Portal" }];
}

export default function Home() {
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<SalaryRecord[]>("/salaries")
      .then(setRecords)
      .catch((err) => setError(err.message ?? "Failed to load records"))
      .finally(() => setLoading(false));
  }, []);

  const total = records.length;
  const approved = records.filter((r) => r.status === "approved").length;
  const pending = records.filter((r) => r.status === "pending").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <Link to="/submit">
          <Button>Submit Salary</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Submissions" value={loading ? "—" : total} />
        <StatCard label="Approved" value={loading ? "—" : approved} valueClassName="text-green-600" />
        <StatCard label="Pending" value={loading ? "—" : pending} valueClassName="text-yellow-500" />
      </div>

      <Card>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Submissions</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : error ? (
          <Alert message={error} />
        ) : (
          <SalaryTable records={records.slice(0, 10)} />
        )}
      </Card>
    </div>
  );
}
