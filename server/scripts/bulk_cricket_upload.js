const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { imageSize: sizeOf } = require('image-size');

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

const BASE_DIR = 'e:/WallGo/Wallpapers';
const CATEGORY = 'Cricket';

async function uploadFile(filePath, dirName) {
    const fileName = path.basename(filePath);
    const fileNameLower = fileName.toLowerCase();

    // Dimension Detection for Orientation Fix (Buffer based for stability)
    const buffer = fs.readFileSync(filePath);
    const dimensions = sizeOf(buffer);
    const isPortrait = dimensions.height > dimensions.width;

    // SEO Optimization: Cleaning Title
    let title = fileName.replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/[-_]/g, ' ') // Replace separators
        .replace(/\b[a-z]/g, l => l.toUpperCase()); // Capitalize

    // Precision Type Selection
    let type = isPortrait ? 'Mobile' : 'Desktop';

    // Manual overrides from file name
    if (fileNameLower.includes('dp')) {
        type = 'DP';
    } else if (fileNameLower.includes('desktop') || fileNameLower.includes('pc')) {
        type = 'Desktop';
    } else if (fileNameLower.includes('phone') || fileNameLower.includes('mobile')) {
        type = 'Mobile';
    }

    // SEO Optimization: Tags
    let tags = ['Cricket', '4K', 'Wallpaper'];
    if (dirName === 'Virat Kohli') {
        tags.push('Virat Kohli', 'King Kohli', 'GOAT', 'Indian Cricket Team', 'ICT', 'RCB', 'Celebration', 'Century');
    } else if (dirName === 'Stadium') {
        tags.push('Stadium', 'Ground', 'Pavilion', 'Match', 'Arena', 'Lights');
    }

    // Semantic Description
    let description = `Premium 4K ${type} Wallpaper of ${title}. `;
    if (dirName === 'Virat Kohli') {
        description += `Exclusive high-resolution artifact of the King of Cricket, Virat Kohli. Perfect for fans looking for his iconic celebrations, covers drives, and 2025 records.`;
    } else {
        description += `Stunning high-definition view of a world-class cricket stadium. Experience the aura of the ground with this 4K landscape background.`;
    }

    console.log(`🚀 Uploading: ${title} [${type}]...`);

    const form = new FormData();
    form.append('title', title);
    form.append('category', CATEGORY);
    form.append('type', type);
    form.append('tags', tags.join(', '));
    form.append('description', description);
    form.append('image', fs.createReadStream(filePath));

    try {
        const res = await axios.post(API_URL, form, {
            headers: {
                ...form.getHeaders(),
                'x-admin-secret': ADMIN_SECRET
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 300000 // 5 minutes per file
        });
        const msg = `✅ Success: ${title} -> ${res.data.slug} | Type: ${type} | Size: ${dimensions.width}x${dimensions.height}\n`;
        console.log(msg);
        fs.appendFileSync(path.join(__dirname, 'upload_status.txt'), msg);
    } catch (err) {
        const errMsg = `❌ Failed: ${title} - Status: ${err.response?.status} - ${err.response?.data?.message || err.message}\n`;
        console.error(errMsg);
        fs.appendFileSync(path.join(__dirname, 'upload_status.txt'), errMsg);
    }
}

async function start() {
    const subDirs = ['Stadium', 'Virat Kohli'];

    console.log('--- STARTING BULK CRICKET UPLOAD V1 ---');

    for (const subDir of subDirs) {
        const dirPath = path.join(BASE_DIR, subDir);
        if (!fs.existsSync(dirPath)) {
            console.warn(`⚠️ Directory not found: ${dirPath}`);
            continue;
        }

        const files = fs.readdirSync(dirPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
        console.log(`📂 Scanning ${subDir}: ${files.length} files found.`);

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            await uploadFile(filePath, subDir);
        }
    }

    console.log('--- BULK UPLOAD COMPLETE ---');
}

start();
