import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Alert } from "~/components/ui/Alert";
import { api } from "~/lib/api";

export function meta() {
  return [{ title: "Submit Salary | Salary Portal" }];
}

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "LKR", label: "LKR — Sri Lankan Rupee" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "AUD", label: "AUD — Australian Dollar" },
  { value: "INR", label: "INR — Indian Rupee" },
];

const EMPLOYMENT_OPTIONS = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Freelance", label: "Freelance" },
];

export default function Submit() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    company: "",
    jobTitle: "",
    country: "",
    city: "",
    yearsOfExperience: "",
    baseSalary: "",
    bonus: "",
    stockOptions: "",
    otherCompensation: "",
    currency: "USD",
    employmentType: "Full-time",
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload: Record<string, unknown> = {
      company: form.company,
      jobTitle: form.jobTitle,
      country: form.country,
      baseSalary: Number(form.baseSalary),
      currency: form.currency,
      employmentType: form.employmentType,
    };

    if (form.city) payload.city = form.city;
    if (form.yearsOfExperience) payload.yearsOfExperience = Number(form.yearsOfExperience);
    if (form.bonus) payload.bonus = Number(form.bonus);
    if (form.stockOptions) payload.stockOptions = Number(form.stockOptions);
    if (form.otherCompensation) payload.otherCompensation = Number(form.otherCompensation);

    try {
      await api.post("/api/submissions", payload);
      navigate("/");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message ?? "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Submit Salary</h1>
        <p className="text-slate-500 text-sm mt-1">
          Share your compensation anonymously to help others in the community
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800">
        <form onSubmit={handleSubmit} className="divide-y divide-slate-800">
          <div className="px-6 py-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Position
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company *"
                placeholder="e.g. Google"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                required
              />
              <Input
                label="Job Title *"
                placeholder="e.g. Software Engineer"
                value={form.jobTitle}
                onChange={(e) => set("jobTitle", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="px-6 py-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Country *"
                placeholder="e.g. Sri Lanka"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                required
              />
              <Input
                label="City"
                placeholder="e.g. Colombo"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
          </div>

          <div className="px-6 py-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Compensation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                label="Base Salary *"
                type="number"
                min="0"
                placeholder="150000"
                value={form.baseSalary}
                onChange={(e) => set("baseSalary", e.target.value)}
                required
              />
              <Select
                label="Currency"
                value={form.currency}
                options={CURRENCY_OPTIONS}
                onChange={(e) => set("currency", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Bonus"
                type="number"
                min="0"
                placeholder="0"
                value={form.bonus}
                onChange={(e) => set("bonus", e.target.value)}
              />
              <Input
                label="Stock Options"
                type="number"
                min="0"
                placeholder="0"
                value={form.stockOptions}
                onChange={(e) => set("stockOptions", e.target.value)}
              />
              <Input
                label="Other"
                type="number"
                min="0"
                placeholder="0"
                value={form.otherCompensation}
                onChange={(e) => set("otherCompensation", e.target.value)}
              />
            </div>
          </div>

          <div className="px-6 py-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Years of Experience"
                type="number"
                min="0"
                placeholder="e.g. 5"
                value={form.yearsOfExperience}
                onChange={(e) => set("yearsOfExperience", e.target.value)}
              />
              <Select
                label="Employment Type"
                value={form.employmentType}
                options={EMPLOYMENT_OPTIONS}
                onChange={(e) => set("employmentType", e.target.value)}
              />
            </div>
          </div>

          <div className="px-6 py-5 flex flex-col gap-4">
            {error && <Alert message={error} />}
            <div className="flex gap-3">
              <Button type="submit" loading={loading} size="lg">
                Submit
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
