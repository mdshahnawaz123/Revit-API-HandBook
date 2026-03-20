import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import searchData from '../data/searchData.json';

const GlobalSearch = ({ placeholder = "Search for Class, Method or Topic..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const rawQ = query.toLowerCase();
    const q = rawQ.replace(/\s+/g, '');
    
    // Create a fuzzy regex pattern (e.g. 'abc' -> /a.*b.*c/)
    // This allows finding "FilteredElement" even if user types "filterelement"
    const pattern = q.split('').join('.*');
    let regex;
    try {
      regex = new RegExp(pattern);
    } catch (e) {
      regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    }

    const filtered = searchData.filter(item => {
      const name = item.name ? item.name.toLowerCase() : '';
      const type = item.type ? item.type.toLowerCase() : '';
      return name.includes(rawQ) || type.includes(rawQ) || regex.test(name) || regex.test(type);
    }).sort((a, b) => {
      const aName = a.name ? a.name.toLowerCase() : '';
      const bName = b.name ? b.name.toLowerCase() : '';
      
      const aExact = aName.includes(rawQ);
      const bExact = bName.includes(rawQ);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      return aName.length - bName.length;
    }).slice(0, 50);

    setResults(filtered);
    setIsOpen(true);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <input 
        type="text" 
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
        style={{
          width: '100%',
          padding: '12px 20px',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--text)',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '13px',
          outline: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}
      />
      
      {isOpen && results.length > 0 && (
        <div className="search-results-container">
          {results.map((item, idx) => (
            <Link 
              key={idx} 
              to={item.route} 
              className="search-item"
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
            >
              <div className="search-item-header">
                <div className="search-item-name">{item.name}</div>
                <div className="search-item-type">{item.type}</div>
              </div>
              <div className="search-item-meta">
                Book {item.bookNum} — {item.book}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
