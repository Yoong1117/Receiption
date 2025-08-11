// React
import { useEffect, useState } from "react";

// React Router
import type { Route } from "./+types/auth";
import { useNavigate, useNavigation } from "react-router";

// Framer motion
import { motion, AnimatePresence } from "framer-motion";

// React bits
import InfiniteScroll from "@/InfiniteScroll/InfiniteScroll";

// Auth
import { userAuth } from "~/context/AuthContext";

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

  const { session, loading: authLoading } = userAuth();

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
  if (isNavigating) {
    return (
      <div
        className="fixed bottom-4 right-4 flex items-center gap-3
bg-[#E0EDF9] backdrop-blur-md border border-white/20
px-4 py-2 rounded-full shadow-lg shadow-black/30
text-gray-100 z-50"
      >
        <span className="ml-2 text-xs font-medium tracking-wide text-black">
          Loading
        </span>
        {/* Animated dots */}
        <motion.span
          className="w-2 h-2 bg-[#A2CBEE] rounded-full"
          animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
        />
        <motion.span
          className="w-2 h-2 bg-[#5591DC] rounded-full"
          animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
        />
        <motion.span
          className="w-2 h-2 bg-[#3763BE] rounded-full"
          animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
        />
      </div>
    );
  }

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
    <div className="bg-[#F1F7FD]/30 w-full h-screen relative flex justify-center items-center overflow-hidden">
      <div className="relative z-10 flex h-screen items-center justify-center w-full">
        <div
          className="flex min-h-[650px] w-full max-w-[1000px] items-center justify-center gap-8 px-4
             rounded-xl border border-gray-300/10 bg-[#E0EDF9]/50 backdrop-blur-sm"
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
    </div>
  );
}
