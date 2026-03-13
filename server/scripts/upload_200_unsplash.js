const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

const unsplashBase = 'https://images.unsplash.com/photo-';

const wallpapers = [
  // --- NATURE (53) ---
  ...["RwHv7LgeC7s", "Bkci_8qcdvQ", "O0R5XZfKUGQ", "01_igFr7hd4", "Qdi8UvGd1Ww", "vaPoJZB9Mzg", "YFFGkE3y4F8", "zNN6ubHmruI", "BR1WANLLpDU", "1Xex10H4vy4", "a7IQY3IDhWo", "Z2YR16_HeHA", "ABlqaNkZ8u0", "mnxppLMPVR8", "5SHCOrxocZ8", "A1fp56eo", "forCNAdw", "K80iwrIvOjI", "PbOWUhYl09Q", "v7daTKlZzaw", "1Z2niiBPg5A", "ndN00KmbJ1c", "OOE4xAnBhKo", "pjuoTjq1oFw", "hgJUUJ4LsPc", "CSpjU6hYo_0", "3P3NHLZGCp8", "BCCRqAGQQ8o", "LqXI5tK8D_g", "BgXdttocwwk", "DZELvRK9gxM", "EWrsLj_A_cM", "2zcUnWFY0IY", "eNUj8Pp66ak", "GuYrq27FPbo", "HUqm9JRlWls", "fyt04cEJFxs", "9ThCjEre0Ow", "l2tNiMDuu00", "IiNsFBjVGLU", "ruWkmt3nU58", "p3OzJuT_Dks", "L2dMFs4fdJg", "78A265wPiO4", "QfqHsb7Zc2U", "8FKY_sjPnu4", "Yxiwm90cs5g", "sWFKcteGpk4", "CttHjCdDJyY", "Po6KHrdDtZI", "DCE_r6ezdVA", "4omTQXGLw_4", "CHJdkm29Z8o"].map(id => ({ id, category: "Nature", title: `Majestic Nature Scenic 4K - ${id}` })),

  // --- SPACE (30) ---
  ...["5iFbT5w20wE", "yn2C9vBGAdw", "rDULualYaRI", "bPW05GOFx_E", "OcCmoDlcHjs", "YB3z62HwqFk", "lruHubmBzl0", "Duv_oSTVUNU", "hOI0dGIqBe0", "nqxDy9r_UFo", "pZNMBa_8bts", "rUrbBpSoNtc", "AJZ_75RTpL0", "rMsuksZ1NOU", "KDb0pJ12TEA", "K5ssZwV5yc0", "FpWirml1T8M", "37y37C7fZlc", "og9Xf7vb9kQ", "QNAiDFYjjWk", "N8CPliaHUYw", "ZAIuIY5fABk", "83s_KXETS_Q", "dmcXh2kUoT8", "JL4U3P61cx4", "pr_kNwZtYM0", "WHfpUNsHTdQ", "K_D3lh_GAjU", "hfi384eT5js", "_Omohh9uLNI"].map(id => ({ id, category: "Space", title: `Cosmic Nebula Space 4K - ${id}` })),

  // --- ARCHITECTURE (30) ---
  ...["Cij1YCFaj9w", "G2vLbKrjtU8", "j4FjddHQTDE", "SWqUDUnD0GE", "Wvs9TC7suYA", "TAjdcIe2caY", "SjFBcKQ0l5U", "SixIzwMMTjk", "MZ4OrjWZeYE", "g0m0fMB6fss", "iKaEFWaIMbk", "UhYRmGdhIX8", "XtWTf_7jAew", "CfBo2BUaK70", "g8eYUc5NSWs", "2SiI75L24y0", "IzEvw55cjQ0", "4YXm0apjGmg", "KfVRH2i3ruo", "VByFgoYxFXo", "41vSy0B3KJU", "aPjKMmHno8k", "lzRlEIeNo70", "rF98PPu4db4", "jgbhWbhKOvQ", "mYGlLo99fLw", "KTpZ7Xr4cr4", "T4AZu_4aMgo", "5piO7pjdBrM", "q9AE4uvy9OU"].map(id => ({ id, category: "Architecture", title: `Minimal Architecture City 4K - ${id}` })),

  // --- ANIMALS (30) ---
  ...["Wk2tySid4Zw", "cIPu2Kl9I6E", "3w1TfIJjj9k", "RqKNaEw_2ho", "Ys57sx9kzDc", "D_dAenMT2ng", "B_WR1ES4eVU", "uewCoNJOrxI", "xmCXl_KL8Bo", "KDXB3zckCXY", "4mKI2kMRC6E", "DRpUJYwvVFc", "TaF7Ri3Rwq0", "w4l8aWhoVjQ", "tr_J_9_9-Do", "eSxMboAhS5s", "Oc5pk_DKOTI", "_V8OK1ruS98", "SId6EFPkb7g", "BMH7QZ5KFZk", "-PpprEQA9qE", "Q2CqDNg3Piw", "w1FiWoBUtZU", "8lu0KaxTk9k", "xI5VYlM0WeI", "KalcNQXuX6o", "r5pzdZ-wqS0", "ytlAd_LJ0s4", "wcWjrV8DLAQ", "ejPkc3vwbhI"].map(id => ({ id, category: "Animals", title: `Wildlife Animal Beauty 4K - ${id}` })),

  // --- TRAVEL (30) ---
  ...["wnT08hj7Sng", "o059fXvzxmA", "u2tC8Nu1Yxg", "1ninVHRGQb0", "xGBGYBckZcE", "S7zCAVxMPTY", "sHDGa6P6UHc", "M8zjUiClRvw", "6Ro75UMpYyg", "4DRfdkajOq8", "oATr2Co7K0k", "33Jmxl4WdrU", "_q7z94T3xHs", "kFdh1o4OPt8", "8cLutd4Z8QY", "dnKYbheRklA", "z3pBTgv7At4", "hxgT7CqCC14", "8dG7MPEDqS0", "yQwptHR8oCg", "CtnCvL6IbbY", "SVtnyhxhPKk", "Uz3RoKLS8jM", "bnNll758J2A", "qkxwOSLfuiI", "y7xXK9OKQh0", "lU1pEjWZzXg", "Zceshh5YKCY", "5ArviU1Sluk", "A1eUdtijtw"].map(id => ({ id, category: "Travel", title: `Travel Luxury Scenic 4K - ${id}` }))
];

async function downloadAndUpload(meta) {
    try {
        if (!meta.category) {
            console.error(`❌ ERROR: Missing category for ${meta.id}`);
            return;
        }
        console.log(`🚀 Processing: [${meta.category}] ${meta.title}...`);
        
        // Use direct CDN URL instead of redirect to avoid 403 blocks
        const imageUrl = `https://images.unsplash.com/photo-${meta.id}?auto=format&fit=crop&w=3840&q=100`;
        
        const response = await axios.get(imageUrl, { 
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const buffer = Buffer.from(response.data, 'binary');
        
        const tempPath = path.join(__dirname, `temp_unsplash_${Date.now()}_${meta.id}.jpg`);
        fs.writeFileSync(tempPath, buffer);

        const form = new FormData();
        form.append('title', meta.title);
        form.append('category', meta.category);
        form.append('type', 'Desktop'); 
        form.append('tags', `${meta.category}, 4K, Wallpaper, Premium, Unsplash, ${meta.id}`);
        form.append('description', `Download premium high-resolution 4K ${meta.category} wallpaper. Sourced from Unsplash for the best quality experience.`);
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
        console.error(`❌ ERROR for ID: ${meta.id}`);
        console.error(`Message: ${err.message}`);
        if (err.response) {
            console.error(`Response Data: ${JSON.stringify(err.response.data).substring(0, 500)}`);
            console.error(`Response Status: ${err.response.status}`);
        } else if (err.request) {
            console.error(`No response received. Request details: ${err.config.url}`);
        } else {
            console.error(`Error Stack: ${err.stack}`);
        }
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
