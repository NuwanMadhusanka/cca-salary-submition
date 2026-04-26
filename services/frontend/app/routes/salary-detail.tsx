import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Button } from "~/components/ui/Button";
import { Spinner } from "~/components/ui/Spinner";
import { Alert } from "~/components/ui/Alert";
import { SalaryDetailCard } from "~/components/salary/SalaryDetailCard";
import { api } from "~/lib/api";
import type { SalaryRecord } from "~/types";

export function meta() {
  return [{ title: "Salary Detail | Salary Portal" }];
}

export default function SalaryDetail() {
  const { id } = useParams();
  const [record, setRecord] = useState<SalaryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<SalaryRecord>(`/api/submissions/${id}`)
      .then(setRecord)
      .catch((err) => setError(err.message ?? "Failed to load record"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="max-w-lg flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="secondary" size="sm">
            ← Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Salary Detail</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Alert message={error} />
      ) : record ? (
        <SalaryDetailCard record={record} />
      ) : null}
    </div>
  );
}
