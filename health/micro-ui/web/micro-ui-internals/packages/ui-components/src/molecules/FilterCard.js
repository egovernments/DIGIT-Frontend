import React, { useState, useEffect, useRef, Fragment } from "react";
import { SVG } from "../atoms/SVG";
import PropTypes from 'prop-types';
import Button from "../atoms/Button";

const FilterCard = ({
  title,
  titleIcon,
  children,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryPressed,
  onSecondaryPressed,
  layoutType = "horizontal",
  equalWidthButtons,
  addClose,
  onClose,
  className,
  style,
  hideIcon,
  isPopup = false,
  onOverlayClick,
  contentClassName
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const childrenWrapRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  const [isMobileView, setIsMobileView] = useState(
    window.innerWidth / window.innerHeight <= 9 / 16
  );

  const checkOverflow = () => {
    if (childrenWrapRef.current) {
      const isOverflow =
        childrenWrapRef.current.scrollHeight >
        childrenWrapRef.current.clientHeight;
      setIsOverflowing(isOverflow);
    }
  };

  const onResize = () => {
    if (window.innerWidth / window.innerHeight <= 9 / 16) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
    checkOverflow();
  };

  useEffect(() => {
    const handleScroll = () => checkOverflow();
    const childrenWrap = childrenWrapRef.current;

    if (childrenWrap) {
      childrenWrap.addEventListener("scroll", handleScroll);
      checkOverflow();
    }

    return () => {
      if (childrenWrap) {
        childrenWrap.removeEventListener("scroll", handleScroll);
      }
    };
  }, [children]);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    checkOverflow();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleOverlayClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      if(onOverlayClick){
        onOverlayClick();
      }
    }, 300);
  };


  const renderButtons = () =>
    isMobileView || layoutType === "vertical" ? (
      <div
        className={`button-container ${layoutType || ""} ${
          equalWidthButtons ? "equal-buttons" : ""
        } ${isOverflowing ? "with-shadow" : ""}`}
      >
        {primaryActionLabel && onPrimaryPressed && (
          <Button label={primaryActionLabel} onClick={onPrimaryPressed} />
        )}

        {secondaryActionLabel && onSecondaryPressed && (
          <Button
            label={secondaryActionLabel}
            onClick={onSecondaryPressed}
            variation="teritiary"
          />
        )}
      </div>
    ) : (
      <div
        className={`button-container ${layoutType || ""} ${
          equalWidthButtons ? "equal-buttons" : ""
        }`}
      >
        {secondaryActionLabel && onSecondaryPressed && (
          <Button
            label={secondaryActionLabel}
            onClick={onSecondaryPressed}
            variation="teritiary"
          />
        )}
        {primaryActionLabel && onPrimaryPressed && (
          <Button label={primaryActionLabel} onClick={onPrimaryPressed} />
        )}
      </div>
    );

  const renderContent = () => (
    <div
      ref={childrenWrapRef}
      className={`content-container ${isOverflowing ? "with-shadow" : ""} ${contentClassName || ""}`}
    >
      {children}
      {(secondaryActionLabel || primaryActionLabel) &&
        layoutType === "horizontal" &&
        ((isPopup && !isMobileView) || !isPopup) &&
        renderButtons()}
    </div>
  );

  const renderHeader = () => (
    <div
      className={`filter-header ${isOverflowing ? "with-shadow" : ""} ${
        !secondaryActionLabel && !primaryActionLabel ? "without-footer" : ""
      }`}
    >
      <div className="title-container">
        {!hideIcon ? (
          titleIcon ? (
            titleIcon
          ) : (
            <SVG.FilterAlt
              width={"32px"}
              height={"32px"}
              fill={"#C84C0E"}
            ></SVG.FilterAlt>
          )
        ) : null}

        {title && <div className="filter-title">{title}</div>}
        {addClose && (
          <div className="close-icon" onClick={handleClose}>
            <SVG.Close width={"32px"} height={"32px"} fill={"#363636"} />
          </div>
        )}
      </div>
    </div>
  );

  if (isPopup) {
    return (
      <div
        className={`digit-filter-card-popup-overlay`}
        tabIndex={0}
        onClick={() => handleOverlayClick()}
      >
        <div
          className={`digit-filter-card-popup-wrapper ${
            layoutType === "horizontal"
              ? "filter-card-horizontal"
              : "filter-card-vertical"
          } ${isClosing ? "closing" : ""} ${className ? className : ""}`}
          style={style}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || titleIcon || addClose) && renderHeader()}

          {layoutType === "horizontal" && !isMobileView ? (
            <div className="content-action-wrapper">{renderContent()}</div>
          ) : (
            <>
              {renderContent()}
              {(secondaryActionLabel || primaryActionLabel) && renderButtons()}
            </>
          )}
        </div>
      </div>
    );
  }

  if (layoutType === "vertical") {
    return (
      <div
        className={`filter-card filter-card-vertical ${className || ""}`}
        style={style}
      >
        {(title || titleIcon || addClose) && renderHeader()}
        {renderContent()}
        {(secondaryActionLabel || primaryActionLabel) && renderButtons()}
      </div>
    );
  }
  return (
    <div
      className={`filter-card filter-card-horizontal ${className || ""}`}
      style={style}
    >
      {(title || titleIcon || addClose) && renderHeader()}
      <div className="content-action-wrapper">{renderContent()}</div>
    </div>
  );
};

FilterCard.propTypes = {
  title: PropTypes.string,
  titleIcon: PropTypes.element,
  children: PropTypes.node.isRequired,
  primaryActionLabel: PropTypes.string,
  secondaryActionLabel: PropTypes.string,
  onPrimaryPressed: PropTypes.func,
  onSecondaryPressed: PropTypes.func,
  layoutType: PropTypes.oneOf(['horizontal', 'vertical']),
  equalWidthButtons: PropTypes.bool,
  addClose: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  hideIcon: PropTypes.bool,
  isPopup: PropTypes.bool,
  onOverlayClick: PropTypes.func,
};

export default FilterCard;