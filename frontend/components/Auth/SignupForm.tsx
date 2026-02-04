"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/services/api-client";
import { Spinner } from "@/components/ui/spinner";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the backend API to register the user
      const response = await apiClient.post<{id: string; user_name: string; email: string; created_at: string}>('/api/users/register', {
        user_name: username,
        email,
        password,
      });

      if (response) {
        // Registration successful, now login the user
        const loginResponse = await apiClient.post<{access_token: string; token_type: string}>('/api/users/login', {
          user_name: username,
          email,
          password,
        });

        if (loginResponse.access_token) {
          // Store the token in localStorage
          localStorage.setItem('auth-token', loginResponse.access_token);

          // Redirect to dashboard
          router.push("/dashboard");
          router.refresh(); // Refresh to update UI based on auth state
        } else {
          setError("Registration successful but login failed. Please try logging in.");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Signup error:", err);

      let errorMessage = "An error occurred during signup";

      if (typeof err === 'object' && err !== null && 'message' in err) {
        const errorObj = err as { message?: string; response?: { data?: { detail?: string } } };

        if (errorObj.message?.includes("409")) {
          errorMessage = "A user with this email already exists";
        } else if (errorObj.message?.includes("422")) {
          errorMessage = "Invalid input data. Please check your information.";
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

        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-describedby="username-help"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your username"
          />
          <p id="username-help" className="sr-only">Enter your username</p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-describedby="email-help"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your email"
          />
          <p id="email-help" className="sr-only">Enter your email address</p>
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            aria-describedby="confirm-password-help"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Confirm your password"
          />
          <p id="confirm-password-help" className="sr-only">Confirm your password</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {loading ? (
            <>
              <Spinner className="mr-2 h-4 w-4 animate-spin" />
              Signing up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
    </div>
  );
}