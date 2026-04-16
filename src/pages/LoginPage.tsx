import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input, Button } from "@/components/ui/FormElements";
import { loginApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import type { ApiError } from "@/lib/api";
import { resolveErrorMessage, SUCCESS_MESSAGES } from "@/lib/messages";
import toast from "react-hot-toast";

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const { startDemo } = useDemo();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Invalid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await loginApi(email, password);
      // Ensure the correct properties from LoginResponse are set
      setAuthData(res.data);
      toast.success(SUCCESS_MESSAGES.loginSuccess);
      navigate("/");
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(resolveErrorMessage(apiErr.message, "Login failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthLayout>
        <div className="space-y-1 text-center">
          <h2 className="font-heading text-2xl font-semibold text-(--foreground)">
            Welcome back
          </h2>
          <p className="text-sm text-(--muted-foreground)">
            
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-(--muted-foreground) hover:text-(--foreground) transition-colors"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
      </AuthLayout>

      {/* Demo mode button — portal to escape AuthLayout's relative container */}
      {ReactDOM.createPortal(
        <div className="fixed bottom-2 md:bottom-6 md:right-6 md:translate-x-0 md:left-auto left-1/2 -translate-x-1/2 z-50">
          <button
            type="button"
            onClick={() => {
              startDemo();
              navigate("/");
            }}
            className="group flex items-center gap-2 rounded-full border border-(--border) bg-(--card) px-4 py-2.5 text-sm font-medium text-(--muted-foreground) shadow-lg transition-all hover:border-gold-400/50 hover:text-gold-400 hover:shadow-gold-400/10"
            style={{
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.3), 0 0 10px rgba(218,165,32,0.05)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Try Demo
          </button>
        </div>,
        document.body,
      )}
    </>
  );
}
