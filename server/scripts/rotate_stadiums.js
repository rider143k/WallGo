const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BASE_DIR = 'e:/WallGo/Wallpapers/Stadium';
const SKIP_FILE = 'Lord Stadim Phone 4k Wallpaper.jpg';

async function rotateImages() {
    console.log('--- STARTING STADIUM ROTATION ---');
    try {
        const files = fs.readdirSync(BASE_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

        for (const file of files) {
            if (file === SKIP_FILE) {
                console.log(`Skipping: ${file} (Phone optimized)`);
                continue;
            }

            const filePath = path.join(BASE_DIR, file);
            const tempPath = path.join(BASE_DIR, `rotated_${file}`);

            console.log(`Processing: ${file}...`);

            // Rotate -90 degrees (CCW) to fix the sideways orientation
            await sharp(filePath)
                .rotate(-90)
                .toFile(tempPath);

            // Replace original with rotated version
            fs.unlinkSync(filePath);
            fs.renameSync(tempPath, filePath);

            console.log(`✅ Success: ${file} is now horizontal.`);
        }
    } catch (err) {
        console.error('❌ Rotation Error:', err);
    }
    console.log('--- ROTATION COMPLETE ---');
}

rotateImages();
