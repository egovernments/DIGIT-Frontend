import React from 'react';

// Navigation Icons
export const HomeIcon = ({ className, fill = "#0B4B66", width = "24", height = "24", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill={fill} />
  </svg>
);

export const LogoutIcon = ({ className, fill = "#0B4B66", width = "24", height = "24", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill={fill} />
  </svg>
);

export const AddressBookIcon = ({ className, fill = "#0B4B66", width = "24", height = "24", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill={fill} />
  </svg>
);

export const LocationIcon = ({ className, fill = "#0B4B66", width = "24", height = "24", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill={fill} />
  </svg>
);

export const LanguageIcon = ({ className, fill = "#0B4B66", width = "24", height = "24", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <path d="M11.99 2C6.47 2 2 6.48 2 12S6.47 22 11.99 22C17.52 22 22 17.52 22 12S17.52 2 11.99 2ZM18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.34 18.92 8ZM12 4.04C12.83 5.24 13.48 6.57 13.91 8H10.09C10.52 6.57 11.17 5.24 12 4.04ZM4.26 14C4.1 13.36 4 12.69 4 12S4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12S7.56 13.34 7.64 14H4.26ZM5.08 16H8.03C8.35 17.25 8.81 18.45 9.41 19.56C7.57 18.93 6.04 17.66 5.08 16ZM8.03 8H5.08C6.04 6.34 7.57 5.07 9.41 4.44C8.81 5.55 8.35 6.75 8.03 8ZM12 19.96C11.17 18.76 10.52 17.43 10.09 16H13.91C13.48 17.43 12.83 18.76 12 19.96ZM14.34 14H9.66C9.57 13.34 9.5 12.68 9.5 12S9.57 10.66 9.66 10H14.34C14.43 10.66 14.5 11.32 14.5 12S14.43 13.34 14.34 14ZM14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.96 17.66 16.43 18.93 14.59 19.56ZM16.36 14C16.44 13.34 16.5 12.68 16.5 12S16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12S19.9 13.36 19.74 14H16.36Z" fill={fill} />
  </svg>
);

export const ArrowForward = ({ className, fill = "#0B4B66", width = "24", height = "24", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill={fill} />
  </svg>
);

export const ArrowVectorDown = ({ className, fill = "#0B4B66", width = "24", height = "24", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <path d="M7.41 8.84L12 13.42L16.59 8.84L18 10.25L12 16.25L6 10.25L7.41 8.84Z" fill={fill} />
  </svg>
);

export const ArrowDirection = ({ className, fill = "#0B4B66", width = "24", height = "24", direction = "right", ...props }) => {
  const rotation = {
    right: "0",
    left: "180", 
    up: "270",
    down: "90"
  };
  
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className} 
         style={{ transform: `rotate(${rotation[direction]}deg)` }} {...props}>
      <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill={fill} />
    </svg>
  );
};

export const Hamburger = ({ className, fill = "#0B4B66", width = "24", height = "24", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill={fill} />
  </svg>
);