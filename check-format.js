const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/booksData.json', 'utf8'));
const b7 = data.find(b => b.id === 7);
const b8 = data.find(b => b.id === 8);
console.log('B7 HERO:\n', b7.content.hero.substring(0, 300));
console.log('\n===================\n');
console.log('B8 HERO:\n', b8.content.hero.substring(0, 300));
