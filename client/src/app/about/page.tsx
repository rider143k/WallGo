"use client";
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="pt-48 pb-32 px-6 max-w-4xl mx-auto">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-black mb-16 tracking-tighter"
            >
                THE <span className="text-white/20">VISION</span>
            </motion.h1>

            <div className="space-y-12 text-white/60 text-lg leading-relaxed">
                <section>
                    <h2 className="text-white text-2xl font-bold mb-6 uppercase tracking-widest">Minimalist Soul</h2>
                    <p>
                        WallGo was born from a simple desire: to eliminate the noise. In a world of cluttered
                        interfaces and oversaturated visuals, we provide a sanctuary of monochromatic art.
                        Every wallpaper is a tribute to the power of contrast, light, and Shadow.
                    </p>
                </section>

                <section>
                    <h2 className="text-white text-2xl font-bold mb-6 uppercase tracking-widest">Premium Curation</h2>
                    <p>
                        We don't just host images; we curate experiences. Our library is divided into
                        Desktop and Mobile specific formats to ensure that the art you choose fits
                        perfectly on your digital canvas. No stretching, no pixelation—just pure aesthetic.
                    </p>
                </section>

                <section>
                    <h2 className="text-white text-2xl font-bold mb-6 uppercase tracking-widest">Built for Fans</h2>
                    <p>
                        Whether you're a PC enthusiast or a mobile power-user, WallGo is built for you.
                        Our platform is designed to be as minimalist as the art we host—fast, smooth,
                        and strictly monochromatic.
                    </p>
                </section>
            </div>
        </div>
    );
}
