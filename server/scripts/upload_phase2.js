const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const Wallpaper = require('../models/Wallpaper');
const FormData = require('form-data');
const path = require('path');
const axios = require('axios'); // We MUST use axios to seamlessly support form-data

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

const cyberpunkTitles = {
  "HjwsOUlVdvQ": "A person taking a picture with a camera",
  "FbjpsKn9G3c": "A tall building lit up at night time",
  "WrjxzLskZK0": "A purple and blue abstract background with lines",
  "csgAAFZGyW8": "Person holding black dslr camera",
  "xhTahcRPURU": "Standing man in black jacket with mask",
  "bUgqXWoOmgo": "A person standing on a wall in front of a city at night",
  "5AoeTPabK70": "Abstract digital tunnel with green lights",
  "2FiXtdnVhjQ": "City skyline during night time",
  "Rg0qeg01PS4": "A person taking a picture with a camera",
  "5iEDtEzHQwU": "A car driving on a road",
  "PJv64Oy_lvs": "Yellow and black street sign next to a building",
  "eG--BcVyhjU": "City skyline with a bridge in the foreground",
  "iup5cbdUVxQ": "Green and blue swirl in the dark",
  "7REuDc2qK4M": "Person in a dark room with neon light",
  "Dsbim_JMpVM": "View of a large city with tall buildings",
  "oYxVRNAMBUA": "Black computer keyboard",
  "AtAeDCMJwdE": "Two people in masks in a room with many monitors",
  "ytb20t6EgGo": "Purple and green mechanical keyboard",
  "eJ93vVbyVUo": "Woman in white shirt sitting on chair",
  "7huAMW3zL3w": "Man on balcony in front of a city",
  "APElyQpGke0": "Purple and red abstract background",
  "78YjP1RxpNU": "People waiting at a train crossing at night",
  "0GvBRM56PBo": "Small shed in a field at night under stars",
  "jIgQUK4dqAw": "Field of wild plants at dusk",
  "PZAbMZZnLkE": "Statue lit up at night on a city street",
  "2vmT5_FeMck": "City street at night with lights and motion",
  "h4Zg0K4-xGs": "Cyberpunk 2077 futuristic black car",
  "yL5gBpMpy-o": "Person wearing glowing LED mask in a parking garage",
  "7PqRZK6rbaE": "Empty city street at night with pink and blue lights",
  "ihUVzI4f5To": "Wet city street at night with colorful reflections"
};

const abstractTitles = {
  "_nWaeTF6qo0": "Blue and Purple Flowing Abstract Render",
  "9XngoIpxcEo": "Dark Pink and Purple Grainy Abstract Texture",
  "FAlYVtV1kRg": "Fluid Purple and Blue Abstract Waves",
  "d2w-_1LJioQ": "Floating 3D Geometric Shapes with Glowing Orbs",
  "bKESVqfxass": "Blue and Black Diagonal Gradient Geometric Design",
  "cPccYbPrF-A": "Blue Abstract Layered Waves Render",
  "pVq6YhmDPtk": "Red and Blue Light Trails on Black Background",
  "prMn9KINLtI": "Blue and Black Marble Abstract Texture",
  "E2i7Hftb_rI": "Rain Drops on Glass with Blue Background",
  "Hlkuojv_P6I": "Cosmic Blue and Black Nebula Abstract",
  "PvgqqicSLvA": "Curved Purple and Blue Fiber Abstract Texture",
  "Kj2SaNHG-hg": "Vertical Blue and White Light Streaks",
  "37WxvlfW3to": "Dark Blue Abstract Spheres and Waves Render",
  "pVoEPpLw818": "Macro of Colorful Oil and Water Bubbles",
  "E8Ufcyxz514": "Vibrant Blue and Orange Organic Waves Abstract",
  "PGdW_bHDbpI": "Soft Pastel 3D Spheres in Fluid Landscape",
  "ERcQ81KaX9g": "Dark Teal Abstract Silk Flowing Waves",
  "YeUVDKZWSZ4": "Golden Light Streaks on Black Background",
  "LpbyDENbQQg": "Blue and White Layered Circular Abstract Render",
  "tMbQpdguDVQ": "Brown and Blue Liquid Marble Abstract Texture",
  "bZZp1PmHI0E": "Blue Geometric Dot Matrix Spiral Abstract",
  "XgeZu2jBaVI": "Blurry Blue and Pink Abstract Gradient",
  "C_NJKfnTR5A": "Vibrant Rainbow Colored Abstract Gradient",
  "iLHDO19h0ng": "Dark Abstract with Purple and Orange Fluid Curves",
  "Lki74Jj7H-U": "Blue and White Abstract Paint Splash Texture",
  "u8Jn2rzYIps": "Pink and Purple Abstract Fluid Wave on Dark Background",
  "mDvtYjZR8QI": "Raindrops on Window with City Lights at Night",
  "lhnOvu72BM8": "Fiery Red and Black Liquid Marble Abstract",
  "nY14Fs8pxT8": "Purple and Pink Soft Abstract Wave Render",
  "RYtiT3b7XW4": "Antelope Canyon Rock Formation under Cloudy Sky"
};

const techTitles = {
  "xSiQBSq-I0M": "Woman sitting on bed using laptop",
  "Im7lZjxeLhg": "Macbook with colorful screen in dark room",
  "HOrhCnQsxnQ": "Group of people in immersive blue light installation",
  "XJXWbfSo2f0": "Laptop showing code on screen",
  "FO7JIlwjOtU": "Macro photography of black circuit board",
  "8bghKxNU1j0": "Blue and purple fiber optic light strands",
  "2EJCSULRwC8": "Cute white robot Pepper standing near wall",
  "m_HRfLhgABo": "Macbook with code on screen on office desk",
  "pREq0ns_p_E": "Blue abstract network with lines and dots",
  "hpjSkU2UYSU": "Laptop on glass table displaying financial graphs",
  "sbFmoKBK7jU": "Silhouette of woman with ponytail against colorful background",
  "_0iV9LmPDn0": "AI neural network brain on blue circuit board",
  "ourQHRTE2IM": "Man using laptop in busy co-working space",
  "QBpZGqEMsKg": "Group of people working in modern open-plan office",
  "FWoq_ldWlNQ": "Screen filled with colorful lines of software code",
  "INNsF0Zz_kQ": "Glow of blue fiber optic light in dark room",
  "mr4JG4SYOF8": "3D social media and app icons illustration",
  "xuTJZ7uD7PI": "Glowing blue geometric network of lines and dots",
  "oyXis2kALVg": "Glowing blue wireframe cubes in dark space",
  "npxXWgQ33ZQ": "Hands typing on laptop keyboard at desk",
  "jXd2FSvcRr8": "Modern computer processor chip on motherboard",
  "vEE00Hx5d0Q": "Futuristic VR headset and gaming setup",
  "LqKhnDzSF-8": "Close-up of mechanical keyboard glowing in the dark",
  "OqtafYT5kTw": "Server rack lights in a dark data center",
  "IayKLkmz6g0": "Abstract digital data stream flowing",
  "1lfI7wkGWZ4": "Drone flying over a scenic smart city",
  "Wj1D-qiOseE": "Developer working on code screens with coffee",
  "wrkNQmhmdvY": "Virtual reality interface with data points",
  "Q1p7bh3SHj8": "Cyber security lock icon glowing on screen",
  "Dc_WeacR9y0": "Smartwatch with glowing digital metrics",
  "d9pClxBVpRM": "Artificial intelligence digital rendering",
  "FCRGkfSD63o": "Tech workspace with multiple monitor screens",
  "KKmo6lmNrL4": "Neon circuit pathways lighting up motherboard",
  "F4ottWBnCpM": "Digital holograms projected over smartphone",
  "SYTO3xs06fU": "Robotic arm working on an assembly line",
  "EUsVwEOsblE": "Smart home hub interface glowing",
  "tmTidmpILWw": "Blockchain cryptocurrency network visualization",
  "iar-afB0QQw": "Digital tablet on a modern minimalist desk",
  "ZPeXrWxOjRQ": "Glowing server arrays in enterprise data center",
  "glRqyWJgUeY": "Code scrolling down a hacker terminal screen"
};

const allToUpload = [
    ...Object.entries(cyberpunkTitles).map(([id, title]) => ({ id, title, category: 'Technology' })),
    ...Object.entries(abstractTitles).map(([id, title]) => ({ id, title, category: 'Abstract' })),
    ...Object.entries(techTitles).map(([id, title]) => ({ id, title, category: 'Technology' }))
];

async function processItem(item) {
    const { id, title, category } = item;
    const exists = await Wallpaper.findOne({ publicId: new RegExp(id) });
    if (exists) return false;

    console.log(`🚀 [${category}] ${id}...`);
    
    let imageUrl = '';
    // Unsplash redirect manual fetch mapping code: Axios can natively fetch without following redirects using maxRedirects: 0.
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
    imageUrl = imageUrl.replace(/&w=\d+/, '').replace(/&q=\d+/, '') + '&w=2560&q=80';
    const tempPath = path.join(__dirname, `tmp_${Date.now()}_${id}.jpg`);

    try {
        const dRes = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 30000 });
        fs.writeFileSync(tempPath, dRes.data);

        const form = new FormData();
        form.append('title', title);
        form.append('category', category);
        form.append('type', 'Desktop'); 
        form.append('tags', `${category}, 4K, Wallpaper, Premium, Unsplash, ${id}`);
        form.append('description', `Download premium high-resolution 4K ${category} wallpaper.`);
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

        console.log(`✅ Success: ${id} -> ${res.data.slug}`);
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
    
    let count = 0;
    for (let i = 0; i < allToUpload.length; i += 3) {
        const chunk = allToUpload.slice(i, i + 3);
        const results = await Promise.all(chunk.map(processItem));
        count += results.filter(Boolean).length;
    }
    
    console.log(`✅ Upload Phase 2 completed. Valid inserts: ${count}`);
    process.exit(0);
}
start();
