const mongoose = require('mongoose');
require('dotenv').config();
const Wallpaper = require('../models/Wallpaper');
const fs = require('fs');

async function checkTags() {
  await mongoose.connect(process.env.MONGODB_URI);
  const wps = await Wallpaper.find({ title: { $regex: / 4K$/ } });
  const results = wps.map(w => ({ title: w.title, tags: w.tags, id: w._id, imageUrl: w.imageUrl }));
  fs.writeFileSync('generic_tags.json', JSON.stringify(results, null, 2));
  process.exit(0);
}

checkTags();
