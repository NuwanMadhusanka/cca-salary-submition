import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { useAuth } from "~/hooks/useAuth";

export function meta() {
  return [{ title: "Login | Salary Portal" }];
}

export default function Login() {
  const { login } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(usernameOrEmail, password);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email or Username"
              type="text"
              placeholder="john@example.com"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <div className="bg-rose-950/50 border border-rose-800 text-rose-300 text-sm rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}
            <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-4 text-sm text-slate-500 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}
