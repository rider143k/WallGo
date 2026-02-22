"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-[60] glass-morphism px-8 py-4 flex justify-between items-center mx-4 mt-4 rounded-3xl"
        >
            <Link href="/" className="flex items-center gap-3 group">
                <motion.div
                    whileHover={{ rotate: 12 }}
                    className="w-10 h-10 relative"
                >
                    <Image
                        src="/logo.svg"
                        alt="WallGo logo"
                        fill
                        className="object-contain"
                    />
                </motion.div>
                <span className="text-2xl font-black tracking-tighter">WALLGO</span>
            </Link>
            <div className="flex gap-8 items-center font-medium">
                <Link href="/" className="hover:opacity-100 opacity-60 transition-opacity">Discover</Link>
            </div>
        </motion.nav>
    );
}
