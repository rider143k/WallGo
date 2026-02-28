'use client';

import { useEffect } from 'react';

export default function CategoryTracker({ category }: { category: string }) {
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'category_view', {
                'category_name': category,
                'timestamp': new Date().toISOString()
            });
        }
    }, [category]);

    return null;
}
