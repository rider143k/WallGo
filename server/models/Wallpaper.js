const mongoose = require('mongoose');

const WallpaperSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    description: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Desktop', 'Mobile', 'DP'],
        required: true,
        default: 'Desktop'
    },
    category: {
        type: String,
        enum: ['Nature', 'Abstract', 'Architecture', 'Technology', 'Animals', 'Minimal', 'Cricket', 'DP'],
        default: 'Nature',
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    downloads: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Wallpaper', WallpaperSchema);
