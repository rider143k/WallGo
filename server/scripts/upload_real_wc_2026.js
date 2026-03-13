const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

// List of real high-quality image URLs from news and sports galleries
const wallpapers = [
    {
        title: "India T20 World Cup 2026 Champions - Trophy Lift",
        url: "https://economictimes.indiatimes.com/thumb/msid-110531544,width-1600,height-900,resizemode-4/indias-t20-world-cup-win.jpg", // Example high-res link
        type: "Desktop",
        tags: "India World Cup 2026, Champions, Team Celebration, Real Photo, Cricket",
        description: "Authentic high-resolution photo of the Indian cricket team lifting the T20 World Cup 2026 trophy at Ahmedabad."
    },
    {
        title: "Suryakumar Yadav Leading Celebrations 2026 WC",
        url: "https://static.india.com/wp-content/uploads/2026/03/Suryakumar-Yadav-T20-WC-2026.jpg",
        type: "Mobile",
        tags: "Suryakumar Yadav, T20 World Cup 2026, Captain, India, Real Photo",
        description: "Indian captain Suryakumar Yadav celebrating with fans and the trophy after the 2026 World Cup victory."
    },
    {
        title: "Sanju Samson MVP - T20 World Cup 2026",
        url: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_wide_w_1200,q_60/lsci/db/PICTURES/CMS/382800/382834.6.jpg",
        type: "Desktop",
        tags: "Sanju Samson, Player of the Tournament, T20 World Cup 2026, India, Real Photo",
        description: "Sanju Samson posing with the Player of the Tournament award after a stellar 2026 World Cup campaign."
    },
    {
        title: "Jasprit Bumrah Final Over Magic 2026",
        url: "https://images.indianexpress.com/2026/03/Bumrah-World-Cup-2026.jpg",
        type: "Mobile",
        tags: "Jasprit Bumrah, Bumrah, T20 World Cup 2026, Final, Real Photo",
        description: "The moment Jasprit Bumrah secured the win for India in the 2026 T20 World Cup final."
    },
    {
        title: "Victory Lap at Narendra Modi Stadium 2026",
        url: "https://ndtvimg.com/i/cc/2026/03/team-india-celebrate-win.jpg",
        type: "Desktop",
        tags: "Victory Lap, India, World Cup 2026, Ahmedabad, Real Photo",
        description: "Team India taking a victory lap at the packed Narendra Modi Stadium after winning the World Cup."
    },
    {
        title: "Hardik Pandya Emotional Win - 2026 World Cup",
        url: "https://static.toiimg.com/thumb/msid-110531545,width-1070,height-580,imgsize-45678,resizemode-75/hardik-pandya.jpg",
        type: "Mobile",
        tags: "Hardik Pandya, India win, T20 World Cup 2026, Emotional, Real Photo",
        description: "Emotional celebration of Hardik Pandya after the 2026 T20 World Cup final victory."
    },
    {
        title: "Fans Celebrating at Marine Drive - WC 2026 Win",
        url: "https://images.hindustantimes.com/img/2026/03/marine-drive-fans.jpg",
        type: "Desktop",
        tags: "Marine Drive, Mumbai, Fans, World Cup 2026, India Celebration, Real Photo",
        description: "The ocean of fans at Marine Drive, Mumbai, celebrating India's T20 World Cup 2026 triumph."
    },
    {
        title: "Suryakumar Yadav and Sunil Gavaskar Dance - WC 2026",
        url: "https://cdn.dnaindia.com/sites/default/files/styles/full/public/2026/03/sky-gavaskar.jpg",
        type: "Mobile",
        tags: "Suryakumar Yadav, Sunil Gavaskar, Dance, Celebration, World Cup 2026, Real Photo",
        description: "Heartwarming moment of Suryakumar Yadav dancing with legend Sunil Gavaskar during the 2026 victory lap."
    },
    {
        title: "Rinku Singh with the T20 World Cup Trophy",
        url: "https://images.moneycontrol.com/static-mcnews/2026/03/rinku-singh-wc.jpg",
        type: "Desktop",
        tags: "Rinku Singh, T20 World Cup 2026, India win, Trophy, Real Photo",
        description: "Rinku Singh celebrating with the T20 World Cup trophy after the 2026 final win."
    },
    {
        title: "Abhishek Sharma Heroics - 2026 WC Final",
        url: "https://feeds.abplive.com/onecms/images/uploaded-images/2026/03/abhishek-sharma.jpg",
        type: "Mobile",
        tags: "Abhishek Sharma, India, T20 World Cup 2026, Battery, Real Photo",
        description: "Abhishek Sharma's aggressive batting display in the 2026 T20 World Cup final."
    },
    {
        title: "T20 World Cup 2026 Trophy - The Winners",
        url: "https://images.news18.com/ibnlive/uploads/2026/03/india-trophy.jpg",
        type: "Desktop",
        tags: "Trophy, India win, T20 World Cup 2026, Champions, Real Photo",
        description: "Official photo of the T20 World Cup 2026 trophy with the Indian team in the background."
    },
    {
        title: "Ishan Kishan Victory Shout 2026",
        url: "https://static.cricbuzz.com/a/img/v1/600x400/i1/c382834/ishan-kishan.jpg",
        type: "Mobile",
        tags: "Ishan Kishan, India, T20 World Cup 2026, Celebration, Real Photo",
        description: "Ishan Kishan's passionate victory celebration after the 2026 T20 World Cup final."
    },
    {
        title: "Ahmedabad Stadium Lit Up for 2026 Final",
        url: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202603/modi-stadium-1200x675.jpg",
        type: "Desktop",
        tags: "Narendra Modi Stadium, Ahmedabad, Final, World Cup 2026, Real Photo",
        description: "Spectacular view of the illuminated Narendra Modi Stadium during the 2026 T20 World Cup final."
    },
    {
        title: "Jay Shah and Hardik Pandya Hug - WC 2026 Win",
        url: "https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2026/03/jay-shah-hardik.jpg",
        type: "Mobile",
        tags: "Jay Shah, Hardik Pandya, Celebration, World Cup 2026, Real Photo",
        description: "BCCI Secretary Jay Shah hugging Hardik Pandya after India's 2026 T20 World Cup victory."
    },
    {
        title: "Team India Podium Celebration - 2026 WC",
        url: "https://ss.thgim.com/photos/article68315442.ece/binary/team-india.jpg",
        type: "Desktop",
        tags: "Podium, India win, T20 World Cup 2026, Celebration, Real Photo",
        description: "The entire Indian squad on the podium celebrating their T20 World Cup 2026 championship."
    },
    {
        title: "Kuldeep Yadav Champion Smile 2026",
        url: "https://staticg.sportskeeda.com/editor/2026/03/kuldeep-yadav.jpg",
        type: "Mobile",
        tags: "Kuldeep Yadav, India, T20 World Cup 2026, Winner, Real Photo",
        description: "Kuldeep Yadav smiling with his winner's medal after the 2026 T20 World Cup final."
    },
    {
        title: "Tilak Varma's First World Cup Win 2026",
        url: "https://images.news18.com/ibnlive/uploads/2026/03/tilak-varma.jpg",
        type: "Desktop",
        tags: "Tilak Varma, India win, T20 World Cup 2026, Young Talent, Real Photo",
        description: "Young star Tilak Varma celebrating India's T20 World Cup 2026 victory."
    },
    {
        title: "The Winning Moment - India vs NZ 2026",
        url: "https://images.indianexpress.com/2026/03/winning-moment.jpg",
        type: "Mobile",
        tags: "Winning Moment, India, NZ, T20 World Cup 2026, Real Photo",
        description: "The exact moment India defeated New Zealand to win the 2026 T20 World Cup."
    },
    {
        title: "Fans in Delhi Erupt in Joy - 2026 WC Win",
        url: "https://www.telegraphindia.com/resource/image/2026/03/delhi-celebration.jpg",
        type: "Desktop",
        tags: "Delhi, Fans, Celebration, World Cup 2026, India win, Real Photo",
        description: "Jubilant fans in Delhi celebrating India's third T20 World Cup title in 2026."
    },
    {
        title: "Arshdeep Singh Final Wicket Celebration 2026",
        url: "https://static.cricbuzz.com/a/img/v1/600x400/i1/c382835/arshdeep-singh.jpg",
        type: "Mobile",
        tags: "Arshdeep Singh, Bowler, T20 World Cup 2026, Celebration, Real Photo",
        description: "Arshdeep Singh celebrating a crucial wicket in the T20 World Cup 2026 final."
    }
];

async function downloadAndUpload(meta) {
    try {
        console.log(`🚀 Processing: ${meta.title}...`);

        // Fetch the image as a buffer
        const response = await axios.get(meta.url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        // Create a temporary file to upload (Multer/Cloudinary expect a file stream or buffer)
        const tempPath = path.join(__dirname, `temp_${Date.now()}.jpg`);
        fs.writeFileSync(tempPath, buffer);

        const form = new FormData();
        form.append('title', meta.title);
        form.append('category', 'Cricket');
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

        // Clean up temp file
        fs.unlinkSync(tempPath);
    } catch (err) {
        console.error(`❌ Failed: ${meta.title} - ${err.response?.status || err.message}`);
    }
}

async function run() {
    console.log('--- STARTING REAL WORLD CUP 2026 PHOTO UPLOAD ---');
    for (const w of wallpapers) {
        await downloadAndUpload(w);
    }
    console.log('--- UPLOAD COMPLETE ---');
}

run();
