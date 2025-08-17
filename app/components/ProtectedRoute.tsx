import { motion } from "framer-motion";
import type { JSX } from "react";
import { Navigate } from "react-router";
import { userAuth } from "~/context/AuthContext";

import Loading from "./customLoading";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { session, loading } = userAuth();

  // Show loading while checking authentication
  if (loading) {
    return <Loading />;
  }

  // If user is not logged in, redirect to /
  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children;
}
