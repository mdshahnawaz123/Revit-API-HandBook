import fs from 'fs';
import path from 'path';

const baseDir = 'c:\\Autodesk-APS\\RevitAPI HandBook';
const srcDataDir = path.join(baseDir, 'src', 'data');

const content = fs.readFileSync(path.join(baseDir, 'search-data.js'), 'utf-8');
const jsonContent = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
const searchData = JSON.parse(jsonContent);

const updatedSearchData = searchData.map(item => {
    const bookIdMatch = item.path.match(/book(\d+)/);
    const bookId = bookIdMatch ? parseInt(bookIdMatch[1]) : 1;
    
    // Extract hash if present (e.g. book1.html#section -> #section)
    const hashMatch = item.path.match(/#(.+)$/);
    const hash = hashMatch ? `#${hashMatch[1]}` : '';
    
    return {
        name: item.name || 'Untitled',
        type: item.type || 'Topic',
        book: item.book || 'Revit API Handbook',
        bookNum: item.bookNum || bookId.toString().padStart(2, '0'),
        route: `/book/${bookId}${hash}`
    };
});

fs.writeFileSync(
    path.join(srcDataDir, 'searchData.json'),
    JSON.stringify(updatedSearchData, null, 2),
    'utf-8'
);

console.log(`Search data extraction complete: ${updatedSearchData.length} items.`);
