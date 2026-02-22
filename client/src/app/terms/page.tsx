"use client";
import { motion } from 'framer-motion';

export default function TermsPage() {
    return (
        <div className="pt-48 pb-32 px-6 max-w-4xl mx-auto">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-black mb-16 tracking-tighter"
            >
                LEGAL <span className="text-white/20">CODE</span>
            </motion.h1>

            <div className="space-y-10 text-white/60 text-sm leading-relaxed">
                <p>Effective Date: February 2026</p>

                <section>
                    <h2 className="text-white text-xl font-bold mb-4 uppercase tracking-widest">Usage Rights</h2>
                    <p>
                        The wallpapers provided on WallGo are free for personal use on your digital devices.
                        Commercial redistribution, resale, or hosting of these images on other platforms
                        without explicit permission is strictly prohibited.
                    </p>
                </section>

                <section>
                    <h2 className="text-white text-xl font-bold mb-4 uppercase tracking-widest">Platform Integrity</h2>
                    <p>
                        Any attempt to scrape or disrupt the automated services involving Cloudinary or
                        our MongoDB infrastructure will result in immediate IP blacklisting.
                    </p>
                </section>

                <section>
                    <h2 className="text-white text-xl font-bold mb-4 uppercase tracking-widest">Disclaimer</h2>
                    <p>
                        Art is subjective. WallGo provides these assets "as-is" without warranty
                        of any kind regarding visual satisfaction or technical compatibility.
                    </p>
                </section>
            </div>
        </div>
    );
}
