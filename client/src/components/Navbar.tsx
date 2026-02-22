"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 glass-morphism px-8 py-4 flex justify-between items-center mx-4 mt-4 rounded-3xl"
        >
            <Link href="/" className="text-2xl font-black tracking-tighter">
                WALLGO
            </Link>
            <div className="flex gap-8 items-center font-medium">
                <Link href="/" className="hover:opacity-100 opacity-60 transition-opacity">Discover</Link>
            </div>
        </motion.nav>
    );
}
