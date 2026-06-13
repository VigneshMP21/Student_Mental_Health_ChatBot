"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { validateEmail, validatePassword } from "@/utils/security";
import Button from "@/components/ui/Button";
import { Brain, Mail, ArrowLeft, KeyRound, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

type ForgotStage = "email" | "otp" | "password" | "success";

export default function ForgotPasswordPage() {
  const [stage, setStage] = useState<ForgotStage>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const normalizedEmail = email.trim().toLowerCase();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateEmail(normalizedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail }),
    });
    const data: { error?: string } = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Failed to send reset code");
      setLoading(false);
      return;
    }

    setStage("otp");
    setOtp("");
    setMessage(`We sent a password reset code to ${normalizedEmail}.`);
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const token = otp.trim();
    if (token.length < 6) {
      setError("Please enter the OTP from your email");
      return;
    }

    setLoading(true);
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token,
      type: "recovery",
    });

    if (verifyError || !data.session) {
      setError("Invalid or expired OTP");
      setLoading(false);
      return;
    }

    setStage("password");
    setMessage("OTP verified. Choose a new password.");
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) {
      setError(pwCheck.message!);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    setPassword("");
    setConfirmPassword("");
    setStage("success");
    setLoading(false);
  };

  const getTitle = () => {
    if (stage === "otp") return "Verify OTP";
    if (stage === "password") return "Set new password";
    if (stage === "success") return "Password changed";
    return "Forgot password";
  };

  const getSubtitle = () => {
    if (stage === "otp") return "Enter the code sent to your email";
    if (stage === "password") return "Choose a strong password for your account";
    if (stage === "success") return "You can now sign in with your new password";
    return "Enter your account email to receive an OTP";
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
              <Brain className="h-6 w-6" aria-hidden="true" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{getTitle()}</h1>
          <p className="mt-2 text-sm text-slate-600">{getSubtitle()}</p>
        </div>

        {stage === "success" ? (
          <div className="glass rounded-2xl p-8 shadow-xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="text-sm leading-6 text-slate-600 mb-6">
              Your password has been updated successfully.
            </p>
            <Link href="/login" className="btn-primary w-full">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form
            onSubmit={
              stage === "email"
                ? handleSendOtp
                : stage === "otp"
                  ? handleVerifyOtp
                  : handleChangePassword
            }
            className="glass rounded-2xl p-8 shadow-xl space-y-5"
            noValidate
          >
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700" role="status">
                {message}
              </div>
            )}

            {stage === "email" && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="you@university.edu"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full">
                  Send OTP
                </Button>
              </>
            )}

            {stage === "otp" && (
              <>
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1.5">
                    OTP
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="input-field pl-10 text-center"
                      placeholder="000000"
                      required
                      autoComplete="one-time-code"
                    />
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full">
                  Verify OTP
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setStage("email");
                    setError("");
                    setMessage("");
                    setOtp("");
                  }}
                  className="flex w-full items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Change email
                </button>
              </>
            )}

            {stage === "password" && (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-10 pr-10"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field pl-10"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full">
                  Change Password
                </Button>
              </>
            )}

            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
