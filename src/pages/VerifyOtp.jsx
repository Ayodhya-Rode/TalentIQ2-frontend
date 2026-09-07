import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp } from "../api/authApi";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  if (!email) {
    return null;
  }

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const newDigits = [...digits];
    newDigits[index] = digit;

    setDigits(newDigits);

    if (error) {
      setError("");
    }

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !digits[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const newDigits = ["", "", "", "", "", ""];

    pasted.split("").forEach((char, i) => {
      newDigits[i] = char;
    });

    setDigits(newDigits);
    setError("");

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otp = digits.join("");

    if (otp.length !== 6) {
      setError("Enter all 6 digits");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp({
        email: email.trim().toLowerCase(),
        otp,
      });

      navigate("/reset-password", {
        state: {
          email: email.trim().toLowerCase(),
          otp,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired OTP",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-md bg-bg-card border border-border rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-text-primary mb-2">
          Verify OTP
        </h1>

        <p className="text-sm text-text-secondary mb-6">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium">{email}</span>
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className="flex justify-center gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={
                  index === 0 ? "one-time-code" : "off"
                }
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(index, e.target.value)
                }
                onKeyDown={(e) =>
                  handleKeyDown(index, e)
                }
                disabled={loading}
                aria-label={`OTP digit ${index + 1}`}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-semibold rounded-lg border-2 bg-bg-secondary text-text-primary transition-all duration-150 outline-none
                  ${
                    digit
                      ? "border-accent shadow-[0_0_0_3px_rgba(59,91,219,0.15)]"
                      : "border-border"
                  }
                  focus:border-accent focus:shadow-[0_0_0_3px_rgba(59,91,219,0.2)] focus:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || digits.join("").length !== 6}
            className="w-full bg-accent hover:bg-accent-hover text-white rounded py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}