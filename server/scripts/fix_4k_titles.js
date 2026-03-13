const mongoose = require('mongoose');
require('dotenv').config();
const Wallpaper = require('../models/Wallpaper');

async function fix4KTitles() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const wps = await Wallpaper.find({ title: { $regex: / 4[Kk]$/ } });
  console.log(`Found ${wps.length} wallpapers with ' 4K' in title.`);
  
  for (const wp of wps) {
    const oldTitle = wp.title;
    wp.title = oldTitle.replace(/ 4[Kk]$/, '');
    // Regenerate slug
    wp.slug = wp.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 8);
    await wp.save();
    console.log(`Fixed: ${oldTitle} -> ${wp.title}`);
  }
  
  process.exit(0);
}

fix4KTitles();
