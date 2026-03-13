const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

const wallpapers = [
    // NATURE CATEGORY (Pexels)
    {
        title: "Snowy Mountain Lake Nature Scenery 4K",
        url: "https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&w=3840",
        category: "Nature",
        type: "Desktop",
        tags: "Nature, 4K, Mountain, Lake, Scenery, Wallpaper, High Resolution",
        description: "Stunning 4K nature wallpaper featuring a serene snowy mountain lake. Perfect for desktop backgrounds."
    },
    {
        title: "Sun-Drenched Green Forest Path 4K",
        url: "https://images.pexels.com/photos/2386144/pexels-photo-2386144.jpeg?auto=compress&cs=tinysrgb&w=3840",
        category: "Nature",
        type: "Desktop",
        tags: "Nature, Forest, Sunlight, Green, Woods, 4K, Wallpaper",
        description: "Premium 4K forest wallpaper with sunlight filtering through lush green trees. Aesthetic nature background."
    },
    {
        title: "Misty Mountain Sunrise Landscape 4K",
        url: "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&w=3840",
        category: "Nature",
        type: "Desktop",
        tags: "Nature, Mountain, Sunrise, Misty, Landscape, 4K, Wallpaper",
        description: "Breathtaking misty mountain sunrise landscape in 4K resolution. Ideal for high-end screens."
    },
    {
        title: "Autumn Lake Reflection Wallpaper 4K",
        url: "https://images.pexels.com/photos/15286/pexels-photo-15286.jpg?auto=compress&cs=tinysrgb&w=3840",
        category: "Nature",
        type: "Desktop",
        tags: "Nature, Autumn, Lake, Reflection, Trees, 4K, Wallpaper",
        description: "Beautiful autumn lake reflection wallpaper in 4K. Golden leaves and calm water aesthetic."
    },
    {
        title: "Morning Dew on Green Leaf Macro 4K",
        url: "https://images.pexels.com/photos/147411/pexels-photo-147411.jpeg?auto=compress&cs=tinysrgb&w=3840",
        category: "Nature",
        type: "Mobile",
        tags: "Nature, Macro, Leaf, Dew, Morning, 4K, Mobile Wallpaper",
        description: "Exquisite macro shot of morning dew on a green leaf. High-resolution mobile wallpaper."
    },
    {
        title: "Lush Green Waterfall Scenery 4K",
        url: "https://images.pexels.com/photos/1131458/pexels-photo-1131458.jpeg?auto=compress&cs=tinysrgb&w=3840",
        category: "Nature",
        type: "Desktop",
        tags: "Nature, Waterfall, Forest, Green, 4K, Wallpaper, Scenery",
        description: "Refreshing 4K waterfall wallpaper set in a lush green forest. Premium nature background."
    },
    {
        title: "Majestic Aurora Borealis Night Sky 4K",
        url: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=3840",
        category: "Nature",
        type: "Desktop",
        tags: "Nature, Aurora, Night Sky, Stars, 4K, Wallpaper, Space",
        description: "Stunning 4K wallpaper of the Aurora Borealis over a snowy landscape. Cinematic night sky scenery."
    },
    {
        title: "Starry Night Over Desert Landscape 4K",
        url: "https://images.pexels.com/photos/2072175/pexels-photo-2072175.jpeg?auto=compress&cs=tinysrgb&w=3840",
        category: "Nature",
        type: "Desktop",
        tags: "Nature, Desert, Night Sky, Stars, 4K, Wallpaper, Minimalist",
        description: "Minimalist 4K desert wallpaper under a clear starry night sky. Elegant nature background."
    },
    {
        title: "Powerful Ocean Waves Crashing 4K",
        url: "https://images.pexels.com/photos/2698188/pexels-photo-2698188.jpeg?auto=compress&cs=tinysrgb&w=3840",
        category: "Nature",
        type: "Desktop",
        tags: "Nature, Ocean, Waves, Sea, 4K, Wallpaper, Beach",
        description: "Dynamic 4K ocean wallpaper showing powerful waves crashing on rocky shores."
    },
    {
        title: "Vibrant Sunset Over Golden Field 4K",
        url: "https://images.pexels.com/photos/355747/pexels-photo-355747.jpeg?auto=compress&cs=tinysrgb&w=3840",
        category: "Nature",
        type: "Desktop",
        tags: "Nature, Sunset, Field, Landscape, 4K, Wallpaper, Warm",
        description: "Warm and vibrant sunset over a golden field in 4K. Peaceful and aesthetic nature scenery."
    },

    // CYBERPUNK CATEGORY (Unsplash)
    {
        title: "Futuristic Cyberpunk City Night 4K",
        url: "https://images.unsplash.com/photo-1605142859862-978be7eba909?auto=format&fit=crop&q=80&w=3840",
        category: "Cyberpunk",
        type: "Desktop",
        tags: "Cyberpunk, Futuristic, City, Night, Neon, 4K, Wallpaper",
        description: "Immersive 4K cyberpunk city wallpaper with neon lights and futuristic architecture."
    },
    {
        title: "Retro Neon Terminal aesthetic 4K",
        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=3840",
        category: "Cyberpunk",
        type: "Desktop",
        tags: "Cyberpunk, Retro, Neon, Terminal, Tech, 4K, Wallpaper",
        description: "Aesthetic retro neon terminal wallpaper in 4K. Perfect for tech enthusiasts and developers."
    },
    {
        title: "Neon Drenched Cyberpunk Street 4K",
        url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&q=80&w=3840",
        category: "Cyberpunk",
        type: "Desktop",
        tags: "Cyberpunk, Neon, Street, City, Night, 4K, Wallpaper",
        description: "Detailed 4K cyberpunk street wallpaper with vibrant neon signs and rainy reflections."
    },
    {
        title: "Cyberpunk Hardware Glow 4K",
        url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=3840",
        category: "Cyberpunk",
        type: "Desktop",
        tags: "Cyberpunk, Tech, Hardware, Glow, Neon, 4K, Wallpaper",
        description: "Close-up 4K wallpaper of futuristic hardware with neon glow. Tech-noir aesthetic."
    },
    {
        title: "Abstract Neon Light Patterns 4K",
        url: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=3840",
        category: "Cyberpunk",
        type: "Mobile",
        tags: "Cyberpunk, Neon, Abstract, Pattern, Glow, 4K, Mobile Wallpaper",
        description: "Vibrant abstract neon light patterns in 4K. stunning mobile wallpaper for OLED screens."
    },
    {
        title: "Night City Neon Skyline 4K",
        url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=3840",
        category: "Cyberpunk",
        type: "Desktop",
        tags: "Cyberpunk, City, Skyline, Night, Neon, 4K, Wallpaper",
        description: "Panoramic 4K skyline wallpaper of a cyberpunk city at night with glowing towers."
    },
    {
        title: "Cyberpunk Matrix Code Neon 4K",
        url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=3840",
        category: "Cyberpunk",
        type: "Desktop",
        tags: "Cyberpunk, Matrix, Code, Neon, Green, 4K, Wallpaper",
        description: "Matrix-style code rain wallpaper in 4K with a cyberpunk neon green glow."
    },
    {
        title: "Neon City Rainy Night Aesthetic 4K",
        url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=3840",
        category: "Cyberpunk",
        type: "Desktop",
        tags: "Cyberpunk, Neon, Rain, City, Aesthetic, 4K, Wallpaper",
        description: "Atmospheric 4K wallpaper of a neon city on a rainy night. Premium aesthetic background."
    },
    {
        title: "Deep Neon Nebula Space 4K",
        url: "https://images.unsplash.com/photo-1511447333035-21e6c551c811?auto=format&fit=crop&q=80&w=3840",
        category: "Cyberpunk",
        type: "Mobile",
        tags: "Cyberpunk, Space, Nebula, Neon, Purple, 4K, Mobile Wallpaper",
        description: "Mesmerizing 4K mobile wallpaper of a deep space nebula with neon purple and pink hues."
    },
    {
        title: "Futuristic Tech Terminal 4K",
        url: "https://images.unsplash.com/photo-1545641246-bcad7cde59ad?auto=format&fit=crop&q=80&w=3840",
        category: "Cyberpunk",
        type: "Desktop",
        tags: "Cyberpunk, Tech, Terminal, Futuristic, 4K, Wallpaper",
        description: "High-tech futuristic terminal wallpaper in 4K resolution. Clean and modern tech design."
    },

    // ABSTRACT CATEGORY (Unsplash)
    {
        title: "Vibrant Liquid Abstract Paint 4K",
        url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=3840",
        category: "Abstract",
        type: "Desktop",
        tags: "Abstract, Paint, Liquid, Colorful, 4K, Wallpaper, Art",
        description: "Modern 4K abstract wallpaper featuring vibrant liquid paint swirls. Artistic background."
    },
    {
        title: "Smooth Gradient Mesh Abstract 4K",
        url: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=3840",
        category: "Abstract",
        type: "Desktop",
        tags: "Abstract, Gradient, Mesh, Smooth, 4K, Wallpaper, Minimalist",
        description: "Clean and smooth gradient mesh abstract wallpaper in 4K. Perfect for a minimalist desktop."
    },
    {
        title: "Minimal Geometric Shapes Abstract 4K",
        url: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=3840",
        category: "Abstract",
        type: "Desktop",
        tags: "Abstract, Geometric, Minimal, Shapes, 4K, Wallpaper",
        description: "Minimalist geometric shapes wallpaper in 4K resolution. Artistic and modern design."
    },
    {
        title: "Dark Minimalist Geometric 4K",
        url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=3840",
        category: "Abstract",
        type: "Desktop",
        tags: "Abstract, Dark, Geometric, Minimal, 4K, Wallpaper",
        description: "Sleek dark minimalist geometric wallpaper in 4K. Professional and modern background."
    },
    {
        title: "Abstract Nature Texture 4K",
        url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=3840",
        category: "Abstract",
        type: "Mobile",
        tags: "Abstract, Nature, Texture, 4K, Mobile Wallpaper",
        description: "Unique abstract nature texture wallpaper for mobile in 4K. Earthy and aesthetic."
    },
    {
        title: "Minimalist Modern Architecture Abstract 4K",
        url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=3840",
        category: "Abstract",
        type: "Desktop",
        tags: "Abstract, Architecture, Minimalist, Modern, 4K, Wallpaper",
        description: "Stunning minimalist modern architecture abstract wallpaper in 4K resolution."
    },
    {
        title: "Soft Blue Abstract Waves 4K",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=3840",
        category: "Abstract",
        type: "Desktop",
        tags: "Abstract, Blue, Waves, Soft, 4K, Wallpaper, Calm",
        description: "Calming soft blue abstract waves wallpaper in 4K. Ideal for reducing screen fatigue."
    },
    {
        title: "Colorful Geometric Composition 4K",
        url: "https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&q=80&w=3840",
        category: "Abstract",
        type: "Desktop",
        tags: "Abstract, Colorful, Geometric, Art, 4K, Wallpaper",
        description: "Dynamic and colorful geometric composition wallpaper in 4K. Creative desktop background."
    },
    {
        title: "Dark Mountain Abstract Landscape 4K",
        url: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=3840",
        category: "Abstract",
        type: "Mobile",
        tags: "Abstract, Mountain, Landscape, Dark, 4K, Mobile Wallpaper",
        description: "Moody dark mountain abstract landscape wallpaper for mobile in 4K resolution."
    },
    {
        title: "Minimalist Zen Stone Abstract 4K",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=3840",
        category: "Abstract",
        type: "Desktop",
        tags: "Abstract, Zen, Minimalist, Calm, 4K, Wallpaper",
        description: "Guilt-free minimalist zen stone abstract wallpaper in 4K. Peaceful desktop environment."
    }
];

async function downloadAndUpload(meta) {
    try {
        console.log(`🚀 Processing: ${meta.title} (${meta.category})...`);

        const response = await axios.get(meta.url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        const tempPath = path.join(__dirname, `temp_trending_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`);
        fs.writeFileSync(tempPath, buffer);

        const form = new FormData();
        form.append('title', meta.title);
        form.append('category', meta.category);
        form.append('type', meta.type);
        form.append('tags', meta.tags);
        form.append('description', meta.description);
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
        console.error(`❌ Failed: ${meta.title} - ${err.response?.status || err.message}`);
    }
}

async function run() {
    console.log('--- STARTING HIGH-REACH TRENDING UPLOAD ---');
    for (const w of wallpapers) {
        await downloadAndUpload(w);
    }
    console.log('--- UPLOAD COMPLETE ---');
}

run();
