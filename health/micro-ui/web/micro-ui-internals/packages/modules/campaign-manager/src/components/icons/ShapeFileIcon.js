import React from "react";

export const ShpFileIcon = () => (
  <svg width="96" height="120" viewBox="0 0 96 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* File outline */}
    <rect
      x="5"
      y="5"
      width="86"
      height="110"
      rx="10"
      ry="10"
      fill="url(#gradient)" // Gradient fill
      stroke="#DAA520" // Golden outline
      strokeWidth="2"
    />

    {/* File fold at the top-right corner */}
    <path
      d="M64 0V24H88"
      fill="url(#foldGradient)"
      stroke="#DAA520"
      strokeWidth="1"
    />

    {/* Shadow under the fold */}
    <path
      d="M64 24L88 24"
      stroke="#FFD700"
      strokeOpacity="0.5"
      strokeWidth="1.5"
    />

    {/* Add subtle shadow for depth */}
    <rect
      x="5"
      y="5"
      width="86"
      height="110"
      rx="10"
      ry="10"
      fill="none"
      stroke="rgba(0,0,0,0.2)" // Shadow
      strokeWidth="4"
      strokeLinecap="round"
    />

    {/* Add .SHP text below the file */}
    <text x="28" y="115" fill="#DAA520" fontSize="22" fontWeight="bold">.SHP</text>

    {/* Define gradient for file */}
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FFEA00", stopOpacity: 1 }} />
      </linearGradient>

      {/* Gradient for the folded corner */}
      <linearGradient id="foldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FFDE5A", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FFD700", stopOpacity: 0.8 }} />
      </linearGradient>
    </defs>
  </svg>
);
