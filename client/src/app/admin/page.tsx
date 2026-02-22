"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Nature');
    const [tags, setTags] = useState('');
    const [uploading, setUploading] = useState(false);
    const [wallpapers, setWallpapers] = useState([]);
    const [adminFilter, setAdminFilter] = useState('All');

    useEffect(() => {
        const isAuth = localStorage.getItem('adminKey') === 'authenticated_session_9921';
        if (!isAuth) {
            router.push('/login');
        }
    }, [router]);

    const categories = ['Nature', 'Abstract', 'Architecture', 'Technology', 'Animals', 'Minimal'];

    const fetchWallpapers = async () => {
        const res = await fetch('http://localhost:5000/api/wallpapers');
        const data = await res.json();
        setWallpapers(data);
    };

    useEffect(() => {
        fetchWallpapers();
    }, []);

    const [type, setType] = useState('Desktop');

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('category', category);
        formData.append('type', type);
        formData.append('tags', tags);

        try {
            const res = await fetch('http://localhost:5000/api/wallpapers/upload', {
                method: 'POST',
                headers: {
                    'x-admin-secret': 'wallgo_secure_2026_xyz'
                },
                body: formData,
            });
            if (res.ok) {
                setTitle('');
                setTags('');
                setFile(null);
                fetchWallpapers();
                alert('Wallpaper uploaded successfully!');
            } else {
                const errorData = await res.json();
                alert(`Upload failed: ${errorData.message || res.statusText}`);
            }
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this wallpaper?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/wallpapers/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-admin-secret': 'wallgo_secure_2026_xyz'
                }
            });
            if (res.ok) {
                fetchWallpapers();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const [adminTypeFilter, setAdminTypeFilter] = useState('All');

    const filteredWallpapers = wallpapers.filter((wp: any) => {
        const categoryMatch = adminFilter === 'All' ? true : wp.category === adminFilter;
        const typeMatch = adminTypeFilter === 'All' ? true : wp.type === adminTypeFilter;
        return categoryMatch && typeMatch;
    });

    return (
        <div className="max-w-6xl mx-auto px-6 pt-48 pb-20">
            <div className="flex justify-between items-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-5xl font-black tracking-tighter"
                >
                    CONTROL <span className="text-white/20">CENTER</span>
                </motion.h1>
                <button
                    onClick={() => {
                        localStorage.removeItem('adminKey');
                        router.push('/login');
                    }}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-red-500 transition-all border border-white/10 px-6 py-3 rounded-full"
                >
                    Terminate Session
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-1"
                >
                    <form onSubmit={handleUpload} className="glass-morphism p-10 rounded-[2.5rem] sticky top-32">
                        <h2 className="text-xl font-bold mb-8 uppercase tracking-widest">New Upload</h2>

                        <div className="mb-8">
                            <label className="block text-xs uppercase tracking-widest opacity-40 mb-3 font-bold">Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 transition-all outline-none"
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs uppercase tracking-widest opacity-40 mb-3 font-bold">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 transition-all outline-none appearance-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-black">{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs uppercase tracking-widest opacity-40 mb-3 font-bold">Device Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 transition-all outline-none appearance-none"
                            >
                                <option value="Desktop" className="bg-black">Desktop (PC) - 16:9</option>
                                <option value="Mobile" className="bg-black">Mobile (Phone) - 9:16</option>
                            </select>
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs uppercase tracking-widest opacity-40 mb-3 font-bold">Tags</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 transition-all outline-none"
                                placeholder="NATURE, DARK, MINIMAL"
                            />
                        </div>

                        <div className="mb-10">
                            <label className="block text-xs uppercase tracking-widest opacity-40 mb-3 font-bold">Image Source</label>
                            <input
                                type="file"
                                required
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="w-full text-xs text-white/40 file:mr-6 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="bw-button bw-button-primary w-full py-5 text-sm tracking-[0.2em] uppercase"
                        >
                            {uploading ? 'Processing...' : 'Deploy Wallpaper'}
                        </button>
                    </form>
                </motion.div>

                <div className="lg:col-span-2">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
                        <h2 className="text-xl font-bold uppercase tracking-widest">Active Database</h2>
                        <div className="flex gap-2">
                            <select
                                value={adminTypeFilter}
                                onChange={(e) => setAdminTypeFilter(e.target.value)}
                                className="bg-white/5 border border-white/10 text-[10px] px-3 py-2 rounded-full outline-none uppercase tracking-widest"
                            >
                                <option value="All">All Types</option>
                                <option value="Desktop">Desktop</option>
                                <option value="Mobile">Mobile</option>
                            </select>
                            <select
                                value={adminFilter}
                                onChange={(e) => setAdminFilter(e.target.value)}
                                className="bg-white/5 border border-white/10 text-[10px] px-3 py-2 rounded-full outline-none uppercase tracking-widest"
                            >
                                <option value="All">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-black">{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {filteredWallpapers.map((wp: any) => (
                            <motion.div
                                layout
                                key={wp._id}
                                className={`relative group rounded-3xl overflow-hidden glass-morphism ${wp.type === 'Mobile' ? 'aspect-[2/3]' : 'aspect-video'}`}
                            >
                                <Image
                                    src={wp.imageUrl}
                                    alt={wp.title}
                                    fill
                                    className="object-cover transition-all duration-500"
                                />
                                <button
                                    onClick={() => handleDelete(wp._id)}
                                    className="absolute top-4 right-4 p-3 bg-black/60 rounded-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white hover:text-black backdrop-blur-md"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-[8px] uppercase tracking-widest">
                                    {wp.type}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
