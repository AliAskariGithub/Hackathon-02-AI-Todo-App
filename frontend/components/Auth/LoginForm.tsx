"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/auth-provider";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState(""); // Can be email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRedirecting(false);

    try {
      // Determine if identifier is email or username
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      let user_name, email;

      if (isEmail) {
        email = identifier;
        user_name = identifier.split('@')[0]; // Extract username from email
      } else {
        user_name = identifier;
        // For username login, we might need to get the email from backend
        // For now, we'll send both and backend can handle it
        email = ""; // This will be looked up by username on backend
      }

      // Call the backend API to login the user
      const response = await apiClient.post<{access_token: string; token_type: string}>('/api/users/login', {
        user_name,
        email: isEmail ? identifier : "", // Send email if identifier is email
        password,
      });

      if (response.access_token) {
        // First, save the token in localStorage directly to ensure it's available immediately
        localStorage.setItem('auth-token', response.access_token);

        // Then update the auth context
        login(response.access_token);

        // Verify the token was saved by checking localStorage
        const tokenSaved = localStorage.getItem('auth-token');
        if (tokenSaved && tokenSaved === response.access_token) {
          // Show redirecting message
          setRedirecting(true);

          // Small delay to ensure state updates, then redirect using window.location
          // This ensures a full page reload with the authentication state available
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 300);
        } else {
          setError("Login successful but authentication state could not be established. Please try again.");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);

      let errorMessage = "An error occurred during login";

      if (typeof err === 'object' && err !== null && 'message' in err) {
        const errorObj = err as { message?: string; response?: { data?: { detail?: string } } };

        if (errorObj.message?.includes("401")) {
          errorMessage = "Invalid email or password";
        } else if (errorObj.response?.data?.detail) {
          errorMessage = errorObj.response.data.detail;
        } else if ('message' in errorObj && typeof errorObj.message === 'string') {
          errorMessage = errorObj.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {redirecting && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Successfully logged in. Redirecting to dashboard...</span>
          </div>
        )}

        <div>
          <label htmlFor="identifier" className="block text-sm font-medium mb-1">
            Email or Username
          </label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            aria-describedby="identifier-help"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your email or username"
          />
          <p id="identifier-help" className="sr-only">Enter your email or username</p>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-describedby="password-help"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your password"
          />
          <p id="password-help" className="sr-only">Enter your password</p>
        </div>

        <button
          type="submit"
          disabled={loading || redirecting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading || redirecting ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {redirecting ? "Redirecting..." : loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}