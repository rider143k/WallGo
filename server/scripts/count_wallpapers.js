const mongoose = require('mongoose');
const Wallpaper = require('../models/Wallpaper');
require('dotenv').config();

async function countWallpapers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Wallpaper.countDocuments();
        console.log(`TOTAL_WALLPAPER_COUNT: ${count}`);
        process.exit(0);
    } catch (err) {
        console.error('Failed to count:', err);
        process.exit(1);
    }
}

countWallpapers();
