import React, { useEffect, useRef, useState ,useLayoutEffect} from "react";
import PropTypes from "prop-types";

const LandingPageWrapper = ({ children, className, styles }) => {
  const wrapperRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(
    window.innerWidth / window.innerHeight <= 9 / 16
  );

  const onResize = () => {
    if (window.innerWidth / window.innerHeight <= 9 / 16) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
  };

  useLayoutEffect(() => {
    const updateCardDimensions = () => {
      const cards = Array.from(wrapperRef.current.children);
      if (isMobileView) {
        // In mobile view, set all cards to 100% width
        cards.forEach(card => {
          card.style.width = "100%";
          card.style.height = "auto"; // Adjust height accordingly
        });
      } else {
        let maxWidth = 0;
        let maxHeight = 0;

        // Calculating the maximum width and height
        cards.forEach(card => {
          const cardWidth = card.offsetWidth;
          const cardHeight = card.offsetHeight;
          if (cardWidth > maxWidth) {
            maxWidth = cardWidth;
          }
          if (cardHeight > maxHeight) {
            maxHeight = cardHeight;
          }
        });

        // Applying the maximum width and height for all cards
        cards.forEach(card => {
          card.style.width = `${maxWidth}px`;
          card.style.height = `${maxHeight}px`;
        });
      }
    };

    // Initial call to set card dimensions
    updateCardDimensions();

    // Set up resize and load listeners
    window.addEventListener("resize", onResize);
    window.addEventListener("resize", updateCardDimensions);
    window.addEventListener("load", updateCardDimensions);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", updateCardDimensions);
      window.removeEventListener("load", updateCardDimensions);
    };
  }, [isMobileView, children]);

  return (
    <div
      className={`digit-landing-page-wrapper ${className}`}
      style={styles}
      ref={wrapperRef}
    >
      {children}
    </div>
  );
};

LandingPageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  styles: PropTypes.object,
};

LandingPageWrapper.defaultProps = {
  className: "",
  styles: {},
};

export default LandingPageWrapper;
