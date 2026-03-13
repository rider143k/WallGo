const axios = require('axios');
const API_URL = 'http://localhost:5000/api/wallpapers/upload';
const ADMIN_SECRET = 'wallgo_secure_2026_xyz';

axios.post(API_URL, {}, { 
    headers: { 'x-admin-secret': ADMIN_SECRET } 
})
.then(r => {
    console.log('SUCCESS: Hit protected route. Status:', r.status);
})
.catch(e => {
    console.log('STATUS:', e.response?.status);
    console.log('DATA:', e.response?.data);
    console.log('MESSAGE:', e.message);
});
