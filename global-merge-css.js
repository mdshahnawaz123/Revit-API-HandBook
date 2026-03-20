import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexCssPath = path.join(__dirname, 'src', 'index.css');
const files = fs.readdirSync(__dirname).filter(f => f.startsWith('book') && f.endsWith('.html'));

let allStyles = '';

files.forEach(f => {
    const html = fs.readFileSync(f, 'utf8');
    const matches = html.matchAll(/<style>([\s\S]*?)<\/style>/g);
    for (const match of matches) {
        allStyles += `\n\n/* --- FROM ${f} --- */\n` + match[1];
    }
});

if (fs.existsSync(path.join(__dirname, 'api-style.css'))) {
    allStyles += `\n\n/* --- FROM api-style.css --- */\n` + fs.readFileSync('api-style.css', 'utf8');
}

let index = fs.readFileSync(indexCssPath, 'utf8');

// Update Fonts again just in case
index = index.replace(
    /@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=IBM\+Plex\+Mono:wght@400;600&family=Syne:wght@400;600;700;800&family=DM\+Sans:wght@300;400;500&display=swap'\);/, 
    "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500;600&family=Fraunces:wght@300;400;600;700;900&display=swap');"
);

// We need to avoid duplicating the huge chunk if we run this multiple times.
// For now, I'll just rewrite it cleanly.
// Separate the original index from the appended stuff if possible.
const marker = '/* --- APPENDED BOOK STYLES --- */';
const parts = index.split(marker);
const baseIndex = parts[0];

fs.writeFileSync(indexCssPath, baseIndex + '\n\n' + marker + allStyles);
console.log("Global CSS Merged!");
