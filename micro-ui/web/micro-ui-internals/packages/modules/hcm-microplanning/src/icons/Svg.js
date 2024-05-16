import React from "react";

export const PopulationSvg = (style) => {
  return `
        <svg width="50" height="50" viewBox="0 0 18 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 0C4.03714 0 0 4.082 0 9.1C0 15.925 9 26 9 26C9 26 18 15.925 18 9.1C18 4.082 13.9629 0 9 0Z" fill="${
          style?.fill || "rgba(176, 176, 176, 1)"
        }"/>
        <g clip-path="url(#clip0_6283_43793)">
        <path d="M11 8.5C11.83 8.5 12.495 7.83 12.495 7C12.495 6.17 11.83 5.5 11 5.5C10.17 5.5 9.5 6.17 9.5 7C9.5 7.83 10.17 8.5 11 8.5ZM7 8.5C7.83 8.5 8.495 7.83 8.495 7C8.495 6.17 7.83 5.5 7 5.5C6.17 5.5 5.5 6.17 5.5 7C5.5 7.83 6.17 8.5 7 8.5ZM7 9.5C5.835 9.5 3.5 10.085 3.5 11.25V12.5H10.5V11.25C10.5 10.085 8.165 9.5 7 9.5ZM11 9.5C10.855 9.5 10.69 9.51 10.515 9.525C11.095 9.945 11.5 10.51 11.5 11.25V12.5H14.5V11.25C14.5 10.085 12.165 9.5 11 9.5Z" fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0_6283_43793">
        <rect width="12" height="12" fill="white" transform="translate(3 3)"/>
        </clipPath>
        </defs>
        </svg>
    `;
};

export const HelpOutlineIcon = ({ className = "", fill = "", style = {} }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <g clip-path="url(#clip0_52342_113207)">
      <path
        d="M11 18H13V16H11V18ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C9.79 6 8 7.79 8 10H10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 12 11 11.75 11 15H13C13 12.75 16 12.5 16 10C16 7.79 14.21 6 12 6Z"
        fill={fill}
      />
    </g>
    <defs>
      <clipPath id="clip0_52342_113207">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const Warehouse = ({ className = "", fill = "white", fillBackground = "#42BBFF", style = {} }) => {
  return (
    <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} className={className}>
      <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill={fillBackground} stroke="#D6D5D4" />
      <g clip-path="url(#clip0_6391_89286)">
        <path d="M12.0001 6L6.66675 10V18H10.0001V13.3333H14.0001V18H17.3334V10L12.0001 6Z" fill={fill} />
      </g>
      <defs>
        <clipPath id="clip0_6391_89286">
          <rect width="16" height="16" fill="white" transform="translate(4 4)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const WarehouseMarker = ({ className = "", fill = "white", fillBackground = "#42BBFF", style = {} }) => {
  return `
    <svg width="50" height="50" viewBox="0 0 18 26" fill="none" xmlns="http://www.w3.org/2000/svg" style=${style} className=${className}>
      <path d="M9 0C4.03714 0 0 4.082 0 9.1C0 15.925 9 26 9 26C9 26 18 15.925 18 9.1C18 4.082 13.9629 0 9 0Z" fill=${fillBackground} />
      <g clip-path="url(#clip0_5909_17198)">
        <path d="M9 4.5L5 7.5V13.5H7.5V10H10.5V13.5H13V7.5L9 4.5Z" fill=${fill} />
      </g>
      <defs>
        <clipPath id="clip0_5909_17198">
          <rect width="12" height="12" fill="white" transform="translate(3 3)" />
        </clipPath>
      </defs>
    </svg>
    `;
};

