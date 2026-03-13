const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const Wallpaper = require('../models/Wallpaper');
const FormData = require('form-data');
const path = require('path');
const axios = require('axios');

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

const capitalize = (str) => {
    if (!str) return 'Awesome Wallpaper';
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
};

async function UnsplashSearch(query, perPage, category, type) {
    console.log(`Searching Unsplash for ${query} (${perPage})...`);
    try {
        const res = await axios.get(`https://unsplash.com/napi/search/photos?query=${query}&per_page=${perPage}&orientation=landscape`);
        return res.data.results.map(img => {
            let rawTitle = img.alt_description || img.description || img.slug || query;
            let title = capitalize(rawTitle);
            if (title.length > 80) title = title.substring(0, 77) + '...';
            
            return {
                id: img.id,
                title,
                category: category,
                type: type
            };
        });
    } catch(err) {
        console.log(`Search failed for ${query}: ${err.message}`);
        return [];
    }
}

async function UnsplashSearchDP(query, perPage, category, type) {
    console.log(`Searching Unsplash for DP ${query} (${perPage})...`);
    try {
        const res = await axios.get(`https://unsplash.com/napi/search/photos?query=${query}&per_page=${perPage}&orientation=portrait`);
        return res.data.results.map(img => {
            let rawTitle = img.alt_description || img.description || img.slug || query;
            let title = capitalize(rawTitle);
            if (title.length > 80) title = title.substring(0, 77) + '...';
            return {
                id: img.id,
                title,
                category: category,
                type: type
            };
        });
    } catch(err) {
        console.log(`Search failed for ${query}: ${err.message}`);
        return [];
    }
}

async function processItem(item) {
    const { id, title, category, type } = item;
    const exists = await Wallpaper.findOne({ publicId: new RegExp(id) });
    if (exists) return false;

    console.log(`🚀 [${category}] ${title} (${id})...`);
    let imageUrl = '';
    
    try {
        await axios.get(`https://unsplash.com/photos/${id}/download`, { maxRedirects: 0, timeout: 5000 });
    } catch (err) {
        if (err.response && (err.response.status === 302 || err.response.status === 301)) {
            imageUrl = err.response.headers.location;
        } else {
            console.log(`❌ Fail on resolve: ${id}`);
            return false;
        }
    }
    
    if (!imageUrl) return false;

    if (type === 'DP') {
        imageUrl = imageUrl.replace(/&w=\d+/, '').replace(/&q=\d+/, '') + '&w=1080&h=1080&q=80&fit=crop'; 
    } else {
        imageUrl = imageUrl.replace(/&w=\d+/, '').replace(/&q=\d+/, '') + '&w=2560&q=80';
    }
    
    const tempPath = path.join(__dirname, `tmp_anime_dp_${Date.now()}_${id}.jpg`);

    try {
        const dRes = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 30000 });
        fs.writeFileSync(tempPath, dRes.data);

        const form = new FormData();
        form.append('title', title);
        form.append('category', category);
        form.append('type', type); 
        form.append('tags', `${category}, ${type}, 4K, Premium, Wallpaper, Unsplash, ${id}`);
        form.append('description', `Download premium high-resolution 4K ${category} ${type}. Sourced from Unsplash for the best quality experience.`);
        form.append('image', fs.createReadStream(tempPath));

        const res = await axios.post(API_URL, form, {
            headers: {
                ...form.getHeaders(),
                'x-admin-secret': ADMIN_SECRET
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 60000
        });

        console.log(`✅ Success: ${id} mapped to ${title}`);
        return true;
    } catch (err) {
        console.log(`❌ Error ${id} - ${err.message}`);
        return false; 
    } finally {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
}

async function start() {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const animeImages = await UnsplashSearch('anime', 30, 'Anime', 'Desktop'); 
    const animeImages2 = await UnsplashSearch('manga illustration', 30, 'Anime', 'Desktop'); 
    
    const allAnime = [...animeImages, ...animeImages2];
    const uniqueAnimeIds = new Set();
    const uniqueAnime = [];
    for(const a of allAnime) {
        if(!uniqueAnimeIds.has(a.id)) {
            uniqueAnimeIds.add(a.id);
            uniqueAnime.push(a);
        }
    }
    const totalAnime = uniqueAnime.slice(0, 50); 
    
    const dpImages = await UnsplashSearchDP('profile picture', 30, 'DP', 'DP'); 
    
    const allToUpload = [...totalAnime, ...dpImages];
    console.log(`Total items to upload: ${allToUpload.length}`);
    
    let count = 0;
    for (let i = 0; i < allToUpload.length; i += 3) {
        const chunk = allToUpload.slice(i, i + 3);
        const results = await Promise.all(chunk.map(processItem));
        count += results.filter(Boolean).length;
    }
    
    console.log(`✅ Anime and DP Upload Phase completed. Valid inserts: ${count}`);
    process.exit(0);
}
start();
