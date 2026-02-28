const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const filePath = 'e:/WallGo/Wallpapers/Stadium/Lord stadim phone 4k wallpaper.jpg';
const tempPath = filePath + '_temp.jpg';

async function fixPhone() {
    console.log('--- RESTORING PHONE ORIENTATION ---');
    try {
        if (fs.existsSync(filePath)) {
            // Rotate back +90 degrees to make it portrait again
            await sharp(filePath).rotate(90).toFile(tempPath);
            fs.unlinkSync(filePath);
            fs.renameSync(tempPath, filePath);
            console.log('✅ Success: Lord Phone wallpaper restored to portrait.');
        } else {
            console.log('❌ File not found:', filePath);
        }
    } catch (err) {
        console.error('❌ Restore Error:', err);
    }
}

fixPhone();
