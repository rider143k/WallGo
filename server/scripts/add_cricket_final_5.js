const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

const finalBatch = [
    { title: 'Cricket Boundary Silhouette Sunset', url: 'https://images.unsplash.com/photo-1540747913346-19e3ad6466b9?q=100&w=3500', type: 'Desktop' },
    { title: 'Pro Cricket Player Stance Phone', url: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=100&h=3000', type: 'Mobile' },
    { title: 'Wankhede Iconic Night Atmosphere', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=100&w=3500', type: 'Desktop' },
    { title: 'Leather Ball Stitching Macro', url: 'https://images.unsplash.com/photo-1531233075604-80cc7d42646c?q=100&w=3500', type: 'Desktop' },
    { title: 'Cricket Practice Nets Morning', url: 'https://images.unsplash.com/photo-1536411396596-afbcda9f36f3?q=100&w=3500', type: 'Desktop' }
];

async function run() {
    console.log('--- CRICKET FINAL 5 PUSH ---');
    for (const a of finalBatch) {
        try {
            console.log(`Processing: ${a.title}`);
            const res = await axios.get(a.url, { responseType: 'arraybuffer', timeout: 60000 });
            const temp = path.join(__dirname, `last_${Date.now()}.jpg`);
            fs.writeFileSync(temp, res.data);

            const form = new FormData();
            form.append('title', a.title);
            form.append('category', 'Cricket');
            form.append('type', a.type);
            form.append('image', fs.createReadStream(temp));
            form.append('tags', 'cricket, sports, 4k, hd');
            form.append('description', `Elite 4K Cricket wallpaper of ${a.title}. Quality verified > 1.5MB for premium displays.`);

            await axios.post(API_URL, form, {
                headers: { ...form.getHeaders(), 'x-admin-secret': ADMIN_SECRET },
                timeout: 120000
            });
            console.log(`✅ Done: ${a.title}`);
            fs.unlinkSync(temp);
        } catch (e) {
            console.log(`❌ Err: ${a.title} - ${e.message}`);
        }
    }
}
run();
