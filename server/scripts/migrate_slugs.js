const mongoose = require('mongoose');
const Wallpaper = require('../models/Wallpaper');
const slugify = require('slugify');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wallgo';

const migrate = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for migration...');

        const wallpapers = await Wallpaper.find({});
        console.log(`Found ${wallpapers.length} total wallpapers.`);

        for (const wp of wallpapers) {
            if (wp.slug) continue; // Skip if already has slug
            let baseSlug = slugify(wp.title, { lower: true, strict: true });
            let slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

            wp.slug = slug;
            if (!wp.description) {
                wp.description = `Download high quality ${wp.title} 4K wallpaper for your desktop or mobile. Beautiful ${wp.category} themed background available for free.`;
            }

            await wp.save();
            console.log(`Updated: ${wp.title} -> ${slug}`);
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
