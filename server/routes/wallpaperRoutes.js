const express = require('express');
const router = express.Router();
const Wallpaper = require('../models/Wallpaper');
const { upload, cloudinary } = require('../config/cloudinary');
const slugify = require('slugify');

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

// @route   GET /api/wallpapers/slug/:slug
// @desc    Get single wallpaper by slug
router.get('/slug/:slug', async (req, res) => {
    try {
        const wallpaper = await Wallpaper.findOne({ slug: req.params.slug });
        if (!wallpaper) {
            return res.status(404).json({ message: 'Wallpaper not found' });
        }
        res.json(wallpaper);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/wallpapers
// @desc    Get all wallpapers (with optional shuffle)
router.get('/', async (req, res) => {
    try {
        const { category, search, type, shuffle } = req.query;
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

        // If shuffle is requested and no specific filters are applied, use aggregation
        if (shuffle === 'true' && !search && (!category || category === 'All')) {
            const wallpapers = await Wallpaper.aggregate([{ $sample: { size: 50 } }]);
            return res.json(wallpapers);
        }

        const wallpapers = await Wallpaper.find(query).sort({ createdAt: -1 });
        res.json(wallpapers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/wallpapers/related/:id
// @desc    Get related wallpapers based on tags and category
router.get('/related/:id', async (req, res) => {
    try {
        const wallpaper = await Wallpaper.findById(req.params.id);
        if (!wallpaper) {
            return res.status(404).json({ message: 'Wallpaper not found' });
        }

        // Semantic Match: Same category OR overlapping tags
        const related = await Wallpaper.find({
            _id: { $ne: wallpaper._id },
            $or: [
                { category: wallpaper.category },
                { tags: { $in: wallpaper.tags } }
            ]
        }).limit(20);

        // Shuffle the results locally for variety
        const shuffled = related.sort(() => 0.5 - Math.random()).slice(0, 12);
        res.json(shuffled);
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
        const { title, category, tags, description, type } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        // Generate base slug
        let baseSlug = slugify(title, { lower: true, strict: true });
        // Ensure uniqueness by adding a short random string
        let slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

        const newWallpaper = new Wallpaper({
            title,
            slug,
            description: description || `Download high quality ${title} 4K wallpaper for your desktop or mobile. Beautiful ${category} themed background available for free.`,
            imageUrl: req.file.path,
            publicId: req.file.filename,
            category,
            type: type || 'Desktop',
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        });

        const savedWallpaper = await newWallpaper.save();
        res.status(201).json(savedWallpaper);
    } catch (err) {
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

// @route   PUT /api/wallpapers/:id
// @desc    Update wallpaper metadata
router.put('/:id', authGuard, async (req, res) => {
    try {
        const { title, category, tags, description, type } = req.body;
        const wallpaper = await Wallpaper.findById(req.params.id);

        if (!wallpaper) {
            return res.status(404).json({ message: 'Wallpaper not found' });
        }

        if (title) {
            wallpaper.title = title;
            // Regenerate slug if title changes to keep URLs consistent and unique
            const baseSlug = slugify(title, { lower: true, strict: true });
            wallpaper.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
        }
        if (category) wallpaper.category = category;
        if (description) wallpaper.description = description;
        if (type) wallpaper.type = type;
        if (tags) wallpaper.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());

        const updatedWallpaper = await wallpaper.save();
        res.json(updatedWallpaper);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PATCH /api/wallpapers/download/:id
// @desc    Increment download count
router.patch('/download/:id', async (req, res) => {
    try {
        const wallpaper = await Wallpaper.findByIdAndUpdate(
            req.params.id,
            { $inc: { downloads: 1 } },
            { new: true }
        );
        if (!wallpaper) {
            return res.status(404).json({ message: 'Wallpaper not found' });
        }
        res.json({ downloads: wallpaper.downloads });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
