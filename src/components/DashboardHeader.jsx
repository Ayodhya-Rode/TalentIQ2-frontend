import { Sun, Moon, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader({ title }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-card">
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="p-2 rounded-full text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div>
        <h1 className="text-xl font-bold text-text-primary">{title}</h1>
        <p className="text-sm text-text-secondary">
          Welcome back, {user?.name}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-full text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-red-500 transition-colors px-3 py-2 rounded-full hover:bg-bg-secondary"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
