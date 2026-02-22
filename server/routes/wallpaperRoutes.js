const express = require('express');
const router = express.Router();
const Wallpaper = require('../models/Wallpaper');
const { upload, cloudinary } = require('../config/cloudinary');

// Professional Secret Key (Simple but Effective)
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

const authGuard = (req, res, next) => {
    const secret = req.headers['x-admin-secret'];
    if (secret === ADMIN_SECRET) {
        next();
    } else {
        res.status(403).json({ message: 'UNAUTHORIZED ACCESS' });
    }
};

// @route   GET /api/wallpapers
// @desc    Get all wallpapers
router.get('/', async (req, res) => {
    try {
        const { category, search, type } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (type && type !== 'All') {
            query.type = type;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const wallpapers = await Wallpaper.find(query).sort({ createdAt: -1 });
        res.json(wallpapers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/wallpapers/upload
// @desc    Upload a new wallpaper
router.post('/upload', authGuard, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer/Cloudinary Error:', err);
            return res.status(500).json({ message: 'Upload error', error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { title, category, tags } = req.body;
        console.log('Upload Request Body:', req.body);
        console.log('Uploaded File:', req.file);

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const newWallpaper = new Wallpaper({
            title: req.body.title,
            imageUrl: req.file.path,
            publicId: req.file.filename,
            category: req.body.category,
            type: req.body.type || 'Desktop',
            tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
        });

        const savedWallpaper = await newWallpaper.save();
        console.log('Wallpaper Saved:', savedWallpaper);
        res.status(201).json(savedWallpaper);
    } catch (err) {
        console.error('Database Save Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/wallpapers/:id
// @desc    Delete a wallpaper
router.delete('/:id', authGuard, async (req, res) => {
    try {
        const wallpaper = await Wallpaper.findById(req.params.id);
        if (!wallpaper) {
            return res.status(404).json({ message: 'Wallpaper not found' });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(wallpaper.publicId);

        // Delete from DB
        await wallpaper.deleteOne();

        res.json({ message: 'Wallpaper deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
