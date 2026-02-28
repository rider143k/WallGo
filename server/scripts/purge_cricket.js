const mongoose = require('mongoose');
const Wallpaper = require('../models/Wallpaper');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function purgeCricket() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const result = await Wallpaper.deleteMany({ category: 'Cricket' });
        console.log(`--- CRICKET PURGE COMPLETE ---`);
        console.log(`Deleted ${result.deletedCount} artifacts.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

purgeCricket();
