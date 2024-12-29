"use client";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

const REDIRECT_COOKIE_NAME = "redirectAfterSignIn";
const MIN_PASSWORD_LENGTH = 4;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Set redirect cookie using useCallback to ensure stability
  const setRedirectCookie = useCallback(() => {
    const redirectUrl = searchParams.get("redirect");
    if (redirectUrl) {
      document.cookie = `${REDIRECT_COOKIE_NAME}=${encodeURIComponent(
        redirectUrl
      )}; path=/; max-age=3600; HttpOnly; Secure; SameSite=Strict`;
    }
    return () => {
      document.cookie = `${REDIRECT_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`;
    };
  }, [searchParams]);

  useEffect(() => {
    setRedirectCookie();
  }, [setRedirectCookie]);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      toast.error(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      );
      return false;
    }
    return true;
  };

  const getErrorMessage = (error) => {
    const errorMap = {
      CredentialsSignin: "Invalid email or password",
      NetworkError: "Connection error. Please check your internet",
      default: "An unexpected error occurred",
    };
    return errorMap[error.message] || errorMap.default;
  };

  const handleSuccessfulSignIn = useCallback(() => {
    router.refresh();

    const redirectCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith(`${REDIRECT_COOKIE_NAME}=`));

    if (redirectCookie) {
      const redirectUrl = decodeURIComponent(redirectCookie.split("=")[1]);
      router.push(redirectUrl);
    } else {
      router.push(
        session?.user?.role === "business" ? "/dashboards/business" : "/stores"
      );
    }
    toast.success("Welcome back!");
  }, [router, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        remember: rememberMe,
        redirect: false,
      });

      if (!result) {
        throw new Error("Sign in failed");
      }

      if (result.ok) {
        handleSuccessfulSignIn();
      } else {
        throw new Error(result.error || "Sign in failed");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-indigo-100 p-4">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-8 transform transition-all hover:scale-[1.01]">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500">
              Please enter your details to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
                aria-label="Email Address"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  aria-label="Password"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>Remember Me</span>
              </label>
              <Link href="/forgot-password">
                <a className="text-sm text-green-600 hover:underline">
                  Forgot Password?
                </a>
              </Link>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </Suspense>
  );
};

export default Login;
