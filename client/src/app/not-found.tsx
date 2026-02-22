"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <main className="fixed inset-0 z-[9999] w-full h-full bg-[#050505] flex items-center justify-center p-6 overflow-hidden">
            {/* Background Texture & Ambient Lights */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-white/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 text-center flex flex-col items-center">
                {/* CYBER TEDDY - CSS ILLUSTRATION */}
                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [-20, 20, -20] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-48 h-48 mb-16"
                >
                    {/* Teddy Head */}
                    <div className="absolute inset-0 bg-[#222] rounded-[3rem] border-2 border-white/10 shadow-2xl flex items-center justify-center flex-col overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>

                        {/* Eyes - Glowing Neo-Glasses */}
                        <div className="flex gap-4 mb-4 relative z-10">
                            <div className="w-10 h-3 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse"></div>
                            <div className="w-10 h-3 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse"></div>
                        </div>

                        {/* Teddy Mouth Area */}
                        <div className="w-8 h-4 bg-white/5 rounded-full border border-white/10"></div>
                        <div className="absolute bottom-4 text-[8px] font-black tracking-widest text-white/20 uppercase">Model: T-404</div>
                    </div>

                    {/* Ears */}
                    <div className="absolute -top-4 -left-2 w-16 h-16 bg-[#1a1a1a] rounded-full border-2 border-white/5 z-0"></div>
                    <div className="absolute -top-4 -right-2 w-16 h-16 bg-[#1a1a1a] rounded-full border-2 border-white/5 z-0"></div>

                    {/* Glitch Overlay Particles */}
                    <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                        className="absolute -inset-4 border border-red-500/30 rounded-[4rem] pointer-events-none"
                    ></motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="mb-8 overflow-hidden">
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                            LOST IN <span className="text-white/20">DATA</span>
                        </h1>
                    </div>

                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] text-white/40 mb-12 max-w-xs mx-auto leading-relaxed">
                        The requested artifact has drifted into the void of the multiverse.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/" className="px-10 py-5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10">
                            Return to Base
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Reconnect Signal
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Matrix Particles Effect */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: -100, x: Math.random() * 100 + "%", opacity: 0 }}
                        animate={{ y: "110vh", opacity: [0, 0.2, 0] }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "linear"
                        }}
                        className="absolute w-[1px] h-20 bg-gradient-to-t from-red-500 to-transparent"
                    />
                ))}
            </div>

            {/* Corner Metadata */}
            <div className="absolute top-12 left-12 flex flex-col gap-2 opacity-20">
                <div className="text-[8px] font-mono font-bold uppercase tracking-widest">Protocol: 0x404_VOID</div>
                <div className="text-[8px] font-mono font-bold uppercase tracking-widest">Target: Unreachable</div>
            </div>

            <div className="absolute bottom-12 right-12 flex items-center gap-4 opacity-10">
                <div className="text-[300px] font-black leading-none select-none tracking-tighter">404</div>
            </div>
        </main>
    );
}
