const mongoose = require('mongoose');
require('dotenv').config();
const axios = require('axios');

const Wallpaper = require('../models/Wallpaper');

async function checkLinks() {
    await mongoose.connect(process.env.MONGODB_URI);
    const wps = await Wallpaper.find();
    console.log(`Checking ${wps.length} wallpapers...`);
    
    let broken = 0;
    for (const wp of wps) {
        try {
            await axios.head(wp.imageUrl, { 
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 5000 
            });
        } catch (err) {
            console.log(`❌ BROKEN: ${wp.title} (${wp._id}) - URL: ${wp.imageUrl}`);
            broken++;
            // Optionally delete broken ones:
            // await Wallpaper.findByIdAndDelete(wp._id);
        }
    }
    
    console.log(`Finished. Total: ${wps.length}, Broken: ${broken}`);
    process.exit(0);
}

checkLinks();
