const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

const artifacts = [
    { title: 'Cricket Boundary Silhouette', url: 'https://images.unsplash.com/photo-1540747913346-19e3ad6466b9?q=80&w=3000', type: 'Desktop' },
    { title: 'Red Cricket Ball Texture', url: 'https://images.unsplash.com/photo-1531233075604-80cc7d42646c?q=80&w=3000', type: 'Desktop' },
    { title: 'Morning Pitch Dew', url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=3000', type: 'Desktop' },
    { title: 'Stadium Night Floodlights', url: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=3000', type: 'Desktop' },
    { title: 'MCG Melbourne Grand Stand', url: 'https://images.unsplash.com/photo-1512712338870-226e6d5e1684?q=80&w=3000', type: 'Desktop' },
    { title: 'Batsman Professional Stance', url: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?q=80&w=2000', type: 'Mobile' },
    { title: 'Cricket Net Practice HD', url: 'https://images.unsplash.com/photo-1536411396596-afbcda9f36f3?q=80&w=2000', type: 'Mobile' },
    { title: 'Pro Cricket Bat Archive', url: 'https://images.unsplash.com/photo-1599586120530-9b0d39e3b97b?q=80&w=2000', type: 'Mobile' }
];

async function run() {
    console.log('--- CRICKET FINAL PUSH ---');
    for (const a of artifacts) {
        try {
            console.log(`Working on: ${a.title}`);
            const res = await axios.get(a.url, { responseType: 'arraybuffer', timeout: 60000 });
            const temp = path.join(__dirname, `f_${Date.now()}.jpg`);
            fs.writeFileSync(temp, res.data);

            const form = new FormData();
            form.append('title', a.title);
            form.append('category', 'Cricket');
            form.append('type', a.type);
            form.append('image', fs.createReadStream(temp));
            form.append('description', `Elite 4K Cricket wallpaper of ${a.title}. Optimized for ${a.type} display quality.`);

            const up = await axios.post(API_URL, form, {
                headers: { ...form.getHeaders(), 'x-admin-secret': ADMIN_SECRET },
                timeout: 120000
            });
            console.log(`✅ Success: ${up.data.slug}`);
            fs.unlinkSync(temp);
        } catch (e) {
            console.log(`❌ Fail: ${a.title} - ${e.code || e.message}`);
        }
    }
}
run();
