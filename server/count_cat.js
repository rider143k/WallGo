const mongoose = require('mongoose');
require('dotenv').config();
const Wallpaper = require('./models/Wallpaper');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const total = await Wallpaper.countDocuments();
    const categories = await Wallpaper.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    console.log(`Total Wallpapers: ${total}`);
    console.log(`Categories:`, categories);
    process.exit(0);
});
