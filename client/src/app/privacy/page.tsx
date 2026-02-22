"use client";
import { motion } from 'framer-motion';

export default function PrivacyPage() {
    return (
        <div className="pt-48 pb-32 px-6 max-w-4xl mx-auto">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-black mb-16 tracking-tighter"
            >
                PRIVACY <span className="text-white/20">FIRST</span>
            </motion.h1>

            <div className="space-y-10 text-white/60 text-sm leading-relaxed">
                <p>Last Updated: February 2026</p>

                <section>
                    <h2 className="text-white text-xl font-bold mb-4 uppercase tracking-widest">Data Collection</h2>
                    <p>
                        WallGo does not track your personal identity. We collect minimal, anonymous usage data
                        to understand which wallpapers are popular and how the site performs. No cookies
                        are used for cross-site tracking or advertising.
                    </p>
                </section>

                <section>
                    <h2 className="text-white text-xl font-bold mb-4 uppercase tracking-widest">Image Content</h2>
                    <p>
                        All images are hosted securely on Cloudinary. We do not store any information about
                        your device beyond what is necessary to serve the correct image size.
                    </p>
                </section>

                <section>
                    <h2 className="text-white text-xl font-bold mb-4 uppercase tracking-widest">Contact</h2>
                    <p>
                        For any privacy-related inquiries, reach out to us at support@wallgo.premium.
                    </p>
                </section>
            </div>
        </div>
    );
}
