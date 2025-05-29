const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let wallpapers = [];
let availableWallpapers = [];
const wallpapersDir = path.join(__dirname, '../walls');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../walls'); // Folder to store uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

app.get('/wallpapers', (req, res) => {
    if (availableWallpapers.length === 0) {
        for (let i = 0; i < wallpapers.length; i++)
        {
            availableWallpapers.push(i);
        }
    }
    let randomIndex = Math.floor(Math.random() * availableWallpapers.length);
    const randomWallpaper = wallpapers[randomIndex];
    availableWallpapers.splice(randomIndex, 1);
    res.json(randomWallpaper);
});



app.post('/wallpapers/upload', upload.single('image'), (req, res) => {
  console.log('NEW FILE:', req.file);
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    message: 'Upload successful',
    filename: req.file.filename
  });
  loadWallpapers();
});



app.listen(3001, () => {
    loadWallpapers();
    console.log('Wallpaper API is running on http://localhost:3001/api/wallpapers');
});

function loadWallpapers() {
    wallpapers = [];
    availableWallpapers = [];

    if (!fs.existsSync(wallpapersDir)) {
        console.error('Wallpapers directory does not exist!');
    }

    const files = fs.readdirSync(wallpapersDir).filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.JPG') || file.endsWith('.png') || file.endsWith('.PNG'));

    for (const f of files) {
        console.log(`Found wallpaper: ${f}`);
    }

    wallpapers = files.map(file => ({
        url: 'https://harveytucker.com/walls/' + file,
        title: path.parse(file).name
    }));

    console.log(`Loaded ${wallpapers.length} wallpapers`);
}