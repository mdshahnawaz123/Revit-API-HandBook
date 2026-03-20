import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Hero from '../components/Hero';
import booksData from '../data/booksData.json';

const BookDetail = () => {
  const { id } = useParams();
  const book = booksData.find(b => b.id === parseInt(id));

  useEffect(() => {
    // Re-bind copy buttons after content render
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
      btn.onclick = () => {
        const pre = btn.closest('.code-block').querySelector('pre');
        if (pre) {
          navigator.clipboard.writeText(pre.innerText).then(() => {
            const originalText = btn.textContent;
            btn.textContent = 'copied!';
            setTimeout(() => btn.textContent = originalText, 1800);
          });
        }
      };
    });

    // Challenge Book Interactive Logic Injection
    if (book && (book.id === 7 || book.id === 8)) {
      const isB8 = book.id === 8;
      const cardClass = isB8 ? '.cc' : '.ccard';
      const filterAttr = isB8 ? 'data-d' : 'data-diff';
      const fbtnClass = isB8 ? '.fbtn' : '.filter-btn';
      const activeClass = isB8 ? 'on' : 'active';
      const idPrefix = isB8 ? 'rv8_' : 'rv7_';
      
      const searchBoxId = isB8 ? 'sq' : 'search';
      const ids = isB8 ? { dc: 'dc', pf: 'pf', pt: 'pt' } : { dc: 'done-count', pf: 'prog-fill', pt: 'prog-text' };

      const key = (c) => idPrefix + (c.querySelector('.cnum')?.textContent.trim() || '');

      const refresh = () => {
        const total = document.querySelectorAll(cardClass).length;
        const done = document.querySelectorAll(`${cardClass}.done`).length;
        const dc = document.getElementById(ids.dc);
        const pf = document.getElementById(ids.pf);
        const pt = document.getElementById(ids.pt);
        if (dc) dc.textContent = done;
        if (pf) pf.style.width = total > 0 ? (done / total * 100) + '%' : '0%';
        if (pt) pt.textContent = done + ' / ' + total;
      };

      // Initialize loaded states from LocalStorage
      document.querySelectorAll(cardClass).forEach(c => {
        if (localStorage.getItem(key(c)) === '1') {
          c.classList.add('done');
          const btn = c.querySelector('.done-btn');
          if (btn) btn.textContent = '✓ Completed';
        }
      });
      
      // Delay initial refresh slightly to ensure DOM is fully painted
      setTimeout(refresh, 100);

      const handleToggle = (btn) => {
        const c = btn.closest(cardClass);
        if (!c) return;
        const k = key(c);
        if (c.classList.contains('done')) {
          c.classList.remove('done');
          btn.textContent = 'Mark Complete';
          localStorage.removeItem(k);
        } else {
          c.classList.add('done');
          btn.textContent = '✓ Completed';
          localStorage.setItem(k, '1');
        }
        refresh();
      };

      // Expose to both function names globally
      window.tog = handleToggle;
      window.toggleDone = handleToggle;

      let currentFilter = 'all';
      const applyFilters = (q) => {
        const sq = document.getElementById(searchBoxId);
        const query = (typeof q === 'string' ? q : (sq ? sq.value : '')).toLowerCase();
        document.querySelectorAll(cardClass).forEach(c => {
          const dm = currentFilter === 'all' || (currentFilter === 'done' && c.classList.contains('done')) || (c.getAttribute(filterAttr) === currentFilter);
          const sm = !query || c.textContent.toLowerCase().includes(query);
          if (dm && sm) {
            c.classList.remove('hidden');
          } else {
            c.classList.add('hidden');
          }
        });
      };

      const handleFilter = (d, btn) => {
        currentFilter = d;
        document.querySelectorAll(fbtnClass).forEach(b => b.classList.remove(activeClass));
        if (btn) btn.classList.add(activeClass);
        applyFilters();
      };

      // Expose both filter functions globally
      window.filt = handleFilter;
      window.filterDiff = handleFilter;

      // Expose both search functions globally
      window.search = (q) => applyFilters(q);
      window.doSearch = (q) => applyFilters(q);
      
      window.goTo = (targetId) => {
         document.getElementById(targetId)?.scrollIntoView({behavior:'smooth',block:'start'});
      };
    }
    
    // Smooth scroll from sidebar might need re-binding or handling via Sidebar component
    window.scrollTo(0, 0);
    
    return () => {
      // Cleanup global binds when unmounting
      delete window.tog;
      delete window.toggleDone;
      delete window.filt;
      delete window.filterDiff;
      delete window.search;
      delete window.doSearch;
      delete window.goTo;
    };
  }, [id, book]);

  if (!book) return <div style={{ padding: '60px' }}>Book not found</div>;

  const { content } = book;

  return (
    <>
      {content.hero && (
        <Hero 
          label={content.hero.label}
          title={content.hero.title}
          description={content.hero.description}
          chips={content.hero.chips}
        />
      )}

      <div className="book-content">
        {content.sections.map(section => {
          const isChallenge = section.content.includes('class="chapter"');
          const isClassBlock = section.content.includes('class="class-block"');
          const isChallengeControl = section.content.includes('class="challenge-controls"');
          
          if (isChallenge || isClassBlock || isChallengeControl) {
            return (
              <div key={section.id} id={section.id} dangerouslySetInnerHTML={{ __html: section.content }} />
            );
          }

          return (
            <div key={section.id} className="section" id={section.id}>
              <div className="sec-num">{section.num || ''}</div>
              <h2>{section.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BookDetail;
