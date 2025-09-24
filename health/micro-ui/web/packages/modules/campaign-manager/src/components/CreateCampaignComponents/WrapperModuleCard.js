import { useEffect } from "react";

/**
 * EqualHeightWrapper
 *
 * Ensures that all elements with the given `className` (default: "module-card")
 * have the same height — specifically the height of the tallest one.
 *
 * This is useful in responsive grid layouts where some cards may have more content
 * than others (e.g., longer descriptions), and you want all cards to visually align.
 *
 * It works by:
 *  - Measuring all elements with the target class
 *  - Resetting their height to auto
 *  - Calculating the tallest one
 *  - Applying that height to all
 *
 * This wrapper also listens to `window.resize` to re-apply equal height on screen resize.
 *
 * @param {string} className - The CSS class to target for height equalization
 * @param {ReactNode} children - The wrapped content (usually a grid of cards)
 * @param {Array<any>} deps - Dependency array to control when to re-apply height logic
 */

const EqualHeightWrapper = ({ className = "module-card", children, deps = [] }) => {
  useEffect(() => {
    const handleResize = () => {
      const cards = document.querySelectorAll(`.${className}`);
      cards.forEach((card) => (card.style.height = "auto")); // reset
      let maxHeight = 0;
      cards.forEach((card) => {
        maxHeight = Math.max(maxHeight, card.offsetHeight);
      });
      cards.forEach((card) => (card.style.height = `${maxHeight}px`));
    };

    const timeout = setTimeout(handleResize, 50); // slight delay to ensure DOM is ready
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, deps); // depend on data

  return children;
};

export default EqualHeightWrapper;
