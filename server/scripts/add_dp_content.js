const mongoose = require('mongoose');
require('dotenv').config();

const Wallpaper = require('../models/Wallpaper');

const dpWallpapers = [
    {
        title: 'Cyberpunk Neon Rift',
        imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop',
        category: 'DP',
        type: 'DP',
        tags: ['CYBERPUNK', 'NEON', 'FUTURISTIC'],
        description: 'Ultra-premium cyberpunk themed display profile artifact.'
    },
    {
        title: 'Zen Minimal Sphere',
        imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
        category: 'DP',
        type: 'DP',
        tags: ['ZEN', 'MINIMAL', 'DARK'],
        description: 'Calming minimal aesthetic display profile artifact.'
    },
    {
        title: 'Cosmic Void Artifact',
        imageUrl: 'https://images.unsplash.com/photo-1614726365918-60520609cc41?q=80&w=1000&auto=format&fit=crop',
        category: 'DP',
        type: 'DP',
        tags: ['SPACE', 'COSMIC', 'NEBULA'],
        description: 'Deep space inspired professional display profile.'
    },
    {
        title: 'Ethereal Geometry',
        imageUrl: 'https://images.unsplash.com/photo-1550684399-3f01b8964826?q=80&w=1000&auto=format&fit=crop',
        category: 'DP',
        type: 'DP',
        tags: ['GEOMETRIC', 'ABSTRACT', 'GOLDEN'],
        description: 'Premium geometric artifact for social profiles.'
    },
    {
        title: 'Noir Shadow Core',
        imageUrl: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=1000&auto=format&fit=crop',
        category: 'DP',
        type: 'DP',
        tags: ['NOIR', 'DARK', 'MYSTERIOUS'],
        description: 'Dark noir aesthetic display profile.'
    }
];

async function seedDP() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('CONNECTED TO DATABASE...');

        const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

        for (const wp of dpWallpapers) {
            const slug = `${slugify(wp.title)}-${Math.random().toString(36).substring(2, 7)}`;
            await Wallpaper.create({ ...wp, slug });
            console.log(`DEPLOYED: ${wp.title}`);
        }

        console.log('ALL DP ARTIFACTS DEPLOYED SUCCESSFULLY.');
        process.exit(0);
    } catch (err) {
        console.error('DEPLOYMENT FAILED:', err);
        process.exit(1);
    }
}

seedDP();
