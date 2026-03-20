import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const baseDir = 'c:\\Autodesk-APS\\RevitAPI HandBook';
const srcDataDir = path.join(baseDir, 'src', 'data');

if (!fs.existsSync(srcDataDir)) {
    fs.mkdirSync(srcDataDir, { recursive: true });
}

function extractIndexData() {
    const html = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf-8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const books = [];
    document.querySelectorAll('.book-card').forEach(card => {
        const href = card.getAttribute('href');
        const num = card.querySelector('.book-num').textContent.trim();
        const title = card.querySelector('h3').textContent.trim();
        const desc = card.querySelector('p').textContent.trim();
        const topics = Array.from(card.querySelectorAll('.topic')).map(t => t.textContent.trim());
        const style = card.getAttribute('style') || "";
        const bookIdMatch = href.match(/book(\d+)/);
        const bookId = bookIdMatch ? parseInt(bookIdMatch[1]) : 0;
        
        books.push({
            id: bookId,
            href,
            num,
            title,
            desc,
            topics,
            style
        });
    });
    return books;
}

function extractBookContent(fileName) {
    const fullPath = path.join(baseDir, fileName);
    if (!fs.existsSync(fullPath)) {
        console.warn(`Warning: ${fileName} not found`);
        return null;
    }
    
    const html = fs.readFileSync(fullPath, 'utf-8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const hero = document.querySelector('.hero');
    const hero_label = hero?.querySelector('.hero-label')?.textContent.trim() || "";
    const hero_title = hero?.querySelector('h1')?.innerHTML.trim() || "";
    const hero_desc = hero?.querySelector('p')?.textContent.trim() || "";
    const hero_chips = Array.from(hero?.querySelectorAll('.chip') || []).map(c => c.innerHTML.trim());
    
    const sections = [];
    document.querySelectorAll('.section').forEach(sec => {
        const sec_id = sec.getAttribute('id');
        const sec_num = sec.querySelector('.sec-num')?.textContent.trim() || "";
        const sec_title = sec.querySelector('h2')?.textContent.trim() || "";
        
        // Clone and decompose num/title for content retrieval
        const secClone = sec.cloneNode(true);
        const numEl = secClone.querySelector('.sec-num');
        const titleEl = secClone.querySelector('h2');
        if (numEl) numEl.remove();
        if (titleEl) titleEl.remove();
        
        const content_html = secClone.innerHTML.trim();
        sections.push({
            id: sec_id,
            num: sec_num,
            title: sec_title,
            content: content_html
        });
    });
    
    return {
        hero_label,
        hero_title,
        hero_desc,
        hero_chips,
        sections
    };
}

const booksMetadata = extractIndexData();
booksMetadata.forEach(book => {
    console.log(`Extracting ${book.href}...`);
    book.content = extractBookContent(book.href);
});

fs.writeFileSync(
    path.join(srcDataDir, 'booksData.json'),
    JSON.stringify(booksMetadata, null, 2),
    'utf-8'
);

console.log("Extraction complete. Data saved to src/data/booksData.json");
