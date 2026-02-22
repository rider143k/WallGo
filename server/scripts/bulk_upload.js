const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';
const WALLPAPERS_DIR = 'e:/WallGo/Wallpapers';

const uploadFile = async (filePath) => {
    const filename = path.basename(filePath);

    // Simple logic to guess category and type
    let category = 'Minimal';
    let title = filename.replace(/\.(jpg|jpeg|png|PNG)$/, '').replace(/_/g, ' ');
    let type = 'Desktop';

    if (filename.startsWith('IMG')) {
        category = 'Nature';
        type = 'Mobile';
    } else if (filename.includes('@')) {
        category = 'Abstract';
    }

    console.log(`Uploading: ${filename} as [${category}] [${type}]...`);

    const form = new FormData();
    form.append('image', fs.createReadStream(filePath));
    form.append('title', title);
    form.append('category', category);
    form.append('type', type);
    form.append('tags', `${category}, Artifact, WallGo`);

    try {
        const response = await axios.post(API_URL, form, {
            headers: {
                ...form.getHeaders(),
                'x-admin-secret': ADMIN_SECRET
            }
        });
        console.log(`Successfully uploaded: ${filename}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to upload ${filename}:`, error.response ? error.response.data : error.message);
    }
};

const run = async () => {
    const files = fs.readdirSync(WALLPAPERS_DIR).filter(f => /\.(jpg|jpeg|png|PNG)$/.test(f));
    console.log(`Found ${files.length} files to upload.`);

    for (const file of files) {
        await uploadFile(path.join(WALLPAPERS_DIR, file));
    }
    console.log('Bulk upload complete!');
};

run();
