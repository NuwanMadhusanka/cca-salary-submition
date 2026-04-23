import { useNavigate } from "react-router";
import { api } from "~/lib/api";
import { clearToken, setToken } from "~/lib/auth";

interface LoginResponseData {
  token: string;
  userId: number;
  username: string;
}

interface SignupResponseData {
  id: number;
  username: string;
  message: string;
}

export function useAuth() {
  const navigate = useNavigate();

  async function login(usernameOrEmail: string, password: string) {
    const res = await api.post<LoginResponseData>("/api/auth/login", {
      usernameOrEmail,
      password,
    });
    setToken(res.token);
    navigate("/");
  }

  async function signup(username: string, email: string, password: string) {
    await api.post<SignupResponseData>("/api/auth/signup", {
      username,
      email,
      password,
    });
    // Signup doesn't return a token — redirect to login
    navigate("/login");
  }

  function logout() {
    clearToken();
    navigate("/login");
  }

  return { login, signup, logout };
}
