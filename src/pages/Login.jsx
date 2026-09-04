import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/authApi";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const justRegistered = location.state?.registered;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      await loginUser(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-md bg-bg-card border border-border rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-text-primary mb-6">
          Log in
        </h1>

        {/* Registration Success Message */}
        {justRegistered && (
          <div className="mb-4 text-sm text-green-600 bg-green-500/10 border border-green-500/30 rounded px-3 py-2">
            Registration successful. Waiting for Super Admin approval before you
            can log in.
          </div>
        )}

        {/* API Error */}
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">
              Email
            </label>

            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />

            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">
              Password
            </label>

            <input
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />

            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-white rounded py-2 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-sm text-text-secondary mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
