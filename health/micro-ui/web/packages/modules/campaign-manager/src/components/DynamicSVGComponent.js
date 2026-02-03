import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

const FALLBACK_SVG = `
  <svg width="100%" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    <rect width="100" height="100" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
    <circle cx="50" cy="40" r="8" fill="#999"/>
    <polyline points="20,80 35,60 50,70 70,45 85,60 85,80" fill="#ccc" stroke="#999" stroke-width="2"/>
    <line x1="20" y1="80" x2="85" y2="80" stroke="#999" stroke-width="2"/>
  </svg>
`;

const fetchAndInjectSVGTemplate = async (url, data = {}) => {
  try {
    const response = await fetch(url);

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      console.warn(`Failed to fetch SVG from ${url}, status: ${response.status}`);
      return FALLBACK_SVG;
    }

    let svgText = await response.text();

    // Replace all {{key}} placeholders in the SVG
    Object.entries(data).forEach(([key, value]) => {
      const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      svgText = svgText.replace(pattern, value);
    });

    // Ensure SVG has width="100%"
    svgText = svgText.replace(/<svg([^>]*)width="[^"]*"([^>]*)>/, '<svg$1width="100%"$2>');
    if (!svgText.includes('width=')) {
      svgText = svgText.replace(/<svg/, '<svg width="100%"');
    }

    return svgText;
  } catch (error) {
    console.error(`Error fetching SVG from ${url}:`, error);
    return FALLBACK_SVG;
  }
};

const DynamicSVG = ({ ...props }) => {
  const { field, type, fieldType } = props?.props || {};
  const s3Bucket = window?.globalConfigs?.getConfig?.("S3BUCKET") || "egov-dev-assets";
  const url = `https://${s3Bucket}.s3.ap-south-1.amazonaws.com/hcm/${type}/${field?.fieldName}.svg`;
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    fetchAndInjectSVGTemplate(url, field).then(setSvgContent);
  }, [url, field]);

  return (
    <div
      style={{ marginTop: "0.5rem", marginBottom: "0.5rem", width: "100%" }} // TODO @Nabeel @jagan @bhavya scan through the app we should have s3 urls added in app directly
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default DynamicSVG;

DynamicSVG.propTypes = {
  /** custom field type  */
  type: PropTypes.string,
  /** custom field apptype  */
  appType: PropTypes.string,
  /** custom svg data */
  data: PropTypes.object,
};
