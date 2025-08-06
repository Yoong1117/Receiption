import { motion } from "framer-motion";
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
      <div
        className="fixed bottom-4 right-4 flex items-center gap-3
bg-black/50 backdrop-blur-md border border-white/20
px-4 py-2 rounded-full shadow-lg shadow-black/30
text-gray-100 z-50"
      >
        {/* Animated dots */}
        <motion.span
          className="w-2 h-2 bg-white rounded-full"
          animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
        />
        <motion.span
          className="w-2 h-2 bg-white rounded-full"
          animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
        />
        <motion.span
          className="w-2 h-2 bg-white rounded-full"
          animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
        />
        <span className="ml-2 text-xs font-medium tracking-wide text-gray-200">
          Loading
        </span>
      </div>
    );
  }

  // If user is not logged in, redirect to /
  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children;
}
