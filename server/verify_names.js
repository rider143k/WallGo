const mongoose = require('mongoose');
require('dotenv').config();
const Wallpaper = require('./models/Wallpaper');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const wps = await Wallpaper.find().sort({createdAt: -1}).limit(20);
    console.log(wps.map(w => w.title + ' -> ' + w.category));
    process.exit(0);
});
