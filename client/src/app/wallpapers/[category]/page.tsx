import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import WallpaperGrid from '@/components/WallpaperGrid';
import CategoryTracker from '../../../components/CategoryTracker';

async function getCategoryInfo(category: string) {
    // In a real app, this might come from a DB or CMS. 
    // For now, we'll generate rich SEO content based on the category name.
    const descriptions: Record<string, string> = {
        'nature': 'Discover the breathtaking beauty of nature with our curated collection of high-definition 4K wallpapers. From serene landscapes and majestic mountains to calming ocean views, find the perfect background for your desktop or mobile.',
        'abstract': 'Elevate your screens with vibrant colors and mesmerizing patterns. Our abstract wallpaper collection features artistic designs, geometric shapes, and unique digital art in stunning 4K resolution.',
        'minimal': 'Less is more. Browse our selection of clean, minimalist wallpapers that bring a sense of calm and focus to your digital workspace. Perfect for fans of simple aesthetics and clutter-free designs.',
        'architecture': 'Explore the wonders of human engineering and design. Our architecture collection showcases iconic cityscapes, modern skyscrapers, and historic landmarks from around the world in crisp detail.',
        'technology': 'Stay ahead of the curve with our tech-inspired wallpapers. Featuring futuristic concepts, circuit patterns, and sleek digital interfaces for your high-tech devices.',
        'animals': 'Bring the wild to your screen. From powerful predators to adorable pets, our animal wallpapers capture the beauty and spirit of the animal kingdom in vivid detail.',
        'cricket': 'Celebrate the spirit of the gentleman\'s game. Our cricket collection features legendary players, iconic stadiums, and high-energy action shots in stunning 4K resolution.',
        'dp': 'Premium Display Profiles for your social presence. Hand-curated 4K circular artifacts optimized for WhatsApp, Instagram, and other social platforms.'
    };

    return {
        title: category.charAt(0).toUpperCase() + category.slice(1),
        description: descriptions[category.toLowerCase()] || `Explore the best 4K ${category} wallpapers for desktop and mobile. Free download in high resolution on WallGo.`
    };
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category } = await params;
    const info = await getCategoryInfo(category);
    const title = `Best 4K ${info.title} Wallpapers for PC & Mobile – Free Download | WallGo`;

    return {
        title,
        description: info.description,
        openGraph: {
            title,
            description: info.description,
            type: 'website',
            url: `https://www.wallgo.in/wallpapers/${category}`,
        },
        alternates: {
            canonical: `https://www.wallgo.in/wallpapers/${category}`,
        }
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const info = await getCategoryInfo(category);

    return (
        <main className="min-h-screen pt-40 pb-20">
            <CategoryTracker category={category} />
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-20 text-center max-w-4xl mx-auto">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic">
                        {info.title} <span className="text-white/20">Artifacts</span>
                    </h1>
                    <div className="prose prose-invert prose-lg mx-auto opacity-60 leading-relaxed font-medium">
                        <p>{info.description}</p>
                    </div>
                </header>

                {/* We can reuse the WallpaperGrid but pass initial category */}
                <WallpaperGrid initialCategory={info.title} />

                {/* SEO Footnote */}
                <section className="mt-32 p-12 border border-white/5 rounded-[3rem] bg-white/[0.02] opacity-40 text-sm leading-relaxed max-w-5xl mx-auto">
                    <h2 className="text-lg font-black uppercase tracking-widest mb-4">Why Choose WallGo for {info.title} Wallpapers?</h2>
                    <p className="mb-4">WallGo provides a premium, curated experience for wallpaper enthusiasts. Our {info.title.toLowerCase()} collection is hand-selected to ensure the highest resolution and visual impact. Whether you are looking for a new background for your iMac, Windows PC, or the latest iPhone/Android smartphone, we have the perfect artifact waiting for you.</p>
                    <p>Every image on this page is free for personal use and optimized for fast loading without compromising on 4K quality. Join the WallGo discovery loop and find your next inspiration today.</p>
                </section>
            </div>
        </main>
    );
}
