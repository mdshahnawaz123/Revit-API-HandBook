import React from 'react';
import GlobalSearch from './GlobalSearch';

const Hero = ({ label, title, description, chips }) => {
  return (
    <div className="hero">
      <div className="hero-label">{label}</div>
      <h1 dangerouslySetInnerHTML={{ __html: title }}></h1>
      <p>{description}</p>
      
      <div style={{ marginTop: '20px', maxWidth: '400px', position: 'relative', zIndex: 10 }}>
        <GlobalSearch placeholder="Search Class, Method or Topic..." />
      </div>
      
      <div className="hero-chips">
        {chips.map((chip, i) => (
          <span key={i} className={`chip c-${['or', 'bl', 'gr', 'ye', 'pu'][i % 5]}`} 
                dangerouslySetInnerHTML={{ __html: chip }}></span>
        ))}
      </div>
    </div>
  );
};

export default Hero;
