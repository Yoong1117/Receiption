import type { JSX } from "react";
import { Navigate } from "react-router";
import { userAuth } from "~/context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { session, loading } = userAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
          <div
            className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to /
  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children;
}
