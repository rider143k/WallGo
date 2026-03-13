const mongoose = require('mongoose');
require('dotenv').config();
const Wallpaper = require('../models/Wallpaper');

async function deduplicate() {
    await mongoose.connect(process.env.MONGODB_URI);
    const wps = await Wallpaper.find();
    
    console.log(`Checking ${wps.length} wallpapers for duplicates...`);
    
    const seen = new Set();
    let deletedCount = 0;
    
    for (const wp of wps) {
        // Unsplash ID is the last tag
        const tags = wp.tags || [];
        const unsplashId = tags[tags.length - 1];
        
        // Skip if no Unsplash ID (it might be a non-unsplash photo)
        if (!unsplashId || unsplashId.length > 20 || unsplashId.includes(' ')) {
            continue;
        }
        
        if (seen.has(unsplashId)) {
            await Wallpaper.findByIdAndDelete(wp._id);
            deletedCount++;
            console.log(`🗑️ Deleted duplicate: ${unsplashId} (${wp.title})`);
        } else {
            seen.add(unsplashId);
        }
    }
    
    console.log(`Cleanup complete. Deleted ${deletedCount} duplicates.`);
    process.exit(0);
}

deduplicate();
