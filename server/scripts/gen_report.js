const mongoose = require('mongoose');
const Wallpaper = require('../models/Wallpaper');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Wallpaper.countDocuments({ category: 'Cricket' });
        const latest = await Wallpaper.find({ category: 'Cricket' }).sort({ createdAt: -1 }).limit(10);

        const report = {
            totalCricket: count,
            latestArtifacts: latest.map(l => ({
                title: l.title,
                slug: l.slug,
                type: l.type,
                tags: l.tags
            }))
        };

        fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify(report, null, 2));
        console.log('Report generated at report.json');
        process.exit(0);
    } catch (err) {
        fs.writeFileSync(path.join(__dirname, 'report_error.txt'), err.stack);
        process.exit(1);
    }
}

check();
