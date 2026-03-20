import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import booksData from '../data/booksData.json';

const Sidebar = () => {
  const { id } = useParams();
  const location = useLocation();
  const currentBook = booksData.find(b => b.id === parseInt(id));
  
  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sidebar">
      <div className="sb-logo">
        <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="sb-eyebrow">// Revit API</div>
            <div className="sb-title">Developer<br/>Handbook</div>
        </Link>
        <div className="sb-version">C# · 2024+ · Complete Guide</div>
      </div>
      
      <div className="sb-nav">
        {currentBook?.content?.sections && (
          <div className="sb-section">
            <div className="sb-sec-label">This Book</div>
            {currentBook.content.sections.map((sec, idx) => (
              <a 
                key={sec.id} 
                className="sb-link" 
                onClick={() => scrollToSection(sec.id)}
              >
                <span className="ni">{(idx + 1).toString().padStart(2, '0')}</span>
                <span style={{ 
                  display: 'inline-block', 
                  maxWidth: '180px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }}>
                  {sec.title}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="sb-files">
        <div className="sb-files-label">All Books</div>
        {booksData.sort((a,b) => a.id - b.id).map(book => (
          <Link 
            key={book.id} 
            to={`/book/${book.id}`} 
            className={`sb-file-link ${parseInt(id) === book.id ? 'current' : ''}`}
          >
            <span className="file-num">{book.id.toString().padStart(2, '0')}</span>
            {book.title}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
