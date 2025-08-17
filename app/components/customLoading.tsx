import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div
      className="fixed bottom-4 right-4 flex items-center gap-3
bg-[#F1F7FD] backdrop-blur-md border border-white/20
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
