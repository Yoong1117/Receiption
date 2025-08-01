import React, { useState } from "react";

// Framer motion
import { motion, AnimatePresence } from "framer-motion";

// UI Components
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

// React bits
import InfiniteScroll from "../../react_bits/InfiniteScroll/InfiniteScroll";

const items = [
  { content: "Food • RM52.50 • GrabPay" },
  { content: "Electrical Bill • RM120.50 • CIMB Bank" },
  { content: "Water Bill • RM45.20 • Maybank" },
  { content: "Internet Bill • RM89.90 • Maybank" },
  { content: "TV Subscription • RM39.99 • CIMB Bank" },
  { content: "Gas Bill • RM62.30 • ShopeePay" },
  { content: "Groceries • RM128.75 • Touch 'n Go" },
  { content: "Ride • RM18.40 • GrabPay" },
  { content: "Coffee • RM12.00 • Touch 'n Go" },
  { content: "Movie Tickets • RM28.00 • CIMB Bank" },
  { content: "Parking Fee • RM6.50 • Touch 'n Go" },
  { content: "Online Shopping • RM220.99 • ShopeePay" },
  { content: "Pharmacy • RM35.40 • GrabPay" },
];

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);

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
          className="flex min-h-[600px] w-full max-w-[1000px] items-center justify-center gap-8 px-4
             rounded-xl border border-gray-300/10 bg-white/10"
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
                  <Card className="w-full max-w-sm bg-white/90">
                    <CardHeader>
                      <CardTitle>Join Receiption today</CardTitle>
                      <CardDescription>
                        Sign up for a new account
                      </CardDescription>
                      <CardAction>
                        <Button
                          variant="link"
                          onClick={() => setIsSignUp(false)}
                        >
                          Back to Login
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardContent>
                      <form>
                        <div className="flex flex-col gap-6">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Username</Label>
                            <Input
                              className="border border-gray-400 focus:border-gray-600"
                              id="name"
                              type="text"
                              placeholder="John"
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
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="password">Confirm Password</Label>
                            <Input
                              className="border border-gray-400 focus:border-gray-600"
                              id="password2"
                              type="password2"
                              placeholder="**********"
                              required
                            />
                          </div>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                      <Button type="submit" className="w-full">
                        Sign Up
                      </Button>
                    </CardFooter>
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
                  <Card className="w-full max-w-sm bg-white/90">
                    <CardHeader>
                      <CardTitle>Welcome Back!</CardTitle>
                      <CardDescription>Login to your account</CardDescription>
                      <CardAction>
                        <Button
                          variant="link"
                          onClick={() => setIsSignUp(true)}
                        >
                          Sign Up
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardContent>
                      <form>
                        <div className="flex flex-col gap-6">
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              className="border border-gray-400 focus:border-gray-600"
                              id="email"
                              type="email"
                              placeholder="John@example.com"
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
                              required
                            />
                          </div>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                      <Button type="submit" className="w-full">
                        Login
                      </Button>
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
