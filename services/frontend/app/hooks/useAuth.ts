import { useNavigate } from "react-router";
import { api } from "~/lib/api";
import { clearToken, setToken } from "~/lib/auth";

export function useAuth() {
  const navigate = useNavigate();

  async function login(email: string, password: string) {
    const res = await api.post<{ token: string }>("/auth/login", {
      email,
      password,
    });
    setToken(res.token);
    navigate("/");
  }

  async function signup(name: string, email: string, password: string) {
    const res = await api.post<{ token: string }>("/auth/register", {
      name,
      email,
      password,
    });
    setToken(res.token);
    navigate("/");
  }

  function logout() {
    clearToken();
    navigate("/login");
  }

  return { login, signup, logout };
}
