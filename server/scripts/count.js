const mongoose = require('mongoose');
require('dotenv').config();
const Wallpaper = require('../models/Wallpaper');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const total = await Wallpaper.countDocuments();
    console.log(`Total unique Wallpapers in DB: ${total}`);
    process.exit(0);
});
