import fs from 'fs';
const data = JSON.parse(fs.readFileSync('src/data/booksData.json', 'utf8'));
const b7 = data.find(b => b.id === 7);
const controls = b7.content.sections.find(s => s.id === 'controls-7');
fs.writeFileSync('b7-controls.html', controls.content);
