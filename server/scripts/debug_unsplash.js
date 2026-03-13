const axios = require('axios');
const fs = require('fs');

async function test() {
    const id = 'RwHv7LgeC7s';
    const url = `https://unsplash.com/photos/${id}/download?force=true`;
    console.log(`URL: ${url}`);
    try {
        const res = await axios.get(url, { 
            responseType: 'arraybuffer',
            maxRedirects: 10,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        console.log(`Status: ${res.status}`);
        console.log(`ContentType: ${res.headers['content-type']}`);
        console.log(`Data Length: ${res.data.length}`);
        fs.writeFileSync('test_image.jpg', Buffer.from(res.data, 'binary'));
        console.log('Saved test_image.jpg');
    } catch (err) {
        console.error('ERROR DETECTED');
        if (err.response) {
            console.error(`Status: ${err.response.status}`);
            console.error(`Data: ${err.response.data.toString().substring(0, 200)}`);
        } else {
            console.error(err);
        }
    }
}

test();
