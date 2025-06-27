import React, { useState, useEffect } from "react";

const Carousel = ({ bannerImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const goToPrev = () => setCurrentIndex((i) => (i - 1 + bannerImages.length) % bannerImages.length);
  const goToNext = () => setCurrentIndex((i) => (i + 1) % bannerImages.length);
  const goToSlide = (index) => setCurrentIndex(index);

  if (!bannerImages || bannerImages.length === 0) {
    return <div>No images available</div>;
  }

  const { image, title, description } = bannerImages[currentIndex];

  return (
    <div className="carousel-container" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <img
        className="carousel-img"
        src={image}
        alt={title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* Dark gradient overlay */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: '60%',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Text overlay at bottom-left */}
      <div
        className="carousel-overlay"
        style={{
          position: 'absolute',
          bottom: '10rem',
          left: '2rem',
          maxWidth: '70%',
          color: '#fff',
          zIndex: 2
        }}
      >
        <h2 style={{
          margin: '0 0 1rem',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
          lineHeight: 1.2
        }}>{title}</h2>
        <p style={{
          margin: 0,
          fontSize: '1.1rem',
          lineHeight: 1.6,
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          opacity: 0.95
        }}>{description}</p>
      </div>

      {/* Arrows and Dots in one row */}
      <div
        style={{
          position: 'absolute',
          bottom: '3.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
          gap: '1rem'
        }}
      >
        {/* Left Arrow */}
        <button
          onClick={goToPrev}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ‹
        </button>

        {/* Dot indicators */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
        >
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: 'none',
                padding: 0,
                background: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: index === currentIndex ? 'scale(1.4)' : 'scale(1)'
              }}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Carousel;
