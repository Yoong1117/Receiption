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
  const [loading, setLoading] = useState<boolean>(false);

  const {
    signUpNewUser,
    loginUser,
    signInWithGoogle,
    session,
    loading: authLoading,
  } = userAuth();

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

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError([]);

    try {
      const result = await signInWithGoogle();

      if (!result.success) {
        console.log("Google sign-in failed");
        setError([result.data || "- Google sign-in failed"]);
      }
    } catch (err) {
      setError(["- A network or server error occurred"]);
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
                          className="ml-auto mt-2 inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </CardFooter>
                    </form>

                    <Separator />

                    <CardFooter className="flex-col gap-2">
                      <Label className="text-xs mb-2">Or</Label>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
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
