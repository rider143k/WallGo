const mongoose = require('mongoose');
require('dotenv').config();
const Wallpaper = require('../models/Wallpaper');

const titleMapping = {
  "RwHv7LgeC7s": "Sunbeams piercing through Autumn Forest",
  "Bkci_8qcdvQ": "Mountain Valley landscape with Glacier and Pines",
  "O0R5XZfKUGQ": "Starry Night over Yosemite Mountains",
  "01_igFr7hd4": "Aerial View of Rolling Green Hills",
  "Qdi8UvGd1Ww": "Lush Green Forest Path with Tall Trees",
  "vaPoJZB9Mzg": "Yosemite Valley at Golden Hour",
  "YFFGkE3y4F8": "Snowy Mountain Reflection in Calm Lake",
  "zNN6ubHmruI": "Seljalandsfoss Waterfall at Sunset, Iceland",
  "BR1WANLLpDU": "Swiss Alps with Vibrant Autumn Forest",
  "1Xex10H4vy4": "Small Purple Wildflower on Green Leaf",
  "a7IQY3IDhWo": "A dead tree in the middle of a forest",
  "Z2YR16_HeHA": "A close up of a tree with red leaves",
  "ABlqaNkZ8u0": "A close up of a pink flower with green leaves",
  "mnxppLMPVR8": "A tree with many branches",
  "5SHCOrxocZ8": "A close up of a bunch of leaves",
  "K80iwrIvOjI": "A body of water with hills and trees around it",
  "PbOWUhYl09Q": "A river running through a valley",
  "v7daTKlZzaw": "Silhouette of mountains during night time",
  "1Z2niiBPg5A": "Foggy mountain summit",
  "ndN00KmbJ1c": "Landmark photography of trees near rocky mountain",
  "OOE4xAnBhKo": "Photo of green fern plant",
  "pjuoTjq1oFw": "A rocky landscape with plants and rocks",
  "hgJUUJ4LsPc": "A deer with antlers in the woods",
  "CSpjU6hYo_0": "Brown rock formation under blue sky",
  "3P3NHLZGCp8": "Bird's eye view of seashore",
  "BCCRqAGQQ8o": "A large field of green grass under a blue sky",
  "LqXI5tK8D_g": "A grassy field with trees in the distance",
  "BgXdttocwwk": "A close up of a dragonfly on a branch",
  "DZELvRK9gxM": "A close up of a dragonfly on a branch",
  "2zcUnWFY0IY": "A grassy field with trees and mountains in the background",
  "eNUj8Pp66ak": "A forest river runs through lush greenery",
  "GuYrq27FPbo": "A spider rests on a green plant stem",
  "HUqm9JRlWls": "White wildflowers bloom against a dark background",
  "fyt04cEJFxs": "Rocky beach with sea in the background",
  "9ThCjEre0Ow": "A lake surrounded by trees and mountains",
  "l2tNiMDuu00": "Traditional Icelandic house in a field",
  "IiNsFBjVGLU": "A snowy road with trees on either side of it",
  "ruWkmt3nU58": "Mountain reflecting in calm water at sunset",
  "p3OzJuT_Dks": "River overflow in between rock formation",
  "L2dMFs4fdJg": "Mountain range reflecting in water at sunset",
  "78A265wPiO4": "Landscape of mountain hit by sun rays",
  "QfqHsb7Zc2U": "Aerial view of teal ocean waves and sandy beach",
  "8FKY_sjPnu4": "Aerial view of a coastal area with boats",
  "Yxiwm90cs5g": "A dog is standing in the shade of a tree",
  "CttHjCdDJyY": "A small bird perched on a tree branch",
  "Po6KHrdDtZI": "Houses sit in a dark field near trees",
  "DCE_r6ezdVA": "A green plant with water drops on it",
  "4omTQXGLw_4": "A close-up of a bunch of leaves",
  "CHJdkm29Z8o": "Brown short-coated dog lying on dried leaves",
  "G2vLbKrjtU8": "Gray wooden wall architecture pattern",
  "j4FjddHQTDE": "Industrial metal structure architectural design",
  "SWqUDUnD0GE": "Modern cable-stayed bridge close-up",
  "Wvs9TC7suYA": "Close-up of curved metal industrial structure",
  "TAjdcIe2caY": "Modern building with golden curves against blue sky",
  "SixIzwMMTjk": "Silhouetted building with glowing orange edges at night",
  "MZ4OrjWZeYE": "Low-angle black and white shot of building corner",
  "g0m0fMB6fss": "Symmetrical gray concrete building facade architecture",
  "iKaEFWaIMbk": "Low angle shot of modern building grid architecture",
  "UhYRmGdhIX8": "Abstract 3D render of geometric blocks against blue sky",
  "XtWTf_7jAew": "Sharp geometric corner of black and white building architecture",
  "CfBo2BUaK70": "High contrast white building corner against black background",
  "g8eYUc5NSWs": "Diagonal shot of building with triangular mesh facade",
  "2SiI75L24y0": "Tall white skyscraper against dark dramatic sky",
  "IzEvw55cjQ0": "Minimalist low angle shot of white building corner",
  "rUrbBpSoNtc": "Abstract colorful cosmic nebula pattern with pink and blue",
  "AJZ_75RTpL0": "Vibrant red space nebula with distant celestial object",
  "rMsuksZ1NOU": "Abstract green and gold textured organic cavern render",
  "KDb0pJ12TEA": "Detailed view of Orion Nebula and starry night sky",
  "K5ssZwV5yc0": "Macro shot of soap bubble reflecting blue icy planet patterns",
  "FpWirml1T8M": "Macro soap bubble with swirling blue and yellow colors",
  "37y37C7fZlc": "Starry night sky over silhouette of pine trees"
};

async function updateDatabase() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB...');
  
  const wps = await Wallpaper.find({ title: { $regex: /Scenic 4K|Space 4K|Architecture City 4K|Animal Beauty 4K|Luxury Scenic 4K/ } });
  console.log(`Updating ${wps.length} wallpapers...`);
  
  let updatedCount = 0;
  for (const wp of wps) {
    const unsplashId = wp.tags[wp.tags.length - 1];
    const newTitle = titleMapping[unsplashId];
    
    if (newTitle && newTitle !== "Image not found") {
      const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + unsplashId.toLowerCase();
      
      wp.title = newTitle;
      wp.slug = slug;
      await wp.save();
      updatedCount++;
      console.log(`✅ Updated: ${unsplashId} -> ${newTitle}`);
    } else {
      console.log(`⚠️ No mapping for ${unsplashId} (${wp.title})`);
    }
  }
  
  console.log(`Done. Updated ${updatedCount} items.`);
  process.exit(0);
}

updateDatabase();
