import React from "react";
import PropTypes from "prop-types";

const ImageComponent = ({
  src,
  alt = "Image not found",
  decorative = false,
  ariaLabel = "No Image description set",
  ariaLabelledby = "no-image-description",
  ...props
}) => {
  // Determine the appropriate attributes based on the props
  const accessibilityProps = {};

  if (decorative) {
    // For decorative images
    accessibilityProps.alt = "";
  } else if (alt) {
    // Provide meaningful alt text if available
    accessibilityProps.alt = alt;
  } else if (ariaLabel) {
    // Use aria-label if alt is not provided
    accessibilityProps["aria-label"] = ariaLabel;
  } else if (ariaLabelledby) {
    // Use aria-labelledby for descriptive associations
    accessibilityProps["aria-labelledby"] = ariaLabelledby;
  } else {
    console.warn("AccessibleImage: Missing alt, aria-label, or aria-labelledby for non-decorative image.");
  }

  return <img src={src} {...accessibilityProps} {...props} />;
};

ImageComponent.propTypes = {
  src: PropTypes.string.isRequired, // The source URL for the image
  alt: PropTypes.string, // Alternative text for the image
  decorative: PropTypes.bool, // If true, image is decorative
  ariaLabel: PropTypes.string, // Custom label for screen readers
  ariaLabelledby: PropTypes.string, // Association with another descriptive element
};

export default ImageComponent;
