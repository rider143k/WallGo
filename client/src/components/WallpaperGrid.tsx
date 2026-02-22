"use client";
import { useEffect, useState } from 'react';
import WallpaperCard from './WallpaperCard';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Download } from 'lucide-react';

interface Wallpaper {
    _id: string;
    title: string;
    imageUrl: string;
    category: string;
    type: 'Desktop' | 'Mobile';
}

export default function WallpaperGrid() {
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeType, setActiveType] = useState('Desktop');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

    const categories = ['All', 'Nature', 'Abstract', 'Architecture', 'Technology', 'Animals', 'Minimal'];

    const fetchWallpapers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/wallpapers`);
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
    }, []);

    const filteredWallpapers = wallpapers.filter(wp => {
        const categoryMatch = activeCategory === 'All' ? true : wp.category === activeCategory;
        const typeMatch = wp.type === activeType;
        const searchMatch = wp.title.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && typeMatch && searchMatch;
    });

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
        <section className="py-20 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                    {/* Device Selector */}
                    <div className="flex bg-white/5 p-1 rounded-full border border-white/10 w-full sm:w-auto overflow-hidden">
                        <button
                            onClick={() => setActiveType('Desktop')}
                            className={`flex-1 sm:flex-none px-6 md:px-8 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${activeType === 'Desktop' ? 'bg-white text-black' : 'hover:text-white/60'}`}
                        >
                            PC
                        </button>
                        <button
                            onClick={() => setActiveType('Mobile')}
                            className={`flex-1 sm:flex-none px-6 md:px-8 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${activeType === 'Mobile' ? 'bg-white text-black' : 'hover:text-white/60'}`}
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
                            className={`px-5 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white text-black' : 'glass-morphism hover:bg-white/10'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="aspect-[3/4] rounded-[1.5rem] md:rounded-[2.5rem] animate-pulse glass-morphism" />
                        ))}
                    </div>
                ) : filteredWallpapers.length > 0 ? (
                    <motion.div
                        layout
                        className={`grid gap-4 md:gap-8 ${activeType === 'Mobile'
                            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}
                    >
                        {filteredWallpapers.map((wp) => (
                            <div key={wp._id} onClick={() => setSelectedWallpaper(wp)} className="cursor-zoom-in">
                                <WallpaperCard wallpaper={wp} />
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-40 opacity-20">
                        <p className="text-xl md:text-2xl font-black uppercase tracking-[0.4em]">No artifacts found</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedWallpaper && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                    >
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            onClick={() => setSelectedWallpaper(null)}
                            className="absolute top-6 right-6 z-[110] p-4 bg-white/10 rounded-full hover:bg-white hover:text-black transition-all"
                        >
                            <X size={24} />
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative max-w-full max-h-full flex flex-col items-center"
                        >
                            <div className={`relative overflow-hidden rounded-[2rem] shadow-2xl ${selectedWallpaper.type === 'Mobile' ? 'aspect-[9/16] w-[min(90vw,450px)]' : 'aspect-video w-[min(95vw,1100px)]'}`}>
                                <Image
                                    src={selectedWallpaper.imageUrl}
                                    alt={selectedWallpaper.title}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                    priority
                                />
                            </div>

                            <div className="mt-8 flex flex-col items-center text-center">
                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-2">{selectedWallpaper.title.toUpperCase()}</h2>
                                <p className="text-xs uppercase tracking-[0.3em] opacity-40 mb-10">{selectedWallpaper.category}</p>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(selectedWallpaper);
                                    }}
                                    className="bw-button bw-button-primary px-12 py-5 flex items-center gap-4 group"
                                >
                                    <Download className="group-hover:translate-y-1 transition-transform" size={20} />
                                    <span>DOWNLOAD FULL HD</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
