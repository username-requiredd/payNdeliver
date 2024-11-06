"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Loader2, EyeOff, Eye } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) {
      // Store redirect URL in a cookie instead of sessionStorage
      document.cookie = `redirectAfterSignIn=${encodeURIComponent(
        redirectParam
      )}; path=/; max-age=3600; SameSite=Strict; Secure`;
    }
  }, [searchParams]);

  const validateForm = () => {
    if (!credentials.email || !credentials.password) {
      toast.error("Please fill in all required fields");
      return false;
    }
    if (!isValidEmail(credentials.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const { email, password } = credentials;
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        handleSignInError(result.error);
      } else if (result?.ok) {
        toast.success("Sign in successful, redirecting...");
        // handleSuccessfulSignIn();
        router.push("/dashboards/business/setup");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      handleSignInError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessfulSignIn = () => {
    // Retrieve redirect URL from cookie
    const cookies = document.cookie.split(";");
    const redirectCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("redirectAfterSignIn=")
    );
    let redirectUrl = null;

    if (redirectCookie) {
      redirectUrl = decodeURIComponent(redirectCookie.split("=")[1]);
      // Clear the cookie
      document.cookie =
        "redirectAfterSignIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    if (redirectUrl) {
      router.push("/dashboards/business/setup");
    } else {
      const role =
        session?.user?.role === "business" ? "/dashboards/business" : "/stores";
      router.push(role);
    }
  };

  const handleSignInError = (error) => {
    console.error("Sign-in error:", error);
    let errorMsg;

    if (error === "CredentialsSignin") {
      errorMsg = "Invalid credentials. Please check your email and password.";
    } else if (
      error.message === "Network Error" ||
      error.name === "TypeError"
    ) {
      errorMsg =
        "Unable to connect to the server. Please check your internet connection and try again.";
    } else if (error.message === "Unexpected response from server") {
      errorMsg = "An unexpected error occurred. Please try again later.";
    } else {
      errorMsg = "An error occurred during sign in. Please try again later.";
    }

    toast.error(errorMsg);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Sign in
        </h1>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              value={credentials.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              id="email"
              type="email"
              name="email"
              placeholder="Your email address"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                value={credentials.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

const SignInForm = () => {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
};

export default SignInForm;
