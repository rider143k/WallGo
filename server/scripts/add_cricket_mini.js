const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

const cricketArtifacts = [
    {
        title: 'Stadium Floodlights 4K',
        url: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=85&w=3000',
        type: 'Desktop',
        tags: 'cricket, stadium, night, lights'
    },
    {
        title: 'Leather Cricket Ball Close-up',
        url: 'https://images.unsplash.com/photo-1531233075604-80cc7d42646c?q=85&w=3000',
        type: 'Desktop',
        tags: 'cricket, ball, macro, action'
    },
    {
        title: 'Australian Pitch Sunset',
        url: 'https://images.unsplash.com/photo-1512712338870-226e6d5e1684?q=85&w=3000',
        type: 'Desktop',
        tags: 'cricket, ground, sunset, australia'
    },
    {
        title: 'Batsman Professional Focus',
        url: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=85&w=2000',
        type: 'Mobile',
        tags: 'cricket, batsman, phone, 4k'
    },
    {
        title: 'Iconic London Cricket Ground',
        url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=85&w=3000',
        type: 'Desktop',
        tags: 'cricket, lords, london, ground'
    }
];

async function run() {
    console.log('--- STARTING CRICKET MINI-BATCH ---');
    for (const item of cricketArtifacts) {
        try {
            console.log(`Downloading: ${item.title}...`);
            const dl = await axios.get(item.url, { responseType: 'arraybuffer', timeout: 30000 });
            const size = dl.data.length / (1024 * 1024);
            console.log(`Size: ${size.toFixed(2)} MB`);

            const temp = path.join(__dirname, `c_${Date.now()}.jpg`);
            fs.writeFileSync(temp, dl.data);

            const form = new FormData();
            form.append('title', item.title);
            form.append('category', 'Cricket');
            form.append('type', item.type);
            form.append('tags', item.tags);
            form.append('image', fs.createReadStream(temp));
            form.append('description', `Premium 4K Cricket Artifact: ${item.title}. Verified high quality for WallGo.`);

            console.log(`Uploading: ${item.title} to ${API_URL}...`);
            const up = await axios.post(API_URL, form, {
                headers: { ...form.getHeaders(), 'x-admin-secret': ADMIN_SECRET },
                timeout: 90000
            });
            console.log(`✅ Success: ${up.data.slug}`);
            fs.unlinkSync(temp);
        } catch (e) {
            console.error(`❌ Failed: ${item.title}`);
            console.error(`   ${e.message}`);
            if (e.response) console.error(`   Status: ${e.response.status} - ${JSON.stringify(e.response.data)}`);
        }
    }
}

run();
