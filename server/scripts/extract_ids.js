const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const Wallpaper = require('../models/Wallpaper');

async function extract() {
    await mongoose.connect(process.env.MONGODB_URI);
    const wps = await Wallpaper.find({ title: { $regex: /Scenic 4K|Space 4K|Architecture City 4K|Animal Beauty 4K|Luxury Scenic 4K/ } });
    
    const results = wps.map(w => ({ 
        id: w._id, 
        unsplashId: w.tags[w.tags.length - 1], 
        oldTitle: w.title,
        category: w.category
    }));
    
    fs.writeFileSync('generic_wallpapers.json', JSON.stringify(results, null, 2));
    console.log(`Extracted ${results.length} IDs to generic_wallpapers.json`);
    process.exit(0);
}

extract();
