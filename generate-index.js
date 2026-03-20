const fs = require('fs');
const path = require('path');

const booksDir = 'c:\\Autodesk-APS\\RevitAPI HandBook';
const searchDataFile = path.join(booksDir, 'search-data.js');

const searchData = [];

const files = fs.readdirSync(booksDir).filter(f => f.startsWith('book') && f.endsWith('.html'));

files.forEach(file => {
    const content = fs.readFileSync(path.join(booksDir, file), 'utf8');
    
    // Better Book Title Detection
    let bookNum = file.match(/book(\d+)/)?.[1] || "00";
    let bookTitle = "Unknown Book";
    
    const heroMatch = content.match(/\/\/ Book \d+ (?:of \d+ )?[—–] (.*?)(?:\·|$)/i);
    if (heroMatch) {
        bookTitle = heroMatch[1].trim();
    } else {
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        if (titleMatch) {
            bookTitle = titleMatch[1].replace('Revit API — ', '').split('·')[0].split('—')[0].trim();
        }
    }

    // Classes / Enums / Interfaces (using a more targeted approach)
    // Find all blocks and then extract info
    const blocks = content.split(/<div class="class-block"/);
    blocks.shift(); // First part is before any block
    
    blocks.forEach(block => {
        const idMatch = block.match(/id="(.*?)"/);
        const nameMatch = block.match(/<span class="class-name">(.*?)<\/span>/);
        const typeMatch = block.match(/ctb-(class|enum|interface)/);
        
        if (idMatch && nameMatch) {
            const id = idMatch[1].split('"')[0].trim(); // Ensure no extra attributes
            const name = nameMatch[1].replace(/—.*$/, '').trim();
            const typeRaw = typeMatch ? typeMatch[1] : 'class';
            const type = typeRaw.charAt(0).toUpperCase() + typeRaw.slice(1);
            
            searchData.push({
                name: name,
                type: type,
                book: bookTitle,
                bookNum: parseInt(bookNum).toString().padStart(2, '0'),
                path: `${file}#${id}`
            });
        }
    });

    // Books 1-8 often use <h3> and <h4> for topics
    if (parseInt(bookNum) <= 8 || parseInt(bookNum) >= 17) {
        const headerRegex = /<(h3|h4)(?: id="(.*?)")?>(.*?)<\/\1>/g;
        let hMatch;
        while ((hMatch = headerRegex.exec(content)) !== null) {
            const id = hMatch[2] || "";
            const name = hMatch[3].replace(/<.*?>/g, '').trim();
            if (name.length > 5 && !name.includes('Book') && !name.includes('Contents')) {
                searchData.push({
                    name: name,
                    type: 'Topic',
                    book: bookTitle,
                    bookNum: parseInt(bookNum).toString().padStart(2, '0'),
                    path: id ? `${file}#${id}` : file
                });
            }
        }
    }

    // Methods in all books
    const memberRegex = /<div class="member"(?: id="(.*?)")?>[\s\S]*?<span class="nm">(.*?)<\/span>/g;
    let mMatch;
    while ((mMatch = memberRegex.exec(content)) !== null) {
        const id = mMatch[1] || "";
        const name = mMatch[2].trim();
        if (name && name.length > 2 && !name.includes('<')) {
            searchData.push({
                name: name,
                type: 'Method / Property',
                book: bookTitle,
                bookNum: parseInt(bookNum).toString().padStart(2, '0'),
                path: id ? `${file}#${id}` : file
            });
        }
    }
});

// Remove duplicates
const seen = new Set();
const uniqueData = searchData.filter(item => {
    const key = `${item.name}-${item.bookNum}-${item.type}-${item.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
});

// Sort by book and then name
uniqueData.sort((a,b) => {
    if (a.bookNum !== b.bookNum) return a.bookNum.localeCompare(b.bookNum);
    return a.name.localeCompare(b.name);
});

fs.writeFileSync(searchDataFile, `const searchData = ${JSON.stringify(uniqueData, null, 2)};`);
console.log(`Generated search data with ${uniqueData.length} entries.`);
