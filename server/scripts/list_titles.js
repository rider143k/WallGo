const mongoose = require('mongoose');
require('dotenv').config();
const Wallpaper = require('../models/Wallpaper');
const fs = require('fs');

async function listTitles() {
  await mongoose.connect(process.env.MONGODB_URI);
  const wps = await Wallpaper.find();
  const titles = wps.map(w => w.title);
  fs.writeFileSync('titles_dump.json', JSON.stringify(titles, null, 2));
  process.exit(0);
}

listTitles();
