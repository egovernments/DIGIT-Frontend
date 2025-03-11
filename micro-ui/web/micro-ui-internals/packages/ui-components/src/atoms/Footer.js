import React,{useState,useEffect} from "react";
import PropTypes from "prop-types";

const Footer = (props) => {

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 480);
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
      window.removeEventListener("resize", () => {
        onResize();
      });
    };
  });

  const hasActionFields = props?.actionFields?.length > 0;
  const allowedActionFields = hasActionFields
    ? props?.actionFields.slice(0, props?.maxActionFieldsAllowed || 5)
    : [];
  const sortedActionFields = [...allowedActionFields].sort((a, b) => {
    const typeOrder = { primary: 3, secondary: 2, tertiary: 1 };
    const getTypeOrder = (button) =>
      typeOrder[(button.props.variation || "").toLowerCase()];
    return getTypeOrder(a) - getTypeOrder(b);
  });
  const finalActionFields = props?.sortActionFields
    ? isMobileView
      ? sortedActionFields.reverse()
      : sortedActionFields
    : allowedActionFields;



  return (
    <div className={`digit-action-bar-wrap ${props?.className ? props?.className : ""}`} style={props?.style}>
      {hasActionFields && (
        <div
          className={`digit-action-bar-fields ${
            props?.setactionFieldsToRight ? "toRight" : ""
          } ${
            props?.setactionFieldsToLeft ? "toLeft" : ""
          }`}
        >
          {finalActionFields.map((field, index) => (
            <div className="action-bar-individual-action-field" key={index}>
              {field}
            </div>
          ))}
        </div>
      )}
      {props?.children}
    </div>
  );
};

Footer.propTypes = {
  /** custom class of the svg icon */
  className: PropTypes.string,
  /** custom style of the svg icon */
  style: PropTypes.object,
};

export default Footer;