import React from "react";
import PropTypes from "prop-types";

export const Profile = ({ className, style = {}, width = "32", height = "32" }) => (
  <svg
    className={className}
    style={{ ...style }}
    width={width}
    height={height}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M64.1971 32C64.1971 42.1402 59.4661 51.1788 52.0842 57.0414C46.6012 61.3975 39.6545 64 32.0986 64C24.5426 64 17.596 61.3975 12.1129 57.0414C4.73099 51.1788 0 42.1402 0 32C0 14.3271 14.3712 0 32.0986 0C49.8259 0 64.1971 14.3271 64.1971 32Z"
      fill="#E5E5E5"
    />
    <path
      d="M32.0375 37.5803C39.2897 37.5803 45.1687 31.7193 45.1687 24.4893C45.1687 17.2594 39.2897 11.3984 32.0375 11.3984C24.7853 11.3984 18.9062 17.2594 18.9062 24.4893C18.9062 31.7193 24.7853 37.5803 32.0375 37.5803Z"
      fill="#A6AFB2"
    />
    <path
      d="M52.3384 57.0411C46.8554 61.3972 39.9088 63.9996 32.3528 63.9996C24.7969 63.9996 17.8502 61.3972 12.3672 57.0411C14.9628 48.4903 22.9285 42.2651 32.3528 42.2651C41.7771 42.2651 49.7428 48.4903 52.3384 57.0411Z"
      fill="#A6AFB2"
    />
  </svg>
);

Profile.propTypes = {
  /** custom width of the svg icon */
  width: PropTypes.string,
  /** custom height of the svg icon */
  height: PropTypes.string,
  /** custom class of the svg icon */
  className: PropTypes.string,
  /** custom style of the svg icon */
  style: PropTypes.object,
};
