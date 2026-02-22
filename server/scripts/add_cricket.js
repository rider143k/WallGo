const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

// Reliable Unsplash Cricket Artifacts (Requesting 2500px width for ~1.5MB-3MB)
const cricketArtifacts = [
    {
        title: 'International Stadium Panorama',
        url: 'https://images.unsplash.com/photo-1540747913346-19e3ad6466b9?q=80&w=2500',
        type: 'Desktop',
        tags: 'cricket, stadium, international, match, panorama'
    },
    {
        title: 'Classic Leather Match Ball',
        url: 'https://images.unsplash.com/photo-1531233075604-80cc7d42646c?q=80&w=2500',
        type: 'Desktop',
        tags: 'cricket, ball, leather, red, professional'
    },
    {
        title: 'Lords London Ground View',
        url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2500',
        type: 'Desktop',
        tags: 'cricket, londs, london, ground, grass'
    },
    {
        title: 'Evening Floodlights Stadium',
        url: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=2500',
        type: 'Desktop',
        tags: 'stadium, lights, cricket, night, 4k'
    },
    {
        title: 'Australian Ground Sunset',
        url: 'https://images.unsplash.com/photo-1512712338870-226e6d5e1684?q=80&w=2500',
        type: 'Desktop',
        tags: 'mcg, stadium, melbourne, cricket, sunset'
    },
    {
        title: 'Cricket Silhouette Mobile',
        url: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?q=80&w=1500',
        type: 'Mobile',
        tags: 'cricket, silhouette, sunset, phone, 4k'
    },
    {
        title: 'Cricket Bat Macro Texture',
        url: 'https://images.unsplash.com/photo-1599586120530-9b0d39e3b97b?q=80&w=1500',
        type: 'Mobile',
        tags: 'cricket, bat, wood, texture, mobile'
    },
    {
        title: 'Stadium Shadows Architecture',
        url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2500',
        type: 'Desktop',
        tags: 'stadium, shadows, boundary, grand'
    },
    {
        title: 'Professional Batsman Focus',
        url: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=1500',
        type: 'Mobile',
        tags: 'cricket, batsman, phone, focus, 4k'
    },
    {
        title: 'Morning Net Practice Glow',
        url: 'https://images.unsplash.com/photo-1536411396596-afbcda9f36f3?q=80&w=2500',
        type: 'Desktop',
        tags: 'cricket, training, morning, nets'
    }
];

async function downloadAndUpload() {
    console.log('--- CRICKET ARTIFACT INJECTION V3 STARTING ---');
    for (const item of cricketArtifacts) {
        try {
            console.log(`Processing: ${item.title}...`);

            const response = await axios({
                url: item.url,
                method: 'GET',
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout: 30000
            });

            const sizeInMB = response.data.length / (1024 * 1024);
            console.log(`Size: ${sizeInMB.toFixed(2)} MB`);

            const tempPath = path.join(__dirname, `temp_${Date.now()}.jpg`);
            fs.writeFileSync(tempPath, response.data);

            const form = new FormData();
            form.append('title', item.title);
            form.append('category', 'Cricket');
            form.append('type', item.type);
            form.append('tags', item.tags);
            form.append('description', `Premium 4K Cricket Artifact: ${item.title}. Verified high fidelity (>1MB) for WallGo fans.`);
            form.append('image', fs.createReadStream(tempPath));

            const uploadRes = await axios.post(API_URL, form, {
                headers: {
                    ...form.getHeaders(),
                    'x-admin-secret': ADMIN_SECRET
                },
                timeout: 120000 // 2 minutes for upload
            });

            console.log(`✅ Uploaded: ${uploadRes.data.slug}`);
            fs.unlinkSync(tempPath);
        } catch (error) {
            console.error(`❌ Failed: ${item.title}`);
            console.error(`   Error: ${error.message}`);
        }
    }
    console.log('--- INJECTION COMPLETE ---');
}

downloadAndUpload();
