"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Nature');
    const [tags, setTags] = useState('');
    const [uploading, setUploading] = useState(false);
    const [wallpapers, setWallpapers] = useState([]);
    const [adminFilter, setAdminFilter] = useState('All');
    const [adminSearch, setAdminSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedInspectorWp, setSelectedInspectorWp] = useState<any>(null);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passphraseInput, setPassphraseInput] = useState('');
    const [authError, setAuthError] = useState(false);

    useEffect(() => {
        const isAuth = localStorage.getItem('adminKey') === 'authenticated_session_aniket';
        if (isAuth) {
            setIsAuthenticated(true);
        }

        // Session Termination on Page Exit (Unmount)
        return () => {
            localStorage.removeItem('adminKey');
        };
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passphraseInput === 'aniket') {
            localStorage.setItem('adminKey', 'authenticated_session_aniket');
            setIsAuthenticated(true);
            setAuthError(false);
        } else {
            setAuthError(true);
            setTimeout(() => setAuthError(false), 2000);
        }
    };

    const categories = ['DP', 'Nature', 'Abstract', 'Architecture', 'Technology', 'Animals', 'Minimal', 'Cricket'];

    const fetchWallpapers = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/wallpapers`);
        const data = await res.json();
        setWallpapers(data);
    };

    useEffect(() => {
        fetchWallpapers();
    }, []);

    const [type, setType] = useState('Desktop');

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        setUploading(true);

        try {
            if (editingId) {
                // Update Logic
                const res = await fetch(`${apiUrl}/api/wallpapers/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-admin-secret': 'wallgo_secure_2026_xyz'
                    },
                    body: JSON.stringify({ title, category, type, tags, description }),
                });
                if (res.ok) {
                    alert('Artifact updated successfully!');
                    resetForm();
                }
            } else {
                // Upload Logic
                if (!file) return;
                const formData = new FormData();
                formData.append('image', file);
                formData.append('title', title);
                formData.append('category', category);
                formData.append('type', type);
                formData.append('tags', tags);
                formData.append('description', description);

                const res = await fetch(`${apiUrl}/api/wallpapers/upload`, {
                    method: 'POST',
                    headers: {
                        'x-admin-secret': 'wallgo_secure_2026_xyz'
                    },
                    body: formData,
                });
                if (res.ok) {
                    alert('Wallpaper deployed successfully!');
                    resetForm();
                }
            }
            fetchWallpapers();
        } catch (err) {
            console.error(err);
            alert('Operation failed');
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setTags('');
        setFile(null);
        setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this wallpaper?')) return;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/wallpapers/${id}`, {
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

    const startEdit = (wp: any) => {
        setEditingId(wp._id);
        setTitle(wp.title);
        setCategory(wp.category);
        setType(wp.type);
        setTags(wp.tags.join(', '));
        setDescription(wp.description || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [adminTypeFilter, setAdminTypeFilter] = useState('All');

    const filteredWallpapers = wallpapers.filter((wp: any) => {
        const categoryMatch = adminFilter === 'All' ? true : wp.category === adminFilter;
        const typeMatch = adminTypeFilter === 'All' ? true : wp.type === adminTypeFilter;
        const searchMatch = wp.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
            wp.tags.some((t: string) => t.toLowerCase().includes(adminSearch.toLowerCase()));
        return categoryMatch && typeMatch && searchMatch;
    });

    if (!isAuthenticated) {
        return (
            <main className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center p-6">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 glass-morphism p-12 rounded-[3.5rem] w-full max-w-md border border-white/5 shadow-2xl"
                >
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-white rounded-3xl mx-auto mb-8 flex items-center justify-center rotate-12">
                            <div className="w-8 h-8 bg-black rounded-lg"></div>
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">AESTHETIC <span className="text-white/20">OS</span></h1>
                        <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">Secure Administrative Gateway</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <input
                                type="password"
                                placeholder="Enter Passkey"
                                value={passphraseInput}
                                onChange={(e) => setPassphraseInput(e.target.value)}
                                className={`w-full px-8 py-5 rounded-2xl bg-white/5 border ${authError ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'} focus:bg-white/10 transition-all outline-none text-center font-mono tracking-widest`}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bw-button bw-button-primary w-full py-5 text-xs tracking-[0.4em] uppercase font-black"
                        >
                            Initiate Session
                        </button>
                    </form>

                    <p className="mt-12 text-center text-[9px] uppercase tracking-widest opacity-20 font-bold">
                        Protocol WallGo // v2.6.02
                    </p>
                </motion.div>

                {/* Ambient Background Elements */}
                <div className="absolute top-0 right-0 w-[50vh] h-[50vh] bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[50vh] h-[50vh] bg-purple-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </main>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 pt-32 md:pt-48 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 md:mb-16">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-1"
                >
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
                        CONTROL <span className="text-white/20">CENTER</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Total Artifacts: {wallpapers.length}</span>
                        </div>
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Total Downloads: {wallpapers.reduce((acc: any, curr: any) => acc + (curr.downloads || 0), 0)}</span>
                        </div>
                    </div>
                </motion.div>
                <button
                    onClick={() => {
                        localStorage.removeItem('adminKey');
                        setIsAuthenticated(false);
                    }}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-red-500 transition-all border border-white/10 px-6 py-3 rounded-full"
                >
                    Terminate Session
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-1"
                >
                    <form onSubmit={handleUpload} className="glass-morphism p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] lg:sticky lg:top-32">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold uppercase tracking-widest">{editingId ? 'Edit Artifact' : 'New Upload'}</h2>
                            {editingId && (
                                <button onClick={resetForm} className="text-[10px] uppercase tracking-widest text-red-500 font-bold">Cancel</button>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs uppercase tracking-widest opacity-40 mb-3 font-bold">Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 transition-all outline-none"
                            />
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-4">
                            <div>
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
                            <div>
                                <label className="block text-xs uppercase tracking-widest opacity-40 mb-3 font-bold">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 transition-all outline-none appearance-none"
                                >
                                    <option value="Desktop" className="bg-black">PC (16:9)</option>
                                    <option value="Mobile" className="bg-black">Phone (9:16)</option>
                                    <option value="DP" className="bg-black">DP (1:1)</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs uppercase tracking-widest opacity-40 mb-3 font-bold">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 transition-all outline-none h-24 resize-none"
                                placeholder="Describe the artifact aesthetic..."
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs uppercase tracking-widest opacity-40 mb-3 font-bold">Tags</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 transition-all outline-none"
                                placeholder="NATURE, DARK, MINIMAL"
                            />
                        </div>

                        {!editingId && (
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
                        )}

                        <button
                            type="submit"
                            disabled={uploading}
                            className="bw-button bw-button-primary w-full py-5 text-sm tracking-[0.2em] uppercase font-black"
                        >
                            {uploading ? 'Processing...' : (editingId ? 'Update Artifact' : 'Deploy Artifact')}
                        </button>
                    </form>
                </motion.div>

                <div className="lg:col-span-2">
                    <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center mb-12">
                        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-widest whitespace-nowrap">Active Database</h2>
                            <div className="px-3 sm:px-4 py-1.5 bg-white/10 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest border border-white/5 whitespace-nowrap">
                                {filteredWallpapers.length} / {wallpapers.length} <span className="opacity-40">UNITS</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full xl:w-auto">
                            <div className="relative flex-1 sm:flex-none sm:w-48">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={adminSearch}
                                    onChange={(e) => setAdminSearch(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-[10px] px-4 py-2 rounded-full outline-none uppercase tracking-widest focus:bg-white/10 transition-all font-bold placeholder:opacity-30"
                                />
                            </div>
                            <select
                                value={adminTypeFilter}
                                onChange={(e) => setAdminTypeFilter(e.target.value)}
                                className="bg-white/5 border border-white/10 text-[9px] sm:text-[10px] px-3 py-2 rounded-full outline-none uppercase tracking-widest font-bold min-w-[90px]"
                            >
                                <option value="All" className="bg-[#111] text-white">All Types</option>
                                <option value="Desktop" className="bg-[#111] text-white">Desktop</option>
                                <option value="Mobile" className="bg-[#111] text-white">Mobile</option>
                                <option value="DP" className="bg-[#111] text-white">DP</option>
                            </select>
                            <select
                                value={adminFilter}
                                onChange={(e) => setAdminFilter(e.target.value)}
                                className="bg-white/5 border border-white/10 text-[9px] sm:text-[10px] px-3 py-2 rounded-full outline-none uppercase tracking-widest font-bold min-w-[110px]"
                            >
                                <option value="All" className="bg-[#111] text-white">Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-[#111] text-white">{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {filteredWallpapers.map((wp: any) => (
                            <motion.div
                                key={wp._id}
                                layout
                                onClick={() => setSelectedInspectorWp(wp)}
                                className={`relative group cursor-pointer overflow-hidden glass-morphism border border-white/5 hover:border-white/20 transition-all duration-500 ${wp.type === 'DP' ? 'aspect-square rounded-full' : (wp.type === 'Mobile' ? 'aspect-[2/3] rounded-xl md:rounded-[1.5rem]' : 'aspect-video rounded-xl md:rounded-[1.5rem]')}`}
                            >
                                <Image
                                    src={wp.imageUrl}
                                    alt={wp.title}
                                    fill
                                    className={`object-cover transition-all duration-700 opacity-100 ${wp.type === 'DP' ? 'scale-110' : 'group-hover:scale-110'}`}
                                />

                                <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-100 p-5 flex flex-col justify-end ${wp.type === 'DP' ? 'items-center text-center' : ''}`}>
                                    <div className={`flex justify-between items-end w-full ${wp.type === 'DP' || wp.type === 'Mobile' ? 'flex-col items-center text-center gap-3' : ''}`}>
                                        <div className={`flex-1 min-w-0 ${wp.type === 'DP' ? 'order-1 w-full' : ''}`}>
                                            <h3 className={`font-black tracking-[0.2em] mb-0.5 truncate uppercase text-white/90 ${wp.type === 'DP' ? 'text-[8px] md:text-[10px]' : 'text-[9px] md:text-[11px]'}`}>{wp.title}</h3>
                                            <div className={`flex items-center gap-2 ${wp.type === 'DP' ? 'justify-center' : ''}`}>
                                                <div className="w-4 h-0.5 bg-red-600"></div>
                                                <p className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] opacity-50 font-black">{wp.category}</p>
                                            </div>
                                            <div className={`flex items-center gap-1.5 mt-2 ${wp.type === 'DP' ? 'justify-center' : ''}`}>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/20 rounded-full border border-green-500/30 backdrop-blur-md">
                                                    <svg className="w-2.5 h-2.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    <span className="text-[9px] font-black text-green-400 tracking-tighter">{wp.downloads || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`flex gap-1.5 ${wp.type === 'DP' || wp.type === 'Mobile' ? 'mt-2' : ''}`}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startEdit(wp);
                                                }}
                                                className="p-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white hover:text-black transition-all border border-white/5"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(wp._id);
                                                }}
                                                className="p-2 bg-black/60 backdrop-blur-md rounded-xl hover:bg-red-500 transition-all border border-white/5"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Artifact Inspector Overlay */}
            {selectedInspectorWp && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80"
                    onClick={() => setSelectedInspectorWp(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="glass-morphism max-w-4xl w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto no-scrollbar">
                            <div className="relative aspect-square md:aspect-auto h-[300px] md:h-full">
                                <Image
                                    src={selectedInspectorWp.imageUrl}
                                    alt={selectedInspectorWp.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-white/10">
                                    {selectedInspectorWp.type} ARTIFACT
                                </div>
                            </div>
                            <div className="p-6 md:p-12 flex flex-col min-h-0">
                                <div className="flex justify-between items-start mb-6 md:mb-10">
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-1 sm:mb-2 leading-tight">
                                            {selectedInspectorWp.title}
                                        </h2>
                                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">
                                            {selectedInspectorWp.category} // INTEL REPORT
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedInspectorWp(null)}
                                        className="p-3 rounded-full hover:bg-white/10 transition-colors shrink-0"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-6 sm:space-y-8 flex-1">
                                    <section>
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-3 font-black">Intel Metadata</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <p className="text-[8px] opacity-40 uppercase mb-1 font-bold">Slug Path</p>
                                                <p className="text-[10px] font-mono truncate tracking-tight">{selectedInspectorWp.slug}</p>
                                            </div>
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <p className="text-[8px] opacity-40 uppercase mb-1 font-bold">Artifact ID</p>
                                                <p className="text-[10px] font-mono truncate tracking-tight">{selectedInspectorWp._id}</p>
                                            </div>
                                            <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20 col-span-2 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[8px] text-green-500/60 uppercase mb-1 font-extrabold tracking-widest">Total Acquisitions</p>
                                                    <p className="text-xl font-black italic tracking-tighter text-green-400">{selectedInspectorWp.downloads || 0} <span className="text-[10px] not-italic opacity-40 uppercase tracking-[0.2em] ml-2">Downloads</span></p>
                                                </div>
                                                <div className="p-2 bg-green-500/20 rounded-full">
                                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-3 font-black">Description</h4>
                                        <p className="text-xs leading-relaxed opacity-60">
                                            {selectedInspectorWp.description || 'No detailed intel available for this artifact.'}
                                        </p>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-3 font-black">System Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedInspectorWp.tags.map((tag: string) => (
                                                <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black tracking-widest text-white/40 border border-white/5">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                <div className="mt-auto pt-8 border-t border-white/5 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => {
                                            startEdit(selectedInspectorWp);
                                            setSelectedInspectorWp(null);
                                        }}
                                        className="flex-1 min-w-[120px] py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/80 transition-all"
                                    >
                                        Edit Intel
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDelete(selectedInspectorWp._id);
                                            setSelectedInspectorWp(null);
                                        }}
                                        className="px-6 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        Remove
                                    </button>
                                    <Link
                                        href={`/wallpaper/${selectedInspectorWp.slug}`}
                                        target="_blank"
                                        className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
