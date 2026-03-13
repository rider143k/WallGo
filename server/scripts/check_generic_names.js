const mongoose = require('mongoose');
require('dotenv').config();
const Wallpaper = require('../models/Wallpaper');

async function checkNames() {
  await mongoose.connect(process.env.MONGODB_URI);
  const wps = await Wallpaper.find();
  console.log(`Total wallpapers: ${wps.length}`);
  
  let genericCount = 0;
  for (const wp of wps) {
    if (wp.title.includes('4K - ')) {
      genericCount++;
      console.log(`Generic: ${wp.title}`);
    }
  }
  console.log(`Total generic found: ${genericCount}`);
  process.exit(0);
}

checkNames();
