"use client";

import { Download } from 'lucide-react';

interface DownloadButtonProps {
    imageUrl: string;
    slug: string;
    id: string;
    title: string;
}

export default function DownloadButton({ imageUrl, slug, id, title }: DownloadButtonProps) {
    const handleDownload = () => {
        // Track GA Event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'wallpaper_download', {
                'title': title,
                'slug': slug,
                'id': id
            });
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        try {
            fetch(`${apiUrl}/api/wallpapers/download/${id}`, { method: 'PATCH' }).catch(() => { });
        } catch (e) { }

        const downloadUrl = imageUrl.replace('/upload/', '/upload/fl_attachment/');
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `${slug}.jpg`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative group">
            <div className="absolute inset-0 bg-red-600 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <button
                onClick={handleDownload}
                className="relative w-full py-6 md:py-8 rounded-[1.5rem] md:rounded-[2rem] bg-white text-black flex items-center justify-center gap-4 md:gap-6 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] group shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
                <div className="p-2 md:p-3 bg-black/10 rounded-full group-hover:rotate-12 transition-transform">
                    <Download size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col text-left">
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">Initiate Hardware Link</span>
                    <span className="text-base md:text-lg font-black italic tracking-tighter uppercase leading-none">Download Artifact</span>
                </div>
            </button>
        </div>
    );
}
