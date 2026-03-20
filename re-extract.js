import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const baseDir = 'c:\\Autodesk-APS\\RevitAPI HandBook';
const srcDataDir = path.join(baseDir, 'src', 'data');
if (!fs.existsSync(srcDataDir)) fs.mkdirSync(srcDataDir, { recursive: true });

const books = [];

// Helper to extract content based on structure
function extractBookContent(dom, bookId) {
    const doc = dom.window.document;
    const main = doc.querySelector('.main') || doc.querySelector('.content') || doc.body;
    
    let sections = [];
    
    // Pattern 1: Standard .section
    const standardSections = Array.from(doc.querySelectorAll('.section'));
    if (standardSections.length > 0) {
        sections = standardSections.map(s => ({
            id: s.id || `sec-${Math.random().toString(36).substr(2, 9)}`,
            title: s.querySelector('h2')?.textContent || 'Untitled',
            content: s.innerHTML
        }));
    } 
    // Pattern 2: Challenges (.chapter)
    else if (doc.querySelectorAll('.chapter').length > 0) {
        // Collect pre-chapter controls: stats, progress, filters
        let controlsHtml = '';
        ['.stats-bar', '.progress-wrap', '.filter-bar', '.stats-row', '.prog-row'].forEach(selector => {
            const el = doc.querySelector(selector);
            if (el) controlsHtml += el.outerHTML;
        });

        if (controlsHtml) {
            sections.push({
                id: `controls-${bookId}`,
                title: 'Controls',
                content: `<div class="challenge-controls">${controlsHtml}</div>`
            });
        }

        const chapters = Array.from(doc.querySelectorAll('.chapter'));
        sections = sections.concat(chapters.map(c => {
            const nextGrid = c.nextElementSibling;
            let content = c.outerHTML;
            if (nextGrid && (nextGrid.classList.contains('challenge-grid') || nextGrid.classList.contains('grid'))) {
                content += nextGrid.outerHTML;
            }
            return {
                id: c.id || `ch-${Math.random().toString(36).substr(2, 9)}`,
                title: c.querySelector('h2')?.textContent || 'Chapter',
                content: content
            };
        }));
    }
    // Pattern 3: API Reference (.class-block)
    else if (doc.querySelectorAll('.class-block').length > 0) {
        const classes = Array.from(doc.querySelectorAll('.class-block'));
        sections = classes.map(cls => ({
            id: cls.id || `cls-${Math.random().toString(36).substr(2, 9)}`,
            title: cls.querySelector('.class-name')?.textContent || 'Class',
            content: cls.outerHTML
        }));
    }
    // Fallback: Just take the main content
    else {
        sections = [{
            id: 'content',
            title: 'Content',
            content: main.innerHTML
        }];
    }

    // Hero Data
    const hero = doc.querySelector('.hero');
    const heroData = hero ? {
        label: hero.querySelector('.hero-label')?.innerHTML || '',
        title: hero.querySelector('h1')?.innerHTML || '',
        description: hero.querySelector('p')?.innerHTML || '',
        chips: Array.from(hero.querySelectorAll('.chip')).map(c => c.innerHTML)
    } : null;

    return { hero: heroData, sections };
}

// Get all book files
const files = fs.readdirSync(baseDir).filter(f => f.startsWith('book') && f.endsWith('.html'));

files.forEach(file => {
    const idMatch = file.match(/book(\d+)/);
    if (!idMatch) return;
    const id = parseInt(idMatch[1]);
    
    console.log(`Extracting ${file}...`);
    const html = fs.readFileSync(path.join(baseDir, file), 'utf-8');
    const dom = new JSDOM(html);
    const content = extractBookContent(dom, id);

    // Also need metadata from index.html (or just guess from file name)
    // For now, we'll just store the content and id
    books.push({
        id,
        file,
        title: dom.window.document.title.split('—')[1]?.trim() || file,
        content
    });
});

// We also need the metadata (desc, topics) from index.html to make it complete
const indexHtml = fs.readFileSync(path.join(baseDir, 'index-old.html'), 'utf-8');
const indexDom = new JSDOM(indexHtml);
const cards = Array.from(indexDom.window.document.querySelectorAll('.book-card'));

cards.forEach(card => {
    const href = card.getAttribute('href');
    const idMatch = href?.match(/book(\d+)/);
    if (!idMatch) return;
    const id = parseInt(idMatch[1]);
    
    const book = books.find(b => b.id === id);
    if (book) {
        book.num = card.querySelector('.book-num')?.textContent || '';
        book.title = card.querySelector('h3')?.textContent || book.title;
        book.desc = card.querySelector('p')?.textContent || '';
        book.topics = Array.from(card.querySelectorAll('.topic')).map(t => t.textContent);
        book.style = card.getAttribute('style');
    }
});

fs.writeFileSync(
    path.join(srcDataDir, 'booksData.json'),
    JSON.stringify(books, null, 2),
    'utf-8'
);

console.log("Extraction complete!");
