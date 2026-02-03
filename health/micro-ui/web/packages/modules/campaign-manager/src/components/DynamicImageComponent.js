import React from "react";
import PropTypes from "prop-types";

export const DynamicImageComponent = ({ type, appType }) => {
  //TODO add this in global config @bhavya
  return (
    <img
      src={`https://egov-dev-assets.s3.ap-south-1.amazonaws.com/hcm/${type}/${appType}.svg`}
      style={{marginTop: "0.5rem", marginBottom: "0.5rem"}} // TODO @Nabeel @jagan @bhavya scan through the app we should have s3 urls added in app directly 
      className="dynamic-image-component"
      alt={`Unsupported field type: ${type}`}
    />
  );
};

DynamicImageComponent.propTypes = {
  /** custom field type  */
  type: PropTypes.string,
  /** custom field apptype  */
  appType: PropTypes.string,
};
