import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { toast } from "react-toastify";

import { registerUser } from "../api/authApi";

const ROLES = ["CANDIDATE", "EMPLOYEE", "RECRUITER"];

export default function Register() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    setLoading(true);

    try {
      await registerUser(data);

      toast.success(
        "Registration successful! Waiting for Super Admin approval."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-sm tracking-tight">
              TQ
            </div>

            <span className="text-2xl font-bold text-text-primary">
              TalentIQ
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold text-text-primary leading-tight">
            Build your
            <br />
            <span className="text-accent">interview journey.</span>
          </h2>

          <p className="mt-5 text-text-secondary leading-relaxed max-w-md">
            Join TalentIQ to practice interviews, connect with experienced
            professionals, and take your interview skills to the next level.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-4">

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                ✓
              </div>

              <span className="text-sm text-text-secondary">
                Create your professional profile
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                ✓
              </div>

              <span className="text-sm text-text-secondary">
                Connect with experienced professionals
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                ✓
              </div>

              <span className="text-sm text-text-secondary">
                Practice and improve your interview skills
              </span>
            </div>

          </div>
        </div>

        {/* Register Section */}
        <div className="p-6 sm:p-8 lg:p-10">

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
          <div className="lg:hidden flex items-center justify-center gap-2 mb-7">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xs tracking-tight">
              TQ
            </div>

            <span className="text-xl font-bold text-text-primary">
              TalentIQ
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-primary">
              Create an account
            </h1>

            <p className="mt-2 text-sm text-text-secondary">
              Join TalentIQ and start your interview journey.
            </p>
          </div>

          {/* API Error */}
          {error && (
            <div className="mb-5 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Full name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-3 py-2.5 text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
              </div>

              {errors.name && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
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
                  })}
                  className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-3 py-2.5 text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
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
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
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
                  className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-11 py-2.5 text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
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

              <p className="text-xs text-text-secondary mt-1.5">
                At least 8 characters with letters, numbers, and a special
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
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                I want to join as
              </label>

              <div className="relative">
                <Briefcase
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                />

                <select
                  {...register("role", {
                    required: "Please select a role",
                  })}
                  className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-3 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition appearance-none"
                >
                  <option value="">Select your role</option>

                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0) + role.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {errors.role && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white rounded-xl py-3 font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-text-secondary mt-5 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent font-medium hover:underline"
            >
              Log in
            </Link>
          </p>

          {/* Bottom Note */}
          <p className="text-xs text-text-secondary/60 text-center mt-6">
            Your account may require approval before you can log in.
          </p>
        </div>
      </div>
    </div>
  );
}
