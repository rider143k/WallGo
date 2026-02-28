"use client";
import { useEffect, useState } from 'react';
import WallpaperCard from './WallpaperCard';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface Wallpaper {
    _id: string;
    title: string;
    imageUrl: string;
    category: string;
    slug: string;
    type: 'Desktop' | 'Mobile' | 'DP';
}

export default function WallpaperGrid({ initialCategory = 'All' }: { initialCategory?: string }) {
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [activeType, setActiveType] = useState('Desktop');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', 'DP', 'Nature', 'Abstract', 'Architecture', 'Technology', 'Animals', 'Minimal', 'Cricket'];

    const fetchWallpapers = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            // Use shuffle=true when in 'All' category for professional discovery
            const shuffleParams = activeCategory === 'All' ? '?shuffle=true' : '';
            const res = await fetch(`${apiUrl}/api/wallpapers${shuffleParams}`);
            const data = await res.json();
            setWallpapers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallpapers();
    }, [activeCategory]);

    const handleDownload = async (wp: Wallpaper) => {
        try {
            const response = await fetch(wp.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${wp.title.replace(/\s+/g, '_')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed', error);
        }
    };

    return (
        <section className="py-20 px-4 md:px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                    {/* Device Selector */}
                    <div className="flex bg-white/5 p-1 rounded-full border border-white/10 w-full sm:w-auto overflow-hidden">
                        <button
                            onClick={() => setActiveType('Desktop')}
                            className={`flex-1 sm:flex-none px-10 md:px-14 py-4 rounded-full text-[11px] md:text-xs font-black uppercase tracking-[0.2em] transition-all ${activeType === 'Desktop' ? 'bg-white text-black shadow-xl shadow-white/5' : 'hover:text-white/60'}`}
                        >
                            PC
                        </button>
                        <button
                            onClick={() => setActiveType('Mobile')}
                            className={`flex-1 sm:flex-none px-10 md:px-14 py-4 rounded-full text-[11px] md:text-xs font-black uppercase tracking-[0.2em] transition-all ${activeType === 'Mobile' ? 'bg-white text-black shadow-xl shadow-white/5' : 'hover:text-white/60'}`}
                        >
                            Phone
                        </button>
                    </div>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="SEARCH PREMIUM CONTENT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-4 text-[10px] md:text-xs tracking-widest outline-none focus:bg-white/10 transition-all font-bold"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-20">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="aspect-video bg-white/5 rounded-2xl md:rounded-[2rem] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10"
                        >
                            {wallpapers
                                .filter(wp => {
                                    const categoryMatch = activeCategory === 'All' ? true : wp.category === activeCategory;
                                    const typeMatch = activeCategory === 'DP' ? wp.type === 'DP' : wp.type === activeType;
                                    const searchMatch = wp.title.toLowerCase().includes(searchQuery.toLowerCase());
                                    return categoryMatch && typeMatch && searchMatch;
                                })
                                .map((wp) => (
                                    <Link
                                        key={wp._id}
                                        href={`/wallpaper/${wp.slug}`}
                                        className={`group ${wp.type === 'Desktop' ? 'col-span-2 md:col-span-1' : ''}`}
                                    >
                                        <WallpaperCard wallpaper={wp} />
                                    </Link>
                                ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
