# WallGo | Premium Monochromatic Wallpapers

![WallGo Banner](E:\WallGo\server\scripts\Screenshot 2026-02-22 142930.png)

WallGo is a high-end, minimalist wallpaper destination designed for enthusiasts of monochromatic aesthetics. Built with **Next.js**, **Node.js**, **Express**, and **MongoDB**, it offers a seamless experience for discovering and downloading high-definition wallpapers tailored specifically for both PC and Mobile devices.

## ✨ Key Features

- **🖤 Monochromatic Perfection**: A strictly curated Black & White design language for a premium, distraction-free experience.
- **🖥️ Device-Specific Curation**: Separate sections for PC (16:9) and Phone (9:16) wallpapers with optimized aspect ratios.
- **🔍 Intelligent Search & Filter**: Quick category chips and real-time search to find the perfect artifact.
- **🖼️ Premium Lightbox**: Full-screen image previews to inspect details before downloading.
- **🛡️ Secure Restricted Admin**: A hidden, password-protected admin suite (`/login`) for content management.
- **🚀 Cloudinary Integration**: High-speed image hosting and automated transformations.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Custom Monochromatic Theme)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Server**: Node.js & Express
- **Database**: MongoDB (Atlas)
- **Storage**: Cloudinary (Cloud Management)
- **Auth**: Custom Token-based session management

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Cloudinary Account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/wallgo.git
cd wallgo
```

### 2. Setup Server
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run the server:
```bash
npm run dev
```

### 3. Setup Client
```bash
cd ../client
npm install
npm run dev
```

## 🔐 Admin Access
The admin panel is hidden for security. 
- **Route**: `/login`
- **Default Key**: `WallGo2026`

## 📄 License
This project is for personal use and showcase. All wallpapers are free for personal digital devices.

---
*Created with Passion for Minimalism.*
