"use client";
import WallpaperGrid from "@/components/WallpaperGrid";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <div className="pt-48 pb-16 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-9xl font-black mb-8 tracking-tighter"
        >
          ESSENTIAL <br /> <span className="text-outline">WALLPAPERS</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm uppercase tracking-[0.3em] opacity-40 max-w-xl mx-auto"
        >
          Curated collection of monochromatic and high-contrast digital art.
        </motion.p>
      </div>
      <WallpaperGrid />
    </div>
  );
}
