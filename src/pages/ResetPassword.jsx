import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../api/authApi";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, otp } = location.state || {};

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, otp, navigate]);

  if (!email || !otp) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const password = newPassword.trim();

    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        email: normalizedEmail,
        otp,
        newPassword: password,
      });

      navigate("/login", {
        replace: true,
        state: { passwordReset: true },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-md bg-bg-card border border-border rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-text-primary mb-2">
          Reset password
        </h1>

        <p className="text-sm text-text-secondary mb-6">
          Enter your new password below.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) setError("");
              }}
              autoComplete="new-password"
              placeholder="Enter new password"
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError("");
              }}
              autoComplete="new-password"
              placeholder="Confirm new password"
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-white rounded py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}