import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexCssPath = path.join(__dirname, 'src', 'index.css');
const apiStylePath = path.join(__dirname, 'api-style.css');
const challengeStylePath = path.join(__dirname, 'book7-style.css');

if (!fs.existsSync(apiStylePath)) {
    console.error("api-style.css not found!");
}
if (!fs.existsSync(challengeStylePath)) {
    console.error("book7-style.css not found!");
}

let index = fs.readFileSync(indexCssPath, 'utf8');
const api = fs.readFileSync(apiStylePath, 'utf8');
const challenge = fs.readFileSync(challengeStylePath, 'utf8');

// Update Fonts
index = index.replace(
    "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');", 
    "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500;600&family=Fraunces:wght@300;400;600;700;900&display=swap');"
);

// Append Challenge Styles as is
const finalCss = index + '\n\n/* --- CHALLENGE STYLES --- */\n' + challenge + '\n\n/* --- API REF STYLES --- */\n' + api;

fs.writeFileSync(indexCssPath, finalCss);
console.log("CSS Merged Successfully!");
