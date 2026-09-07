import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
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
      await login(data.email, data.password);

      reset();
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";

      const isPendingApproval =
        message.toLowerCase().includes("pending") ||
        message.toLowerCase().includes("approval");

      if (isPendingApproval) {
        // Show pending approval message
        setError(message);

        // Clear email and password fields
        reset();

        // Automatically hide message after 2 seconds
        setTimeout(() => {
          setError("");
        }, 2000);
      } else {
        // Show other login errors normally
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        {/* Left Branding Section */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-bg-secondary border-r border-border">
          <div className="mb-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-lg">
                TQ
              </div>

              <span className="text-2xl font-bold text-text-primary">
                TalentIQ
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl font-bold text-text-primary leading-tight">
              Practice smarter.
              <br />
              <span className="text-accent">Interview better.</span>
            </h2>

            <p className="mt-5 text-text-secondary leading-relaxed max-w-md">
              Connect with experienced professionals, practice real-world
              interviews, and build the confidence you need to succeed.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                ✓
              </div>

              <span className="text-sm text-text-secondary">
                Practice with experienced interviewers
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                ✓
              </div>

              <span className="text-sm text-text-secondary">
                Get meaningful interview feedback
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                ✓
              </div>

              <span className="text-sm text-text-secondary">
                Improve your interview confidence
              </span>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="p-6 sm:p-8 lg:p-12">
          {/* Back to Home */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white font-bold">
              TQ
            </div>

            <span className="text-xl font-bold text-text-primary">
              TalentIQ
            </span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-3xl font-bold text-text-primary">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-text-secondary">
              Log in to continue to your TalentIQ account.
            </p>
          </div>

          {/* API Error / Pending Approval Message */}
          {error && (
            <div className="mb-5 text-sm text-amber-600 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",

                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },

                    onChange: () => {
                      if (error) {
                        setError("");
                      }
                    },
                  })}
                  className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-3 py-3 text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
              </div>

              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",

                    onChange: () => {
                      if (error) {
                        setError("");
                      }
                    },
                  })}
                  className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-11 py-3 text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white rounded-xl py-3 font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Log in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <p className="text-sm text-text-secondary mt-6 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-accent font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>

          {/* Forgot Password */}
          <p className="text-sm text-text-secondary mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-accent font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </p>

          {/* Bottom Trust Text */}
          <p className="text-xs text-text-secondary/60 text-center mt-8">
            Secure access to your TalentIQ account
          </p>
        </div>
      </div>
    </div>
  );
}