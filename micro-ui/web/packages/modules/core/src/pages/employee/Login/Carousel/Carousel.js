import React, { useState, useEffect, Fragment } from 'react';
import { loginConfig } from '../config';
import { useTranslation } from "react-i18next";

const Carousel = ({bannerImages=[]}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { t } = useTranslation();

    // Build the slide list fresh on every render, so any change to the banner config
    // (a new image URL, a different order, new text) shows up straight away.
    // We copy the array before sorting because `bannerImages` is the MDMS response held
    // in the react-query cache, and sort() would reorder that shared array in place.
    const source = Array.isArray(bannerImages) ? bannerImages : (loginConfig[0]?.bannerImages || []);
    const carouselItems = [...source].sort((x, y) => x?.id - y?.id);

    // A simple text summary of the current banners, like "1:a.png|2:b.png".
    // The effect below uses this instead of the array itself: the array is a brand new
    // object on every render, so using it directly would restart the effect forever.
    // This string only changes when the banners actually change.
    const bannerKey = carouselItems.map((item) => `${item?.id}:${item?.image}`).join("|");

    // Which slides are allowed to show their background image yet.
    //
    // The old version gave every slide a background image immediately, so the browser
    // downloaded all six banners at the same time. They are large (about 66 MB together
    // on demo), and the first slide - the one Lighthouse measures for LCP - had to share
    // the connection with five images nobody sees for at least another five seconds.
    //
    // Now the first slide loads on its own, and the rest are fetched one after another
    // in the background, so each one is ready before the carousel rotates to it.
    const [loadedSlides, setLoadedSlides] = useState(() => new Set([0]));

    // Download the banners one at a time, in order.
    // We start at slide 0 even though it is already downloading: asking for the same URL
    // just waits for that same download to finish, which is exactly the signal we want
    // before starting the next one.
    useEffect(() => {
        setCurrentSlide(0);
        setLoadedSlides(new Set([0]));

        if (carouselItems.length === 0) return undefined;

        let cancelled = false;
        let position = 0;

        const loadNext = () => {
            if (cancelled || position >= carouselItems.length) return;
            const index = position++;
            const url = carouselItems[index]?.image;

            // Skip entries with no image rather than stopping here.
            if (!url) {
                loadNext();
                return;
            }

            const image = new Image();
            const onFinished = () => {
                if (cancelled) return;
                setLoadedSlides((previous) => (previous.has(index) ? previous : new Set(previous).add(index)));
                loadNext();
            };
            image.onload = onFinished;
            // Also continue on failure, so one broken URL does not block the rest.
            image.onerror = onFinished;
            image.src = url;
        };

        loadNext();

        // Stop loading if the user leaves the page before it finishes.
        return () => {
            cancelled = true;
        };
    }, [bannerKey]);

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
                {carouselItems.map((item, index) => {
                    // The slide being shown always gets its image, even if the background
                    // loading has not reached it yet. In that case the browser just fetches it
                    // now - which is what the old code did for every slide anyway, so this can
                    // never end up slower than before.
                    const showImage = loadedSlides.has(index) || index === currentSlide;
                    return (
                        <div
                            key={item.id}
                            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                            style={showImage ? { backgroundImage: `url(${item.image})` } : undefined}
                        >
                            <div className="carousel-content">
                                <h2>{t(item.title)}</h2>
                                <p>{t(item.description)}</p>
                            </div>
                        </div>
                    );
                })}

                {/* Combined Navigation and Indicators (Bottom Center) */}
                <div className="carousel-controls">
                    {/* aria-label gives screen readers something to announce. The buttons show
                        only "<", ">" or nothing at all, which Lighthouse reports as
                        "Buttons do not have an accessible name". Nothing visible changes. */}
                    <button className="carousel-nav" onClick={prevSlide} aria-label={t("CORE_CAROUSEL_PREVIOUS")}>
                        &lt;
                    </button>

                    <div className="carousel-indicators">
                        {carouselItems.map((item, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={item?.title ? t(item.title) : `${t("CORE_CAROUSEL_SLIDE")} ${index + 1}`}
                                aria-current={index === currentSlide}
                            />
                        ))}
                    </div>

                    <button className="carousel-nav" onClick={nextSlide} aria-label={t("CORE_CAROUSEL_NEXT")}>
                        &gt;
                    </button>
                </div>
            </div>
        </Fragment>
    );
};

export default Carousel;