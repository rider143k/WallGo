"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Super simple professional guard
        if (password === 'WallGo2026') {
            localStorage.setItem('adminKey', 'authenticated_session_9921');
            router.push('/admin');
        } else {
            setError('ACCESS DENIED: INVALID KEY');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass-morphism p-12 rounded-[2.5rem] border border-white/5"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black tracking-tighter mb-2">RESTRICTED</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] opacity-30">Admin Authentication Required</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] opacity-40 mb-3 font-bold">Admin Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-white/20 transition-all outline-none text-center tracking-widest"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-[10px] uppercase tracking-widest text-center font-bold">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="bw-button bw-button-primary w-full py-5 text-sm tracking-[0.2em] uppercase"
                    >
                        Authorize Access
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
