import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerUser } from "../api/authApi";

const ROLES = ["CANDIDATE", "EMPLOYEE", "RECRUITER"];

export default function Register() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      await registerUser(data);
      navigate("/login", {
        state: {
          registered: true,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-md bg-bg-card border border-border rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-text-primary mb-6">
          Create an account
        </h1>

        {/* API Error */}
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">
              Name
            </label>

            <input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />

            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

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
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                  message:
                    "Password must contain letters, numbers, and a special character",
                },
              })}
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <p className="text-xs text-text-secondary mt-1">
              At least 8 characters, with letters, numbers, and a special
              character.
            </p>

            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">
              Role
            </label>

            <select
              {...register("role", {
                required: "Please select a role",
              })}
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select a role</option>

              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </option>
              ))}
            </select>

            {errors.role && (
              <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-white rounded py-2 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-text-secondary mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
