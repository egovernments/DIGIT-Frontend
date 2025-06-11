import React, { useState, useEffect, Fragment } from 'react';
import { loginConfig } from '../config';
import { useTranslation } from "react-i18next";

const Carousel = ({bannerImages=[]}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { t } = useTranslation();

    const carouselItems = bannerImages|| loginConfig[0]?.bannerImages || [];

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
    }, [carouselItems.length]);

    return (
        <Fragment>

            {/* Carousel Background (70% width) */}

            <div className="carousel-container">
                {carouselItems.sort((x,y)=>x?.id-y?.id).map((item, index) => (
                    <div
                        key={item.id}
                        className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${item.image})` }}
                    >
                        <div className="carousel-content">
                            <h2>{t(item.title)}</h2>
                            <p>{t(item.description)}</p>
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
        </Fragment>
    );
};

export default Carousel;