"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Wallpaper {
    _id: string;
    title: string;
    imageUrl: string;
    category: string;
    slug: string;
    type: 'Desktop' | 'Mobile' | 'DP';
}

export default function WallpaperCard({ wallpaper }: { wallpaper: Wallpaper }) {
    const handleDownload = () => {
        // Track GA Event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'wallpaper_download', {
                'title': wallpaper.title,
                'slug': wallpaper.slug,
                'id': wallpaper._id
            });
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        try {
            fetch(`${apiUrl}/api/wallpapers/download/${wallpaper._id}`, { method: 'PATCH' }).catch(() => { });
        } catch (e) { }

        const downloadUrl = wallpaper.imageUrl.replace('/upload/', '/upload/fl_attachment/');
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `${wallpaper.title.replace(/\s+/g, '_')}.jpg`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative group overflow-hidden border border-white/5 bg-white/10 transition-all duration-500 hover:border-white/20 shadow-2xl ${wallpaper.type === 'DP' ? 'rounded-full aspect-square' : 'rounded-xl md:rounded-3xl ' + (wallpaper.type === 'Mobile' ? 'aspect-[2/3]' : 'aspect-video')}`}
        >
            <Image
                src={wallpaper.imageUrl}
                alt={`${wallpaper.title} 4K ${wallpaper.type} Wallpaper`}
                fill
                className="object-cover transition-all duration-1000 ease-in-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Premium Overlay - Restored visibility while keeping photo bright */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex flex-col p-4 md:p-6 ${wallpaper.type === 'DP' ? 'justify-center items-center text-center' : 'justify-end'}`}>
                <div className={`flex items-center gap-4 w-full ${wallpaper.type === 'DP' ? 'flex-col' : 'justify-between'}`}>
                    <div className={`flex-1 min-w-0 ${wallpaper.type === 'DP' ? 'order-1 w-full' : ''}`}>
                        <h3 className={`font-black tracking-[0.2em] mb-0.5 truncate uppercase text-white/90 ${wallpaper.type === 'DP' ? 'text-[8px] md:text-[10px]' : 'text-[9px] md:text-[11px]'}`}>{wallpaper.title}</h3>
                        <div className={`flex items-center gap-2 ${wallpaper.type === 'DP' ? 'justify-center' : ''}`}>
                            <div className="w-4 h-0.5 bg-red-600"></div>
                            <p className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] opacity-80 font-black">{wallpaper.category}</p>
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDownload();
                        }}
                        className={`rounded-full bg-white text-black hover:bg-red-600 hover:text-white backdrop-blur-md flex items-center justify-center border border-white/10 transition-all active:scale-90 shadow-xl ${wallpaper.type === 'DP' ? 'w-10 h-10 md:w-12 md:h-12 order-2' : 'w-8 h-8 md:w-10 md:h-10'}`}
                    >
                        <svg className={wallpaper.type === 'DP' ? "w-5 h-5" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
