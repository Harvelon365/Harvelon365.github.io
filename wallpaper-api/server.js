process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

import { fileURLToPath } from 'url';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
const app = express();
import { DateTime } from 'luxon';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createClient } from "webdav";
import ical from "node-ical";
const client = createClient(
    "https://86.17.240.174/radicale/crisp/93d70908-29e5-67ef-6ed4-7be2e8e82544/",
    {
        username: "crisp",
        password: "ilovechippies"
    }
)

import {Jimp, loadFont} from "jimp";
const font = await loadFont("dialog.fnt");

let cachedWallpaper = null;
let currentOutput = 0;
let lastRequestTime = Date.now();

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


async function fetchEvents() {
    try {
        let eventsToReturn = [];
        const files = await getAllFilesRecursive("/");

        for (const file of files) {
            if (file.type === "file") {
                const icsData = await client.getFileContents(file.filename, {format:"text"});

                try {
                    const parsed = ical.parseICS(icsData);

                    for (const k in parsed) {
                        const entry = parsed[k];

                        if (entry.type === "VEVENT") {
                            // console.log({
                            //     summary: entry.summary,
                            //     start: entry.start,
                            //     end: entry.end
                            // });
                            eventsToReturn.push(entry);
                        }
                    }
                } catch (parseErr) {
                    console.warn(`Skipping non-ICS file: ${file.filename}`);
                }
            }
        }

        //new Date(2024, 11, 1)
        eventsToReturn = eventsToReturn.filter(event => event.end > new Date());
        eventsToReturn = eventsToReturn.sort((a, b) => a.start - b.start);
        return eventsToReturn.slice(0, 5);
    } catch (err) {
        console.error("Error fetching events: " + err);
    }
}

async function getAllFilesRecursive(path = "/") {
    const results = [];

    const items = await client.getDirectoryContents(path);
    for (const item of items) {
        if (item.type === "directory") {
            const subItems = await getAllFilesRecursive(item.filename);
            results.push(...subItems);
        } else if (item.type === "file") {
            results.push(item);
        }
    }

    return results;
}

function FormatDateTime(dateString) {
    let date;
    const zone = 'Europe/London';

    if (dateString instanceof Date) date = DateTime.fromJSDate(dateString, { zone: 'utc' }).setZone(zone);
    else if (typeof dateString === 'string'){
        date = DateTime.fromISO(dateString, {zone:'utc'}).setZone(zone);
        if (!date.isValid) date = DateTime.fromJSDate(new Date(dateString), {zone: 'utc'}).setZone(zone);
    }
    else date = DateTime.fromJSDate(new Date(dateString), { zone: 'utc'}).setZone(zone);

    if (!date.isValid) {
        console.warn('Invalid date detected:', dateString);
        return 'Invalid date: ';
    }

    const now = DateTime.now().setZone(zone);
    const today = now.startOf('day');
    const tomorrow = today.plus({ days: 1 });
    const nextWeek = today.plus({ days: 6 });
    const dateOnly = date.startOf('day');

    let dayLabel;
    if (dateOnly.equals(today)) dayLabel = "Today";
    else if (dateOnly.equals(tomorrow)) dayLabel = "Tomorrow";
    else if (dateOnly <= nextWeek) dayLabel = date.toFormat('ccc');
    else dayLabel = date.toFormat('dd/MM');

    const time = date.toFormat('HH:mm');

    if (now > date && !dateString.dateOnly) return "Now: ";
    return dateString.dateOnly ? `${dayLabel}: ` : `${dayLabel} - ${time}: `;
}

function lastSunday(month, year){
    const d = new Date();
    const lastDayOfMonth = new Date(Date.UTC(year || d.getFullYear(), month+1, 0));
    const day = lastDayOfMonth.getDay();
    return new Date(Date.UTC(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth(), lastDayOfMonth.getDate() - day));
}

function isBST(date){
    const d = date || new Date();
    const starts = lastSunday(2, d.getFullYear());
    starts.setHours(1);
    const ends = lastSunday(9, d.getFullYear());
    ends.setHours(1);
    return d.getTime() >= starts.getTime() && d.getTime() < ends.getTime();
}

app.get('/wallpapers', async (req, res) => {
    if (!cachedWallpaper) return res.status(503).json({ error: "Wallpaper not ready yet" });
    lastRequestTime = Date.now();
    res.json(cachedWallpaper);
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

function loadWallpapers() {
    wallpapers = [];
    availableWallpapers = [];

    if (!fs.existsSync(wallpapersDir)) {
        console.error('Wallpapers directory does not exist!');
    }

    const files = fs.readdirSync(wallpapersDir).filter(file => (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.JPG') || file.endsWith('.png') || file.endsWith('.PNG')) && !file.includes("output"));

    for (const f of files) {
        console.log(`Found wallpaper: ${f}`);
    }

    wallpapers = files.map(file => ({
        url: 'https://harveytucker.com/walls/' + file,
        title: path.parse(file).name
    }));

    console.log(`Loaded ${wallpapers.length} wallpapers`);
}

async function GenerateWallpaper(){
    if (availableWallpapers.length === 0) {
        for (let i = 0; i < wallpapers.length; i++)
        {
            availableWallpapers.push(i);
        }
    }
    const randomIndex = Math.floor(Math.random() * availableWallpapers.length);
    const wallpaperIndex = availableWallpapers[randomIndex];
    availableWallpapers.splice(randomIndex, 1);

    console.log("Processing wallpaper " + wallpapers[wallpaperIndex].url.replace('https://harveytucker.com', '..'));
    const sourceBuffer = await fs.readFileSync(wallpapers[wallpaperIndex].url.replace('https://harveytucker.com', '..'));
    const randomWallpaper = await Jimp.fromBuffer(sourceBuffer, { 'image/jpeg': { maxMemoryUsageInMB: 1500 } });

    const scale = Math.max(1920 / randomWallpaper.bitmap.width, 1080 / randomWallpaper.bitmap.height);
    const newWidth = Math.ceil(randomWallpaper.bitmap.width * scale);
    const newHeight = Math.ceil(randomWallpaper.bitmap.height * scale);
    randomWallpaper.resize({ w: newWidth, h: newHeight });

    const x = Math.floor((newWidth - 1920) / 2);
    const y = Math.floor((newHeight - 1080) / 2);
    randomWallpaper.crop({ x: x, y: y, w: 1920, h: 1080})

    if (!wallpapers[wallpaperIndex].url.includes("Want-more-wallpapers"))
    {
        let text = "Upcoming events:\n";

        try {
            const nextEvents = await fetchEvents();
            if (nextEvents.length === 0) {
                text = "No upcoming events!";
            } else {
                for (const event of nextEvents) {
                    const when = FormatDateTime(event.start);
                    text += when + event.summary + "\n";
                }
            }
        } catch (err) {
            console.error("Error fetching events: " + err);
        }

        randomWallpaper.print({font, x: 10, y: 10, text: text});
    }

    let fileName = 'output' + currentOutput + '.jpg';
    let filePath = path.join(wallpapersDir, fileName);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('error removing file ' + fileName + ' ' + err);
        }
        else {
            console.log('successfully removed file');
        }
    })

    currentOutput++;

    fileName = 'output' + currentOutput + '.jpg';
    filePath = path.join(wallpapersDir, fileName);

    await randomWallpaper.write(filePath);

    const outputWallpaper = {
        url: 'https://harveytucker.com/walls/' + fileName,
        title: wallpapers[randomIndex].title
    }
    console.log(outputWallpaper);

    return outputWallpaper
}

async function start() {
  loadWallpapers();

  setInterval(async () => {
      try {
          const sinceLastRequest = Date.now() - lastRequestTime;
          if (sinceLastRequest > (15 * 60 * 1000)) {
              console.log("Pausing generation - last request: " + sinceLastRequest + "ms ago");
              return;
          }
          cachedWallpaper = await GenerateWallpaper();
          console.log("Wallpaper cached");
      } catch (e) {
          console.error(e);
      }
  }, 60_000);

  app.listen(3002, '0.0.0.0', () => {
    console.log('Wallpaper API is running on http://localhost:3002/api/wallpapers');
  });
}

start();
