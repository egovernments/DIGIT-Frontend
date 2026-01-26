import React, { Children ,useState,useEffect} from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const FormCard = ({
  type,
  style = {},
  children,
  className,
  layout,
  headerData,
  equalWidthButtons,
  withDivider,
  footerData,
  ...props
}) => {

  const [isMobileView, setIsMobileView] = useState(
    (window.innerWidth / window.innerHeight <= 9/16)
  );
  const onResize = () => {
    if (window.innerWidth / window.innerHeight <= 9/16) {
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


  // Parse the layout prop to determine rows and columns
  const [rows, columns] = layout
  ? layout.split("*").map(num => {
      const parsed = Number(num);
      return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
    })
  : [1, 1];

  // Create grid template strings dynamically
  const gridTemplateColumns = `repeat(${columns}, 1fr)`;
  const gridTemplateRows = `repeat(${rows}, 1fr)`;

  // Inline styles for the grid layout
  const gridStyles = {
    display: "grid",
    gridTemplateColumns,
    gridTemplateRows,
    ...style,
  };

    const childrenWithDividers = React.Children.map(children, (child, index) => {
      const isEndOfRow = (index + 1) % columns === 0; 
      return (
        <React.Fragment key={index}>
          {child}
          {!isEndOfRow && withDivider && (
            <div
              className="vertical-formcard-divider"
              style={{
                left: `calc(100% / ${columns} * ${(index % columns) + 1})`,
              }}
            />
          )}
        </React.Fragment>
      );
    });

  return (
    <div className={`digit-form-card ${className || ""}`}>
      {headerData && (
        <div className={`digit-form-card-header`}>{headerData}</div>
      )}
      <div
        className={`digit-form-card-content ${
          !footerData || footerData.length <= 0 || footerData === undefined
            ? "withoutFooter"
            : ""
        } ${withDivider ? "with-divider" : ""}`}
        style={isMobileView ? {...style} : gridStyles}
      >
        {!isMobileView ? childrenWithDividers : children}
      </div>
      {footerData && (
        <div className={`digit-form-card-footer`}>
          <div
            className={`digit-form-card-buttons ${
              equalWidthButtons ? "equal-buttons" : ""
            }`}
          >
            {footerData}
          </div>
        </div>
      )}
    </div>
  );
};

FormCard.propTypes = {
  type: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
  layout: PropTypes.string,
  headerData: PropTypes.node,
  equalWidthButtons: PropTypes.bool,
  withDivider: PropTypes.bool,
  footerData: PropTypes.node,
};
export default FormCard;
