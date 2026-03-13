const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();
const Wallpaper = require('../models/Wallpaper');

async function fixTitles() {
    await mongoose.connect(process.env.MONGODB_URI);
    const wps = await Wallpaper.find({ title: { $regex: /Scenic 4K|Space 4K|Architecture City 4K|Animal Beauty 4K|Luxury Scenic 4K/ } });
    
    console.log(`Found ${wps.length} wallpapers to rename.`);
    
    for (const wp of wps) {
        // Extract ID from title or tags if possible
        // The tags contain the ID: tags: "Nature, 4K, ..., [ID]"
        const tags = wp.tags || [];
        const unsplashId = tags[tags.length - 1]; // We stored ID as last tag
        
        if (!unsplashId || unsplashId.length > 20) {
            console.log(`Skipping ${wp.title} - No clear ID found in tags.`);
            continue;
        }

        try {
            console.log(`Fetching info for ID: ${unsplashId}...`);
            // Scrape Unsplash page for the description
            const url = `https://unsplash.com/photos/${unsplashId}`;
            const response = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const html = response.data;
            
            // Try to find the title/description in the HTML
            // Usually in <title> or meta tags
            const titleMatch = html.match(/<title>(.*?)<\/title>/);
            let newTitle = "";
            if (titleMatch) {
                // "Photo by Author on Unsplash" -> we want the description if any
                // Unsplash usually has "Description | Photo by..."
                newTitle = titleMatch[1].split(' | ')[0];
                if (newTitle.includes("Photo by")) {
                   // If no clear description in title, try meta description
                   const metaMatch = html.match(/<meta name="description" content="(.*?)"/);
                   if (metaMatch) {
                       newTitle = metaMatch[1].split(' - ')[0];
                   }
                }
            }
            
            if (newTitle && newTitle.length > 5 && !newTitle.includes("Download this free")) {
                // Formatting: Capitalize
                newTitle = newTitle.charAt(0).toUpperCase() + newTitle.slice(1);
                // Limit length
                if (newTitle.length > 60) newTitle = newTitle.substring(0, 57) + "...";
                
                console.log(`Old: ${wp.title} -> New: ${newTitle}`);
                
                // Update slug too
                const newSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + unsplashId.toLowerCase();
                
                wp.title = newTitle;
                wp.slug = newSlug;
                await wp.save();
                console.log(`✅ Updated: ${newSlug}`);
            } else {
                console.log(`⚠️ Could not find a good title for ${unsplashId}`);
            }
            
            // Sleep to avoid rate limiting
            await new Promise(r => setTimeout(r, 1000));
            
        } catch (err) {
            console.error(`❌ Error fetching ${unsplashId}: ${err.message}`);
        }
    }
    
    console.log('Finished renaming.');
    process.exit(0);
}

fixTitles();
