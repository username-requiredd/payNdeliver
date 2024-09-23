"use client"

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignInForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if there's a redirect parameter in the URL
    const redirectParam = searchParams.get('redirect');
    if (redirectParam) {
      // Store the redirect URL in session storage
      sessionStorage.setItem('redirectAfterSignIn', redirectParam);
    }
  }, [searchParams]);

  const validateForm = () => {
    if (!credentials.email || !credentials.password) {
      const errorMsg = "Please fill in all required fields";
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
    if (credentials.email.length < 5) {
      const errorMsg = "Email must be at least 5 characters long";
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
    setError("");
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      const { email, password } = credentials;
      console.log("Attempting sign in with:", { email, password }); 
      
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false
      });
      
      console.log("Sign in response:", login); 
      
      if (login?.error) {
        handleSignInError(login.error);
      } else if (login?.ok) {
        toast.success("Sign in successful, redirecting...");
        console.log("Sign in successful, redirecting...");
        
        // Check if there's a stored redirect URL
        const redirectUrl = sessionStorage.getItem('redirectAfterSignIn');
        if (redirectUrl) {
          sessionStorage.removeItem('redirectAfterSignIn'); // Clear the stored URL
          router.push(redirectUrl);
        } else {
          router.push("/dashboards/business");
        }
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      handleSignInError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInError = (error) => {
    console.error("Sign-in error:", error);
    let errorMsg;

    if (error === "CredentialsSignin") {
      errorMsg = "Invalid credentials. Please check your email and password.";
    } else if (error.message === "Network Error" || error.name === "TypeError") {
      errorMsg = "Unable to connect to the server. Please check your internet connection and try again.";
    } else if (error.message === "Unexpected response from server") {
      errorMsg = "An unexpected error occurred. Please try again later.";
    } else {
      errorMsg = "An error occurred during sign in. Please try again later.";
    }

    setError(errorMsg);
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              minLength={5}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              value={credentials.password}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;