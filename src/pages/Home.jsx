import React from 'react';
import { Link } from 'react-router-dom';
import booksData from '../data/booksData.json';
import GlobalSearch from '../components/GlobalSearch';

const Home = () => {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 40px 80px' }}>
      <div style={{ marginBottom: '48px' }}>
        <div style={{ 
          fontFamily: "'IBM Plex Mono', monospace", 
          fontSize: '10px', 
          letterSpacing: '3px', 
          color: 'var(--accent)', 
          marginBottom: '12px', 
          textTransform: 'uppercase' 
        }}>
          // Revit API · C# · 2024+ · Complete Developer Guide
        </div>
        <h1 style={{ 
          fontFamily: "'Syne', sans-serif", 
          fontSize: '52px', 
          fontWeight: 800, 
          lineHeight: 1.05, 
          marginBottom: '16px', 
          color: 'var(--text)' 
        }}>
          Revit API<br/>Developer Handbook
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '600px', fontWeight: 300 }}>
          A complete reference from beginner to advanced. Every major API surface covered — from elements and parameters to events, modeless dialogs, DMU and MEP systems.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
          <span className="chip c-or">19 Books</span>
          <span className="chip c-bl">75+ Sections</span>
          <span className="chip c-gr">1200+ Challenges</span>
          <span className="chip c-ye">Complete Reference</span>
        </div>
      </div>

      <div style={{ marginBottom: '48px', maxWidth: '500px' }}>
        <GlobalSearch />
      </div>

      <div className="index-grid">
        {booksData.sort((a,b) => a.id - b.id).map(book => (
          <Link 
            key={book.id} 
            to={`/book/${book.id}`} 
            className="book-card" 
            style={{ 
              '--c1': book.style ? book.style.match(/rgba\(.*\)/)?.[0] || 'rgba(224,90,43,0.06)' : 'rgba(224,90,43,0.06)' 
            } }
          >
            <div className="book-num">{book.num}</div>
            <h3>{book.title}</h3>
            <p>{book.desc}</p>
            <div className="topic-list">
              {book.topics.map((topic, i) => (
                <span key={i} className="topic">{topic}</span>
              ))}
            </div>
            <span className="arrow">→</span>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '56px' }}>
        <div style={{ 
          fontFamily: "'IBM Plex Mono', monospace", 
          fontSize: '10px', 
          letterSpacing: '2px', 
          color: 'var(--accent)', 
          marginBottom: '16px' 
        }}>
          // QUICK REFERENCE
        </div>
        <div className="quickref">
          <div className="qr"><div className="qr-label">Get Document</div><code>commandData.Application.ActiveUIDocument.Document</code></div>
          <div className="qr"><div className="qr-label">Filter Walls</div><code>new FilteredElementCollector(doc).OfClass(typeof(Wall))</code></div>
          <div className="qr"><div className="qr-label">Transaction</div><code>using(var tx = new Transaction(doc, "name")) {"{ tx.Start(); ... tx.Commit(); }"}</code></div>
          <div className="qr"><div className="qr-label">Read Parameter</div><code>elem.get_Parameter(BuiltInParameter.ALL_MODEL_MARK).AsString()</code></div>
          <div className="qr"><div className="qr-label">Unit Convert</div><code>UnitUtils.ConvertToInternalUnits(3000, UnitTypeId.Millimeters)</code></div>
          <div className="qr"><div className="qr-label">External Event</div><code>ExternalEvent.Create(handler); event.Raise();</code></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
