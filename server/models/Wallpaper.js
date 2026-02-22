const mongoose = require('mongoose');

const WallpaperSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
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
        enum: ['Desktop', 'Mobile'],
        required: true,
        default: 'Desktop'
    },
    category: {
        type: String,
        enum: ['Nature', 'Abstract', 'Architecture', 'Technology', 'Animals', 'Minimal'],
        default: 'Nature',
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Wallpaper', WallpaperSchema);
