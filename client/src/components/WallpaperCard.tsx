"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Wallpaper {
    _id: string;
    title: string;
    imageUrl: string;
    category: string;
    type: 'Desktop' | 'Mobile';
}

export default function WallpaperCard({ wallpaper }: { wallpaper: Wallpaper }) {
    const handleDownload = async () => {
        try {
            const response = await fetch(wallpaper.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${wallpaper.title.replace(/\s+/g, '_')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed', error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative group rounded-[2.5rem] overflow-hidden glass-morphism ${wallpaper.type === 'Mobile' ? 'aspect-[9/16]' : 'aspect-video'}`}
        >
            <Image
                src={wallpaper.imageUrl}
                alt={wallpaper.title}
                fill
                className="object-cover transition-all duration-700 ease-in-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Overlay: Always visible on mobile, hover on desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8 pointer-events-none">
                <div className="pointer-events-auto">
                    <h3 className="text-xl md:text-2xl font-black mb-1">{wallpaper.title.toUpperCase()}</h3>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-50 mb-4 md:mb-6">{wallpaper.category}</p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                        }}
                        className="bw-button bw-button-primary w-full py-3 md:py-4 text-xs md:text-sm"
                    >
                        DOWNLOAD
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
