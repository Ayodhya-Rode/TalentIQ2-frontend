import { useState } from "react";
import { Sun, Moon, LogOut, ArrowLeft, LifeBuoy, KeyRound, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import RaiseQueryModal from "./RaiseQueryModal";
import ChangePasswordModal from "./ChangePasswordModal";

const QUERY_ROLES = ["CANDIDATE", "EMPLOYEE", "RECRUITER"];

export default function DashboardHeader({ title }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-bg-card">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-2 rounded-full text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-text-primary truncate">{title}</h1>
            <p className="text-xs sm:text-sm text-text-secondary truncate hidden sm:block">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {QUERY_ROLES.includes(user?.role) && (
            <button
              onClick={() => setShowQueryModal(true)}
              className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent transition-colors px-3 py-2 rounded-full hover:bg-bg-secondary"
            >
              <LifeBuoy size={16} />
              Raise a Query
            </button>
          )}
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent transition-colors px-3 py-2 rounded-full hover:bg-bg-secondary"
          >
            <KeyRound size={16} />
            Change Password
          </button>
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

        {/* Mobile: theme toggle always visible + menu button */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 text-text-primary"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-1">
          {QUERY_ROLES.includes(user?.role) && (
            <button
              onClick={() => {
                setShowQueryModal(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent transition-colors px-3 py-2 rounded-lg hover:bg-bg-secondary text-left"
            >
              <LifeBuoy size={16} />
              Raise a Query
            </button>
          )}
          <button
            onClick={() => {
              setShowPasswordModal(true);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent transition-colors px-3 py-2 rounded-lg hover:bg-bg-secondary text-left"
          >
            <KeyRound size={16} />
            Change Password
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-bg-secondary text-left"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}

      {showQueryModal && <RaiseQueryModal onClose={() => setShowQueryModal(false)} />}
      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </header>
  );
}