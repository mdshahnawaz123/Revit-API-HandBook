const fs = require('fs');
const searchData = JSON.parse(fs.readFileSync('src/data/searchData.json', 'utf8'));

const testQuery = 'filterelement';
const q = testQuery.toLowerCase().replace(/\s+/g, '');
const pattern = q.split('').join('.*');
const regex = new RegExp(pattern);

const filtered = searchData.filter(item => {
  const name = item.name ? item.name.toLowerCase() : '';
  const type = item.type ? item.type.toLowerCase() : '';
  return name.includes(q) || type.includes(q) || regex.test(name) || regex.test(type);
}).sort((a, b) => {
  const aName = a.name.toLowerCase();
  const bName = b.name.toLowerCase();
  const aExact = aName.includes(q);
  const bExact = bName.includes(q);
  if (aExact && !bExact) return -1;
  if (!aExact && bExact) return 1;
  return aName.length - bName.length;
}).slice(0, 10);

console.log('Results for "filterelement":');
filtered.forEach(r => console.log(`- ${r.name} (${r.type})`));
