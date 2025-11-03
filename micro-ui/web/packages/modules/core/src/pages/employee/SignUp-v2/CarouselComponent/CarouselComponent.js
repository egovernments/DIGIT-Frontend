import React, { useState, useEffect } from "react";

const Carousel = ({ bannerImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
        setIsTransitioning(false);
      }, 200);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const goToPrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((i) => (i - 1 + bannerImages.length) % bannerImages.length);
      setIsTransitioning(false);
    }, 200);
  };

  const goToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % bannerImages.length);
      setIsTransitioning(false);
    }, 200);
  };

  const goToSlide = (index) => {
    if (index !== currentIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 200);
    }
  };

  if (!bannerImages || bannerImages.length === 0) {
    return <div>No images available</div>;
  }

  const { image, title, description } = bannerImages[currentIndex];

  return (
    <div className="carousel-container" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transition: 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out',
        opacity: isTransitioning ? 0.7 : 1,
        transform: isTransitioning ? 'scale(1.02)' : 'scale(1)'
      }}>
        <img
          className="carousel-img"
          src={image}
          alt={title}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            display: 'block',
            transition: 'filter 0.4s ease-in-out',
            filter: isTransitioning ? 'blur(1px)' : 'blur(0px)'
          }}
        />
      </div>

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
          zIndex: 2,
          transition: 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out',
          opacity: isTransitioning ? 0.6 : 1,
          transform: isTransitioning ? 'translateY(10px)' : 'translateY(0px)'
        }}
      >
        <h2 style={{
          margin: '0 0 1rem',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
          lineHeight: 1.2,
          transition: 'all 0.4s ease-in-out'
        }}>{title}</h2>
        <p style={{
          margin: 0,
          fontSize: '1.1rem',
          lineHeight: 1.6,
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          opacity: 0.95,
          transition: 'all 0.4s ease-in-out'
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
                border: index === currentIndex ? '1px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.3)',
                padding: 0,
                background: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: index === currentIndex ? 'scale(1.4)' : 'scale(1)',
                boxShadow: index === currentIndex ? '0 0 8px rgba(255, 255, 255, 0.5)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (index !== currentIndex) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                  e.target.style.transform = 'scale(1.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentIndex) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                  e.target.style.transform = 'scale(1)';
                }
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
