"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/5 pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="md:col-span-2">
                        <Link href="/" className="text-3xl font-black tracking-tighter mb-6 block">
                            WALL<span className="text-white/20">GO</span>
                        </Link>
                        <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-8">
                            Premium monochromatic wallpaper destination for minimalist enthusiasts.
                            Curated assets for both PC and Phone Fans.
                        </p>
                        <div className="flex gap-4">
                            {['INSTAGRAM', 'TWITTER', 'DRIBBBLE'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="text-[10px] font-bold tracking-[0.2em] opacity-40 hover:opacity-100 transition-all border border-white/10 px-4 py-2 rounded-full"
                                >
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 opacity-20">Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'PC Wallpapers', 'Phone Wallpapers'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href="/"
                                        className="text-sm font-bold opacity-60 hover:opacity-100 transition-all"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 opacity-20">Legal</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'About WallGo', href: '/about' },
                                { name: 'Privacy Policy', href: '/privacy' },
                                { name: 'Terms of Service', href: '/terms' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm font-bold opacity-60 hover:opacity-100 transition-all"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold opacity-20 tracking-widest uppercase">
                        © 2026 WALLGO PREMIUM INTERFACES. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Global Server Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
