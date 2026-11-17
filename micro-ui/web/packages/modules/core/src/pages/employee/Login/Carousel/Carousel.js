import React, { useState, useEffect, Fragment } from 'react';
import { loginConfig } from '../config';
import { useTranslation } from "react-i18next";

const Carousel = ({bannerImages=[]}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { t } = useTranslation();

    // Rebuilt every render so config changes show up straight away.
    // Sorted on a copy because bannerImages is the cached MDMS response, and sort()
    // would reorder that shared array in place.
    const source = Array.isArray(bannerImages) ? bannerImages : (loginConfig[0]?.bannerImages || []);
    const carouselItems = [...source].sort((x, y) => x?.id - y?.id);

    // Describes the current banners, e.g. "1:a.png|2:b.png". Used as the effect
    // dependency instead of the array, which is a new object on every render.
    const bannerKey = carouselItems.map((item) => `${item?.id}:${item?.image}`).join("|");

    // Which slides may show their image yet, and which banners that answer is for.
    //
    // Previously every slide got its background image at once, so the browser downloaded
    // all six banners together (~66 MB) and the first one - the LCP element - had to
    // share the connection with images nobody sees for another five seconds.
    //
    // The key is stored alongside the positions: when the banners are swapped, React
    // renders the new list before the effect can reset anything, and bare positions
    // would still read as "loaded" and request every new URL in that one render.
    const [preloaded, setPreloaded] = useState({ key: "", slides: new Set() });
    const isSameBanners = preloaded.key === bannerKey;

    // Download the banners one at a time, in order. Slide 0 is included even though it is
    // already downloading - requesting the same URL just waits for that download, which
    // is the signal we need before starting the next one.
    useEffect(() => {
        setCurrentSlide(0);
        setPreloaded({ key: bannerKey, slides: new Set([0]) });

        if (carouselItems.length === 0) return undefined;

        let cancelled = false;
        let position = 0;

        const loadNext = () => {
            if (cancelled || position >= carouselItems.length) return;
            const index = position++;
            const url = carouselItems[index]?.image;

            // Skip entries with no image rather than stopping.
            if (!url) {
                loadNext();
                return;
            }

            const image = new Image();
            const onFinished = () => {
                if (cancelled) return;
                // Ignore results that land after the banners were swapped.
                setPreloaded((previous) =>
                    previous.key === bannerKey && !previous.slides.has(index)
                        ? { key: bannerKey, slides: new Set(previous.slides).add(index) }
                        : previous
                );
                loadNext();
            };
            image.onload = onFinished;
            // Carry on after a failure so one broken URL cannot block the rest.
            image.onerror = onFinished;
            image.src = url;
        };

        loadNext();

        // Stop if the user leaves before loading finishes.
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
                    // The slide on screen always gets its image, even if preloading has not
                    // reached it - the browser then just fetches it now, which is what the old
                    // code did for every slide. Right after a banner change we show only the
                    // first slide, since the preloaded positions refer to the old images.
                    const showImage = isSameBanners
                        ? preloaded.slides.has(index) || index === currentSlide
                        : index === 0;
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
                    {/* These buttons show only "<", ">" or nothing at all, so screen readers
                        have no name to announce. aria-label fixes that and changes nothing
                        visually. */}
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