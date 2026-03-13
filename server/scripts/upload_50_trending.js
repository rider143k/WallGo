const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

const pexelsBase = 'https://images.pexels.com/photos/';
const pexelsSuffix = '/pexels-photo-';

const wallpapers = [
    // --- NATURE (10) ---
    { id: 1320686, title: "Snowy Mountain Lake View 4K", category: "Nature", type: "Desktop" },
    { id: 2386144, title: "Sunlight Through Forest Trees 4K", category: "Nature", type: "Desktop" },
    { id: 210186, title: "Misty Mountain Sunrise 4K", category: "Nature", type: "Desktop" },
    { id: 15286, title: "Autumn Lake Reflection 4K", category: "Nature", type: "Desktop" },
    { id: 147411, title: "Morning Dew Green Leaf 4K", category: "Nature", type: "Mobile" },
    { id: 1131458, title: "Lush Green Waterfall Scenery 4K", category: "Nature", type: "Desktop" },
    { id: 1366919, title: "Aurora Borealis Over Snow 4K", category: "Nature", type: "Desktop" },
    { id: 2072175, title: "Starry Night Over Desert 4K", category: "Nature", type: "Desktop" },
    { id: 2698188, title: "Ocean Waves Crashing Shore 4K", category: "Nature", type: "Desktop" },
    { id: 355747, title: "Vibrant Fields Sunset 4K", category: "Nature", type: "Desktop" },

    // --- SPACE (15) ---
    { id: 1624438, title: "Glowing Nebula and Stars 4K", category: "Space", type: "Desktop" },
    { id: 7609714, title: "Blue and Purple Galaxy 4K", category: "Space", type: "Desktop" },
    { id: 757881, title: "Milky Way Galaxy View 4K", category: "Space", type: "Desktop" },
    { id: 1045233, title: "Deep Space Night Sky 4K", category: "Space", type: "Desktop" },
    { id: 2156, title: "Astronaut in Open Space 4K", category: "Space", type: "Desktop" },
    { id: 5984635, title: "Colorful Cosmic Galaxy 4K", category: "Space", type: "Desktop" },
    { id: 356024, title: "Planet Earth from Space 4K", category: "Space", type: "Desktop" },
    { id: 980145, title: "Deep Spiral Galaxy 4K", category: "Space", type: "Desktop" },
    { id: 220201, title: "Starfield Background 4K", category: "Space", type: "Desktop" },
    { id: 4099238, title: "Abstract Cosmic Art 4K", category: "Space", type: "Mobile" },
    { id: 757889, title: "Stars and Purple Nebula 4K", category: "Space", type: "Desktop" },
    { id: 7860477, title: "Astronaut on Moon Surface 4K", category: "Space", type: "Desktop" },
    { id: 2541306, title: "Nebulae Dust and Stars 4K", category: "Space", type: "Desktop" },
    { id: 39561, title: "Glowing Purple Space Cloud 4K", category: "Space", type: "Desktop" },
    { id: 1530264, title: "Cosmic Dust and Starry Sky 4K", category: "Space", type: "Desktop" },

    // --- CYBERPUNK (15) ---
    { id: 1612351, title: "Cyberpunk City Neon Lights 4K", category: "Cyberpunk", type: "Desktop" },
    { id: 114979, title: "Neon Tokyo Night Street 4K", category: "Cyberpunk", type: "Desktop" },
    { id: 1105666, title: "Futuristic Urban Neon 4K", category: "Cyberpunk", type: "Desktop" },
    { id: 112460, title: "Cyberpunk Rainy Night 4K", category: "Cyberpunk", type: "Desktop" },
    { id: 1036936, title: "Digital City Horizon 4K", category: "Cyberpunk", type: "Desktop" },
    { id: 771742, title: "Neon Building Reflection 4K", category: "Cyberpunk", type: "Desktop" },
    { id: 262333, title: "OLED Neon Lines Abstract 4K", category: "Cyberpunk", type: "Mobile" },
    { id: 2422265, title: "Futuristic Core Tech 4K", category: "Cyberpunk", type: "Desktop" },
    { id: 1601774, title: "Cyberpunk Terminal Glow 4K", category: "Cyberpunk", type: "Desktop" },
    { id: 2387793, title: "Neon Skyline After Dark 4K", category: "Cyberpunk", type: "Desktop" },
    { id: 1612353, title: "Rainy Cyberpunk Alleyway 4K", category: "Cyberpunk", type: "Desktop" },
    { id: 1763075, title: "Neon Signage Cityscape 4K", category: "Cyberpunk", type: "Desktop" },
    { id: 1314410, title: "Retro Future Neon Mesh 4K", category: "Cyberpunk", type: "Desktop" },
    { id: 1166750, title: "Cyberpunk Motion Blur 4K", category: "Cyberpunk", type: "Desktop" },
    { id: 1432675, title: "Minimalist Neon Glow 4K", category: "Cyberpunk", type: "Mobile" },

    // --- ABSTRACT (15) ---
    { id: 247413, title: "Vibrant Liquid Flow Abstract 4K", category: "Abstract", type: "Desktop" },
    { id: 268533, title: "Geometric Minimalist Pattern 4K", category: "Abstract", type: "Desktop" },
    { id: 20967, title: "Smooth Texture Abstract 4K", category: "Abstract", type: "Desktop" },
    { id: 1020315, title: "Colorful Mesh Gradient 4K", category: "Abstract", type: "Desktop" },
    { id: 1144687, title: "Modern Minimalist Art 4K", category: "Abstract", type: "Desktop" },
    { id: 1261728, title: "Minimal Digital Abstract 4K", category: "Abstract", type: "Desktop" },
    { id: 1585325, title: "Fluid Paint Splatter 4K", category: "Abstract", type: "Desktop" },
    { id: 1038914, title: "Minimalist Geometry 4K", category: "Abstract", type: "Desktop" },
    { id: 1261731, title: "Soft Blue Abstract Waves 4K", category: "Abstract", type: "Desktop" },
    { id: 1509534, title: "Aesthetic Abstract Shapes 4K", category: "Abstract", type: "Mobile" },
    { id: 129731, title: "Dark Minimalist Texture 4K", category: "Abstract", type: "Desktop" },
    { id: 310452, title: "Golden Grain Abstract 4K", category: "Abstract", type: "Desktop" },
    { id: 235985, title: "Geometric Lines Overlay 4K", category: "Abstract", type: "Desktop" },
    { id: 1161275, title: "Colorful Abstract Compositon 4K", category: "Abstract", type: "Desktop" },
    { id: 1005644, title: "Minimalist Zen Stone Art 4K", category: "Abstract", type: "Desktop" },

    // --- ARCHITECTURE (5) ---
    { id: 1546168, title: "Minimalist Modern Building 4K", category: "Architecture", type: "Desktop" },
    { id: 1571460, title: "Sleek Urban Glass Tower 4K", category: "Architecture", type: "Desktop" },
    { id: 1571458, title: "Modern Concrete Minimalist 4K", category: "Architecture", type: "Desktop" },
    { id: 1571459, title: "Architectural Clean Lines 4K", category: "Architecture", type: "Desktop" },
    { id: 1571462, title: "Minimalist Facade 4K", category: "Architecture", type: "Desktop" }
];

async function downloadAndUpload(meta) {
    try {
        console.log(`🚀 Processing: [${meta.category}] ${meta.title}...`);

        // Pexels direct image URL format
        const imageUrl = `${pexelsBase}${meta.id}${pexelsSuffix}${meta.id}.jpeg?auto=compress&cs=tinysrgb&w=3840`;

        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        const tempPath = path.join(__dirname, `temp_50_${Date.now()}_${meta.id}.jpg`);
        fs.writeFileSync(tempPath, buffer);

        const form = new FormData();
        form.append('title', meta.title);
        form.append('category', meta.category);
        form.append('type', meta.type);
        form.append('tags', `${meta.category}, 4K, Wallpaper, Premium, ${meta.title}`);
        form.append('description', `Download premium high-resolution 4K ${meta.category} wallpaper: ${meta.title}. Perfect for desktop and mobile backgrounds.`);
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

        console.log(`✅ Success: ${meta.title} -> ${res.data.slug}`);
        fs.unlinkSync(tempPath);
    } catch (err) {
        console.error(`❌ Failed: ${meta.title} - ${err.message}`);
    }
}

async function run() {
    console.log('--- STARTING 60+ TRENDING UPLOAD ---');
    for (const w of wallpapers) {
        await downloadAndUpload(w);
    }
    console.log('--- BATCH UPLOAD COMPLETE ---');
}

run();
