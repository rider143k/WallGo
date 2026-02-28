import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Download, ArrowLeft } from 'lucide-react';
import DownloadButton from '@/components/DownloadButton';

async function getWallpaper(slug: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        console.log(`Fetching wallpaper: ${apiUrl}/api/wallpapers/slug/${slug}`);
        const res = await fetch(`${apiUrl}/api/wallpapers/slug/${slug}`, { next: { revalidate: 3600 } });
        if (!res.ok) {
            console.error(`Fetch failed with status: ${res.status}`);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error('getWallpaper Error:', error);
        return null;
    }
}

async function getRelatedWallpapers(id: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/wallpapers/related/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const wallpaper = await getWallpaper(slug);
    if (!wallpaper) return { title: 'Artifact Not Found - WallGo' };

    const title = `${wallpaper.title} 4K ${wallpaper.type} Artifact – Free Download | WallGo`;
    const description = wallpaper.description || `Download ${wallpaper.title} in Ultra HD. Premium ${wallpaper.category} artifact optimized for ${wallpaper.type}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [wallpaper.imageUrl],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [wallpaper.imageUrl],
        },
        alternates: {
            canonical: `https://www.wallgo.in/wallpaper/${slug}`,
        }
    };
}

export default async function WallpaperPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const wallpaper = await getWallpaper(slug);

    if (!wallpaper) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-black">
                <h1 className="text-4xl font-black mb-6 tracking-tighter uppercase italic opacity-20 text-white">Artifact Not Found</h1>
                <Link href="/" className="bw-button bw-button-primary px-10 py-4 rounded-full text-xs tracking-widest uppercase font-black">
                    Back to Discovery
                </Link>
            </div>
        );
    }

    const related = await getRelatedWallpapers(wallpaper._id);

    // JSON-LD Structured Data
    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "ImageObject",
        "name": wallpaper.title,
        "description": wallpaper.description,
        "contentUrl": wallpaper.imageUrl,
        "author": {
            "@type": "Organization",
            "name": "WallGo"
        },
        "license": "https://www.wallgo.in/terms",
        "thumbnail": wallpaper.imageUrl
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Cinematic Background Layer */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full opacity-10 blur-[120px] bg-gradient-to-b from-red-600 via-white/5 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-[1800px] mx-auto px-4 md:px-12 pt-28 md:pt-32 pb-32">
                {/* Navigation Header */}
                <div className="flex justify-between items-center mb-10 md:mb-16">
                    <Link href="/" className="group flex items-center gap-3 py-2.5 px-5 rounded-full bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all backdrop-blur-xl relative z-[70]">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Discovery</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-3 opacity-20">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em]">Ident:</span>
                        <span className="text-[9px] font-mono">{wallpaper._id.substring(0, 8)}</span>
                    </div>
                </div>

                {/* THEATER STAGE - Focus on the Image */}
                <section className="mb-16 md:mb-24">
                    <div className="relative group perspective-1000">
                        <div className={`relative mx-auto rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(255,10,10,0.1)] border border-white/5 bg-white/5 transition-all duration-1000 group-hover:shadow-[0_0_150px_rgba(255,255,255,0.08)]
                            ${wallpaper.type === 'Mobile' ? 'max-w-md aspect-[9/16]' : (wallpaper.type === 'DP' ? 'max-w-xl aspect-square rounded-full' : 'max-w-6xl aspect-video')}`}>
                            <Image
                                src={wallpaper.imageUrl}
                                alt={wallpaper.title}
                                fill
                                className="object-cover transition-all duration-[2s] ease-out group-hover:scale-[1.03]"
                                priority
                            />
                            {/* Visual Grade Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                        </div>

                        {/* Floating Interaction (Desktop Only) */}
                        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-100 pointer-events-none md:pointer-events-auto">
                            <div className="flex items-center gap-4 bg-black/60 backdrop-blur-3xl border border-white/10 p-1.5 md:p-2 rounded-full shadow-2xl">
                                <span className="px-5 md:px-6 py-2 md:py-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/50">{wallpaper.type} ARCHIVE // 4K</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Primary Intel - 7 Columns */}
                    <div className="lg:col-span-7 space-y-8 md:space-y-12">
                        <section>
                            <div className="flex items-center gap-3 mb-6 md:mb-8">
                                <div className="h-0.5 w-8 md:w-12 bg-red-600 shadow-[0_0_10px_#ff0000]"></div>
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Core Blueprint</span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black tracking-tight uppercase leading-[1.1] italic mb-6 text-white drop-shadow-2xl">
                                {wallpaper.title}
                            </h1>
                            <div className="relative p-0.5 md:p-1 bg-gradient-to-r from-white/10 to-transparent rounded-xl md:rounded-2xl">
                                <div className="bg-[#080808] p-5 md:p-8 rounded-xl md:rounded-2xl border border-white/5">
                                    <p className="text-sm md:text-base text-white/50 leading-relaxed font-normal italic">
                                        "{wallpaper.description || `This unique ${wallpaper.category} artifact has been digitally synthesized for high-performance visual output.`}"
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {[
                                { label: 'Category', val: wallpaper.category },
                                { label: 'Architecture', val: wallpaper.type },
                                { label: 'Resolution', val: '4K Ultra HD' },
                                { label: 'License', val: 'Community' }
                            ].map((spec, i) => (
                                <div key={i} className="group p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1">
                                    <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-30 mb-1.5 md:mb-2">{spec.label}</p>
                                    <p className="text-[10px] md:text-xs font-black uppercase tracking-wider text-white/80">{spec.val}</p>
                                </div>
                            ))}
                        </section>
                    </div>

                    {/* Secondary Actions - 5 Columns */}
                    <div className="lg:col-span-5 space-y-6 md:space-y-8">
                        <DownloadButton
                            imageUrl={wallpaper.imageUrl}
                            slug={wallpaper.slug}
                            id={wallpaper._id}
                            title={wallpaper.title}
                        />

                        {/* Tag Cloud */}
                        <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-8">Metadata Keywords</h3>
                            <div className="flex flex-wrap gap-3">
                                {wallpaper.tags?.map((tag: string) => (
                                    <span key={tag} className="px-6 py-3 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/20 transition-all cursor-default">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Discover Loop */}
                <section className="mt-64">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-lg">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4 leading-none text-white/20">Related <span className="text-white">Discoveries</span></h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 leading-relaxed">System scan complete. Found matching visual patterns in the secure archive.</p>
                        </div>
                        <div className="h-px flex-1 bg-white/5 mx-12 hidden md:block"></div>
                    </div>

                    <div className={`grid gap-8 md:gap-12 ${wallpaper.type === 'Mobile'
                        ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                        {related.map((rel: any) => (
                            <Link key={rel._id} href={`/wallpaper/${rel.slug}`} className="group">
                                <div className={`relative rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/5 transition-all duration-700 group-hover:border-white/20 group-hover:-translate-y-4
                                    ${rel.type === 'DP' ? 'rounded-full aspect-square' : (rel.type === 'Mobile' ? 'aspect-[2/3]' : 'aspect-video')}`}>
                                    <Image
                                        src={rel.imageUrl}
                                        alt={rel.title}
                                        fill
                                        className="object-cover opacity-100 transition-all duration-1000 scale-100 group-hover:scale-110"
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-1 italic translate-y-4 group-hover:translate-y-0 transition-transform">{rel.title}</p>
                                        <div className="flex items-center gap-2 opacity-80">
                                            <div className="w-4 h-0.5 bg-red-600"></div>
                                            <p className="text-[8px] font-black uppercase tracking-widest">{rel.category}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
