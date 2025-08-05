// React
import React, { useEffect, useState } from "react";

// React Router
import type { Route } from "./+types/auth";
import { useNavigate, useNavigation } from "react-router";

// Framer motion
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Separator } from "~/components/ui/separator";

// React bits
import InfiniteScroll from "@/InfiniteScroll/InfiniteScroll";

// Auth
import { userAuth } from "~/context/AuthContext";

// Icon
import { CircleX } from "lucide-react";

// Hooks
import LoginForm from "~/components/auth/LoginForm";
import SignupForm from "~/components/auth/SignupForm";

const items = [
  { content: "Food • RM52.50" },
  { content: "Electrical Bill • RM120.50" },
  { content: "Water Bill • RM45.20" },
  { content: "Internet Bill • RM89.90" },
  { content: "TV Subscription • RM39.99" },
  { content: "Gas Bill • RM62.30" },
  { content: "Groceries • RM128.75" },
  { content: "Ride • RM18.40" },
  { content: "Coffee • RM12.00" },
  { content: "Movie Tickets • RM28.00" },
  { content: "Parking Fee • RM6.50" },
  { content: "Online Shopping • RM220.99" },
  { content: "Pharmacy • RM35.40" },
];

export function meta({}: Route.MetaArgs) {
  return [{ title: "Receiption" }];
}

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [error, setError] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { signUpNewUser, session, loading: authLoading } = userAuth();

  const navigate = useNavigate();
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  // Redirect if already authenticated
  useEffect(() => {
    if (session && !authLoading) {
      navigate("/dashboard");
    }
  }, [session, authLoading, navigate]);

  // Navigation state
  //if (isNavigating) {
  //  return <p>Navigating ...</p>;
  //}

  // Google login

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Fresh array
    const newErrors: string[] = [];

    // Client-side validations first
    if (!email.includes("@")) {
      newErrors.push("- Email must contain '@'");
    }
    if (password !== confirmPassword) {
      newErrors.push("- Passwords do not match");
    }

    try {
      const result = await signUpNewUser(email, password, username);

      if (!result.success) {
        newErrors.push("- " + result.data || "- An error occurred");
      }

      if (newErrors.length > 0) {
        setError(newErrors); // Combine messages into one string
      } else {
        setError([]);
        window.location.reload();
      }
    } catch (err) {
      newErrors.push("- A network or server error occurred");
      setError(newErrors);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Card Animation
  const cardVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.4 },
    }),
  };

  // Scroll Animation
  const scrollVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      transition: { duration: 0.4 },
    }),
  };

  return (
    <div className="w-full h-screen relative flex justify-center items-center overflow-hidden">
      <div className="relative z-10 flex h-screen items-center justify-center w-full">
        <div
          className="flex min-h-[650px] w-full max-w-[1000px] items-center justify-center gap-8 px-4
             rounded-xl border border-gray-300/10 bg-gray-900/10 backdrop-blur-sm"
        >
          <AnimatePresence custom={isSignUp ? 1 : -1} mode="wait">
            {isSignUp ? (
              <>
                {/* Left: Sign Up Card */}
                <motion.div
                  key="signup-card"
                  custom={1}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1 flex justify-center"
                >
                  <SignupForm onSwitch={() => setIsSignUp(false)} />
                </motion.div>

                {/* Right: Infinite Scroll */}
                <motion.div
                  key="signup-scroll"
                  custom={1}
                  variants={scrollVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="hidden lg:flex flex-1 items-center justify-center overflow-hidden"
                >
                  <div className="relative h-[580px] w-full rounded-xl flex items-center justify-center">
                    <InfiniteScroll
                      items={items}
                      isTilted
                      tiltDirection="right"
                      autoplay
                      autoplaySpeed={0.3}
                      autoplayDirection="up"
                      pauseOnHover={false}
                    />
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                {/* Left: Infinite Scroll */}
                <motion.div
                  key="login-scroll"
                  custom={-1}
                  variants={scrollVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="hidden lg:flex flex-1 items-center justify-center overflow-hidden"
                >
                  <div className="relative h-[580px] w-full rounded-xl flex items-center justify-center">
                    <InfiniteScroll
                      items={items}
                      isTilted
                      tiltDirection="left"
                      autoplay
                      autoplaySpeed={0.3}
                      autoplayDirection="up"
                      pauseOnHover={false}
                    />
                  </div>
                </motion.div>

                {/* Right: Login Card */}
                <motion.div
                  key="login-card"
                  custom={-1}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1 flex justify-center"
                >
                  <LoginForm onSwitch={() => setIsSignUp(true)} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {loading && (
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
      )}
    </div>
  );
}
