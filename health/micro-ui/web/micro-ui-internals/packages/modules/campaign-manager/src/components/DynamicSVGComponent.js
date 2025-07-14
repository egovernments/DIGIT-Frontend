import PropTypes from "prop-types";
import React, { useEffect, useState } from 'react';

 const fetchAndInjectSVGTemplate= async(url, data = {})=>{
  const response = await fetch(url);
  let svgText = await response.text();

  // Replace all {{key}} placeholders in the SVG
  Object.entries(data).forEach(([key, value]) => {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    svgText = svgText.replace(pattern, value);
  });

  return svgText;
}


const DynamicSVG = ({ type,appType, data }) => {
  const url=`https://egov-dev-assets.s3.ap-south-1.amazonaws.com/hcm/${type}/${appType}.svg`; // TODO @Nabeel @jagan @bhavya scan through the app we should have s3 urls added in app directly 
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    fetchAndInjectSVGTemplate(url, data).then(setSvgContent);
  }, [url, data]);

  return (
    <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }} // TODO @Nabeel @jagan @bhavya scan through the app we should have s3 urls added in app directly
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
