import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "./Button";

const ButtonGroup = ({ buttonsArray ,sortButtons,equalButtons}) => {
  const [isMobileView, setIsMobileView] = React.useState(
    window.innerWidth <= 480
  );
  const onResize = () => {
    if (window.innerWidth <= 480) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      onResize();
    });
    return () => {
      window.addEventListener("resize", () => { 
        onResize();
      });
    };
  });

  const maxWidth = equalButtons ? Math.max(
    ...buttonsArray.map((button) => button.props.label.length * 14.9)
  ) : null;

  const updatedButtonsArray = buttonsArray && buttonsArray.length > 1 && equalButtons ? buttonsArray.map((button) => {
    const buttonProps = {
      ...button.props,
      style: { ...(button.props.style || {}), width: `${maxWidth}px` },
    };
    return <Button key={buttonProps.key} {...buttonProps} />;
  }) : buttonsArray;

  const resultArray = isMobileView ? buttonsArray : updatedButtonsArray;

  const sortedButtons = [...resultArray].sort((a, b) => {
    const typeOrder = { primary: 3, secondary: 2, tertiary: 1 };
    const getTypeOrder = (button) =>
      typeOrder[(button.props.variation || "").toLowerCase()];
    return getTypeOrder(a) - getTypeOrder(b);
  });

  const finalResultArray = sortButtons ? 
  (isMobileView
  ? sortedButtons.reverse() 
  : sortedButtons) : resultArray;

  return (
    <div className="digit-buttons-group">  
      {finalResultArray.map((button, index) => (
        <div key={index}>{button}</div>
      ))}
    </div>
  );
};

ButtonGroup.propTypes = {
  buttonsArray: PropTypes.arrayOf(PropTypes.element).isRequired,
  sortButtons:PropTypes.bool,
  equalButtons:PropTypes.bool
};

ButtonGroup.defaultProps = {
  equalButtons: true,
}
export default ButtonGroup;

