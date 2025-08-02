import type { JSX } from "react";
import { Navigate } from "react-router";
import { userAuth } from "~/context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { session } = userAuth();

  // If user is not logged in, redirect to /auth
  if (!session) {
    return <Navigate to="/" replace />;
  }
  return children;
}
