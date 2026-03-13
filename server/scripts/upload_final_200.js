const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

const pexelsBase = 'https://images.pexels.com/photos/';
const pexelsSuffix = '/pexels-photo-';

const wallpapers = [
    // --- ANIMALS (71) ---
    ...["33045", "28844179", "29070048", "6211137", "33570548", "29853318", "30844491", "189349", "32533771", "3850526", "247431", "31134390", "29862068", "32533788", "32533786", "28808903", "28217302", "36762", "33260938", "29973784", "54081", "30802991", "34164263", "130621", "3689269", "50594", "15286", "35623764", "29070045", "1226302", "1335971", "459301", "443446", "1624496", "28946858", "28995855", "28808424", "29973780", "52961", "30803004", "28996038", "13714194", "27498979", "28996037", "12766489", "163872", "33684193", "34164265", "31318763", "33684191", "29070042", "28217301", "29070050", "30803014", "32533776", "325044", "57406", "29133080", "30803002", "326055", "28794071", "1198802", "6054896", "29853082", "631317", "28946857", "1313252", "33570535", "29853091", "32533779", "30845525"].map(id => ({ id, category: "Animals", title: `Beautiful Wild Animal 4K - ${id}` })),

    // --- SUPERCARS (20) ---
    ...[3802510, 30678548, 30678549, 30757226, 29112728, 28559697, 337909, 4635349, 28559696, 17377920, 18003058, 4635345, 28652544, 3752194, 39501, 33840240, 30821414, 19986977, 30806971, 17377372].map(id => ({ id, category: "Supercars", title: `Luxury Supercar 4K - ${id}` })),

    // --- MOTORBIKES (20) ---
    ...[104842, 2116475, 35875332, 1001815, 17856976, 15257122, 1413412, 26741270, 997217, 20727529, 5803146, 27178769, 1483778, 35607168, 36399866, 1123751, 269583, 1350591, 3801091, 100582].map(id => ({ id, category: "Bikes", title: `Premium Motorbike 4K - ${id}` })),

    // --- CITY NIGHT (20) ---
    ...[3980364, 2921139, 3799176, 3075993, 17306132, 5920069, 36789, 3125171, 4017682, 17629846, 913380, 862105, 802599, 2921137, 8047, 316093, 531360, 248867, 2989727, 258173].map(id => ({ id, category: "City", title: `Modern City Night 4K - ${id}` }))
];

async function downloadAndUpload(meta) {
    try {
        console.log(`🚀 Processing: [${meta.category}] ${meta.title}...`);

        const imageUrl = `${pexelsBase}${meta.id}${pexelsSuffix}${meta.id}.jpeg?auto=compress&cs=tinysrgb&w=3840`;

        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        const tempPath = path.join(__dirname, `temp_200_${Date.now()}_${meta.id}.jpg`);
        fs.writeFileSync(tempPath, buffer);

        const form = new FormData();
        form.append('title', meta.title);
        form.append('category', meta.category);
        form.append('type', 'Desktop'); // Default to desktop for these IDs
        form.append('tags', `${meta.category}, 4K, Wallpaper, Premium, ${meta.title}`);
        form.append('description', `Download premium high-resolution 4K ${meta.category} wallpaper. Perfect for desktop and mobile backgrounds.`);
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

        console.log(`✅ Success: ${meta.id} -> ${res.data.slug}`);
        fs.unlinkSync(tempPath);
    } catch (err) {
        console.error(`❌ Failed: ${meta.id} - ${err.message}`);
    }
}

async function run(start = 0, end = wallpapers.length) {
    console.log(`--- STARTING UPLOAD OF CHUNK [${start} to ${end}] ---`);
    const subset = wallpapers.slice(start, end);
    for (const w of subset) {
        await downloadAndUpload(w);
    }
    console.log(`--- CHUNK [${start} to ${end}] COMPLETE ---`);
}

// Get batch indices from command line if provided
const args = process.argv.slice(2);
const s = parseInt(args[0]) || 0;
const e = parseInt(args[1]) || wallpapers.length;

run(s, e);
