import React, { Fragment, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Panels } from "../atoms";

const PanelCard = (props) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const childrenWrapRef = useRef(null);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 480);

  const checkOverflow = () => {
    if (childrenWrapRef.current) {
      const isOverflow =
        childrenWrapRef.current.scrollHeight >
        childrenWrapRef.current.clientHeight;
      setIsOverflowing(isOverflow);
    }
  };

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
  }, [props.children]);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    checkOverflow();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const hasFooterChildren = props?.footerChildren?.length > 0;

  const allowedFooter = hasFooterChildren
    ? props?.footerChildren.slice(0, props?.maxFooterButtonsAllowed || 5)
    : [];

  const sortedFooterButtons = [...allowedFooter].sort((a, b) => {
    const typeOrder = { primary: 3, secondary: 2, tertiary: 1 };
    const getTypeOrder = (button) =>
      typeOrder[(button.props.variation || "").toLowerCase()];
    return getTypeOrder(a) - getTypeOrder(b);
  });

  const finalFooterArray = props?.sortFooterButtons
    ? isMobileView
      ? sortedFooterButtons.reverse()
      : sortedFooterButtons
    : allowedFooter;

  return (
    <div
      className={`digit-panelcard-wrap ${
        props?.cardClassName ? props?.cardClassName : ""
      } ${isOverflowing ? "with-shadow" : ""}`}
      style={props?.cardStyles}
    >
      {
        <div
          className={`digit-panelcard-header ${
            isOverflowing ? "with-shadow" : ""
          }`}
        >
          <Panels {...props}></Panels>
        </div>
      }
      {(props?.children?.length>0 || props?.description!=="") && (
        <div
          ref={childrenWrapRef}
          className={`digit-panelcard-children-wrap ${
            props?.showChildrenInline ? "inline" : ""
          } ${isOverflowing ? "with-shadow" : ""} ${
            !hasFooterChildren ? "without-footer" : ""
          }`}
        >
          {props?.description && (
            <div className="digit-panelcard-description">
              {props?.description}
            </div>
          )}
          {props?.children}
        </div>
      )}
      {hasFooterChildren && (
        <div
          className={`digit-panelcard-footer ${
            props?.footerclassName ? props?.footerclassName : ""
          } ${isOverflowing ? "with-shadow" : ""}`}
        >
          <div
            className="digit-panelcard-footer-buttons"
            style={{ ...props?.footerStyles }}
          >
            {finalFooterArray}
          </div>
        </div>
      )}
    </div>
  );
};

PanelCard.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  footerChildren: PropTypes.node,
  message: PropTypes.string,
  type: PropTypes.string,
  info: PropTypes.string,
  response: PropTypes.string,
  customIcon: PropTypes.string,
  iconFill: PropTypes.string,
  multipleResponses: PropTypes.array,
};

export default PanelCard;
