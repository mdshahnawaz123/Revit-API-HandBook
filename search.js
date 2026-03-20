// Global Search Logic for Revit API Handbook

let searchIndex = [];

// Load search index
if (typeof searchData !== 'undefined') {
    searchIndex = searchData;
}

function globalSearch(query) {
    const resultsDiv = document.getElementById('searchresults');
    if (!resultsDiv) return;

    if (!query || query.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }

    const q = query.toLowerCase();
    const results = searchIndex.filter(item => 
        item.name.toLowerCase().includes(q) || 
        (item.type && item.type.toLowerCase().includes(q)) ||
        (item.book && item.book.toLowerCase().includes(q))
    ).slice(0, 20);

    if (results.length === 0) {
        resultsDiv.innerHTML = '<div style="padding:15px;color:var(--text3);font-size:12px;">No results found for "' + query + '"</div>';
    } else {
        resultsDiv.innerHTML = results.map(item => `
            <a href="${item.path}" class="search-item">
                <div class="search-item-header">
                    <span class="search-item-name">${item.name}</span>
                    <span class="search-item-type">${item.type || 'Topic'}</span>
                </div>
                <div class="search-item-meta">Book ${item.bookNum}: ${item.book}</div>
            </a>
        `).join('');
    }
    
    // Add the class for styling if not already present
    resultsDiv.className = 'search-results-container';
    resultsDiv.style.display = 'block';
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    const searchInput = document.getElementById('globalsearch');
    const resultsDiv = document.getElementById('searchresults');
    if (searchInput && resultsDiv && !searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
        resultsDiv.style.display = 'none';
    }
});

// Sidebar search override
function sbSearch(q) {
    const lq = q.toLowerCase();
    document.querySelectorAll('.class-block,.path-card,.project-card,.ns-block').forEach(b=>{
        b.style.display=(!q || b.textContent.toLowerCase().includes(lq)) ? '' : 'none';
    });
}
