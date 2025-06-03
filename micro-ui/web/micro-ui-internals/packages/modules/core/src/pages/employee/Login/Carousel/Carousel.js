import React, { useState, useEffect } from 'react';
import './Carousel.css';
import { loginConfig } from '../config';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [acceptPolicy, setAcceptPolicy] = useState(false);

  // const carouselItems = [
  //   {
  //     id: 1,
  //     image: 'https://images.unsplash.com/photo-1746277121508-f44615ff09bb',
  //     title: 'A digital partner for frontline workers',
  //     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nobis temporibus provident expedita consequuntur, repudiandae pariatur! Deleniti molestias vero, cumque vel error labore ipsam totam?"
  //   },
  //   {
  //     id: 2,
  //     image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9',
  //     title: 'Feature 2 Title',
  //     description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem esse doloribus molestiae fugiat eos adipisci sequi cumque sit, laboriosam dolores blanditiis nobis assumenda quasi nemo consectetur. Officia nesciunt quibusdam molestiae."
  //   },
  //   {
  //     id: 3,
  //     image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9',
  //     title: 'Feature 3 Title',
  //     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate aut autem aperiam et modi saepe obcaecati doloremque voluptatem iusto quidem!"
  //   }
  // ];

  const carouselItems = loginConfig[0].bannerImages

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ username, password, city, acceptPolicy });
  };

  return (
    <>
    
      {/* Carousel Background (70% width) */}

  <div className="carousel-container">
        {carouselItems.map((item, index) => (
          <div 
            key={item.id}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="carousel-content">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
        
        {/* Combined Navigation and Indicators (Bottom Center) */}
        <div className="carousel-controls">
          <button className="carousel-nav" onClick={prevSlide}>
            &lt;
          </button>
          
          <div className="carousel-indicators">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
          
          <button className="carousel-nav" onClick={nextSlide}>
            &gt;
          </button>
        </div>
      </div>
    </>
  );
};

export default Carousel;