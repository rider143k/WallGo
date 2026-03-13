const mongoose = require('mongoose');
const Wallpaper = require('../models/Wallpaper');
const { cloudinary } = require('../config/cloudinary');
require('dotenv').config();

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Pattern to match the AI generated titles
        const aiWallpapers = await Wallpaper.find({
            $or: [
                { title: /2026/i },
                { description: /2026/i }
            ]
        });

        console.log(`Found ${aiWallpapers.length} wallpapers to remove.`);

        for (const wp of aiWallpapers) {
            console.log(`Deleting: ${wp.title}`);
            try {
                // Delete from Cloudinary
                if (wp.publicId) {
                    await cloudinary.uploader.destroy(wp.publicId);
                }
                // Delete from DB
                await wp.deleteOne();
                console.log(`✅ Deleted ${wp.title}`);
            } catch (err) {
                console.error(`❌ Error deleting ${wp.title}:`, err.message);
            }
        }

        console.log('Cleanup complete.');
        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
}

cleanup();
