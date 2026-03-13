const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const Wallpaper = require('../models/Wallpaper');
const FormData = require('form-data');
const path = require('path');

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

const allToUpload = [
    { id: "FbjpsKn9G3c", title: "A tall building lit up at night time", category: 'Technology' },
    { id: "WrjxzLskZK0", title: "A purple and blue abstract background with lines", category: 'Technology' }
];

async function processItem(item) {
    const { id, title, category } = item;
    console.log(`🚀 [${category}] ${id}...`);
    
    let imageUrl = '';
    try {
        const redirRes = await fetch(`https://unsplash.com/photos/${id}/download`, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
        if (redirRes.status === 302 || redirRes.status === 301) {
            imageUrl = redirRes.headers.get('location');
        } else {
            console.log(`❌ Redirect failed, status: ${redirRes.status}`);
            const text = await redirRes.text();
            console.log(`❌ Head of response: ${text.substring(0, 100)}`);
            return false;
        }
    } catch (err) { 
        console.log(`❌ Error getting redirect: ${err.message}`);
        return false; 
    }
    
    if (!imageUrl) return false;
    console.log(`Image URL received for ${id}`);

    imageUrl = imageUrl.replace(/&w=\d+/, '').replace(/&q=\d+/, '') + '&w=2560&q=80';
    const tempPath = path.join(__dirname, `test_${id}.jpg`);

    try {
        console.log(`Downloading ${id}...`);
        const bufRes = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) });
        if (!bufRes.ok) {
            console.log(`❌ Download failed config: ${bufRes.status}`);
            return false;
        }
        
        fs.writeFileSync(tempPath, Buffer.from(await bufRes.arrayBuffer()));
        console.log(`Downloaded ${id} size: ${fs.statSync(tempPath).size}`);

        const form = new FormData();
        form.append('title', title);
        form.append('category', category);
        form.append('type', 'Desktop'); 
        form.append('tags', `${category}, 4K, Wallpaper, Premium, Unsplash, ${id}`);
        form.append('description', `Download premium high-resolution 4K ${category} wallpaper.`);
        form.append('image', fs.createReadStream(tempPath));

        console.log(`Uploading ${id} to DB...`);
        const apiRes = await fetch(API_URL, {
            method: 'POST',
            headers: { ...form.getHeaders(), 'x-admin-secret': ADMIN_SECRET },
            body: form,
            signal: AbortSignal.timeout(60000)
        });

        if (!apiRes.ok) {
            const txt = await apiRes.text();
            console.log(`❌ Upload failed: ${apiRes.status} - ${txt.substring(0,200)}`);
            return false;
        }
        console.log(`✅ Success: ${id}`);
        return true;
    } catch (err) { 
        console.log(`❌ Upload error: ${err.message}`);
        return false; 
    } 
    finally {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
}

async function start() {
    await mongoose.connect(process.env.MONGODB_URI);
    for (const item of allToUpload) {
        await processItem(item);
    }
    process.exit(0);
}
start();
