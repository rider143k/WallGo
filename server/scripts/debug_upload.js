const fs = require('fs');
const axios = require('axios');
const path = require('path');
const FormData = require('form-data');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';
const id = 'HjwsOUlVdvQ';

async function test() {
    try {
        let imageUrl = '';
        try {
            await axios.get(`https://unsplash.com/photos/${id}/download`, { maxRedirects: 0 });
        } catch (err) {
            if (err.response && err.response.headers.location) {
                imageUrl = err.response.headers.location;
            }
        }
        
        if (!imageUrl) { throw new Error('Could not resolve image location'); }

        // Strip out any `w=` or `q=` from query and append ours
        imageUrl = imageUrl.replace(/&w=\d+/, '').replace(/&q=\d+/, '') + '&w=3840&q=100';
        console.log('Downloading from:', imageUrl);

        const response = await axios.get(imageUrl, { 
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        const tempPath = path.join(__dirname, `temp_${id}.jpg`);
        fs.writeFileSync(tempPath, Buffer.from(response.data, 'binary'));

        const form = new FormData();
        form.append('title', 'A person taking a picture with a camera');
        form.append('category', 'Technology');
        form.append('type', 'Desktop'); 
        form.append('tags', `Technology, 4K, Wallpaper, Premium, Unsplash, ${id}`);
        form.append('description', `Download preview.`);
        form.append('image', fs.createReadStream(tempPath));

        const res = await axios.post(API_URL, form, {
            headers: {
                ...form.getHeaders(),
                'x-admin-secret': ADMIN_SECRET
            }
        });
        console.log(`Success:`, res.data);
    } catch (err) {
        console.error(`Error:`, err.message);
    }
}
test();
