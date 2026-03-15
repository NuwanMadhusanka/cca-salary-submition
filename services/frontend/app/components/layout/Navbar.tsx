import { Link, useNavigate } from "react-router";
import { clearToken } from "~/lib/auth";

export function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-lg font-semibold text-gray-900">
        Salary Portal
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
          Dashboard
        </Link>
        <Link to="/submit" className="text-sm text-gray-600 hover:text-gray-900">
          Submit
        </Link>
        <Link to="/stats" className="text-sm text-gray-600 hover:text-gray-900">
          Stats
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
