const mongoose = require('mongoose');
const Wallpaper = require('../models/Wallpaper');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Wallpaper.countDocuments({ category: 'Cricket' });
        console.log(`--- DATABASE CHECK ---`);
        console.log(`Total Cricket Wallpapers: ${count}`);

        const details = await Wallpaper.find({ category: 'Cricket' }).sort({ createdAt: -1 }).limit(5);
        console.log(`Latest 5 Cricket Artifacts:`);
        details.forEach(d => console.log(`- ${d.title} [${d.type}] (Slug: ${d.slug})`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
