import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://www.wallgo.in/</loc>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>
        <url>
            <loc>https://www.wallgo.in/wallpapers/dp</loc>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
        </url>
        <url>
            <loc>https://www.wallgo.in/wallpapers/nature</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
        <url>
            <loc>https://www.wallgo.in/wallpapers/abstract</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
        <url>
            <loc>https://www.wallgo.in/wallpapers/minimal</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
        <url>
            <loc>https://www.wallgo.in/wallpapers/cricket</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
        <url>
            <loc>https://www.wallgo.in/wallpapers/architecture</loc>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
        </url>
        <url>
            <loc>https://www.wallgo.in/wallpapers/technology</loc>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
        </url>
        <url>
            <loc>https://www.wallgo.in/wallpapers/animals</loc>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
        </url>
    </urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
