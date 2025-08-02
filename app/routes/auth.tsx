// React
import React, { useEffect, useState } from "react";

// React Router
import type { Route } from "./+types/auth";
import { useNavigate } from "react-router";

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

// React bits
import InfiniteScroll from "../../react_bits/InfiniteScroll/InfiniteScroll";
import { userAuth } from "~/context/AuthContext";

// Icon
import { CircleX } from "lucide-react";

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

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [error, setError] = useState<string[]>([]);
  const [loading, setLoading] = useState<Boolean>();

  const { signUpNewUser, loginUser } = userAuth();
  const navigate = useNavigate();

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

  // Handle login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Fresh array
    const newErrors: string[] = [];

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        setError([]);
        navigate("/dashboard");
      } else {
        setError([...newErrors, result.data]);
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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      <div className="relative z-10 flex h-screen items-center justify-center w-full">
        <div
          className="flex min-h-[650px] w-full max-w-[1000px] items-center justify-center gap-8 px-4
             rounded-xl border border-gray-300/10 bg-white/7"
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
                  <Card className="w-full max-w-sm bg-white/99">
                    <CardHeader>
                      <CardTitle>Join Receiption today</CardTitle>
                      <CardDescription>
                        Sign up for a new account
                      </CardDescription>
                      <CardAction>
                        <Button
                          variant="link"
                          onClick={() => {
                            setError([]);
                            setIsSignUp(false);
                          }}
                        >
                          Back to Login
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <form onSubmit={handleSignUp}>
                      <CardContent>
                        <input type="hidden" name="action" value="signup" />
                        <div className="flex flex-col gap-6">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Username</Label>
                            <Input
                              className="border border-gray-400 focus:border-gray-600"
                              id="name"
                              type="text"
                              placeholder="John"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              className="border border-gray-400 focus:border-gray-600"
                              id="email"
                              type="email"
                              placeholder="John@example.com"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                // if (error && e.target.validity.valid) setError("");
                              }}
                              onInvalid={(e) => {
                                // e.preventDefault(); // Stop default browser tooltip
                                // setError("Email must contain '@'");
                              }}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              className="border border-gray-400 focus:border-gray-600"
                              id="password"
                              type="password"
                              placeholder="**********"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="password">Confirm Password</Label>
                            <Input
                              className="border border-gray-400 focus:border-gray-600"
                              id="password2"
                              type="password"
                              placeholder="**********"
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex-col gap-2">
                        {error.length > 0 && isSignUp && (
                          <Alert
                            variant="destructive"
                            className="bg-gray-100 border border-gray-500 mt-6"
                          >
                            <CircleX />
                            <AlertTitle>Unable to sign up</AlertTitle>
                            <AlertDescription>
                              {error.map((err, idx) => (
                                <div key={idx}>{err}</div>
                              ))}
                            </AlertDescription>
                          </Alert>
                        )}

                        <Button
                          type="submit"
                          className={`w-full ${error ? "mt-4" : "mt-6"}`}
                        >
                          Sign Up
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
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
                  <Card className="w-full max-w-sm bg-white/99">
                    <CardHeader>
                      <CardTitle>Welcome Back!</CardTitle>
                      <CardDescription>Login to your account</CardDescription>
                      <CardAction>
                        <Button
                          variant="link"
                          onClick={() => {
                            setError([]);
                            setIsSignUp(true);
                          }}
                        >
                          Sign Up
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                      <CardContent>
                        <div className="flex flex-col gap-6">
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              className="border border-gray-400 focus:border-gray-600"
                              id="email"
                              type="email"
                              placeholder="John@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              className="border border-gray-400 focus:border-gray-600"
                              id="password"
                              type="password"
                              placeholder="**********"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col gap-2 mt-4">
                        {error.length > 0 && !isSignUp && (
                          <Alert
                            variant="destructive"
                            className="bg-gray-100 border border-gray-500"
                          >
                            <CircleX />
                            <AlertTitle>Unable to Login</AlertTitle>
                            <AlertDescription>
                              {error.map((err, idx) => (
                                <div key={idx}>{err}</div>
                              ))}
                            </AlertDescription>
                          </Alert>
                        )}

                        <Button
                          type="submit"
                          className={`w-full ${error.length > 0 ? "mt-2" : "mt-4"}`}
                        >
                          Login
                        </Button>

                        <a
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </CardFooter>
                    </form>

                    <CardFooter className="flex-col gap-2">
                      <Button variant="outline" className="w-full">
                        Login with Google
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
