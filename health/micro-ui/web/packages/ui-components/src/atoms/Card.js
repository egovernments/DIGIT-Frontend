import React, { Children } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const Card = ({
  type,
  onClick,
  style = {},
  children,
  className,
  ReactRef,
  variant,
  ...props
}) => {
  // const { pathname } = useLocation();
  // const classname = window?.Digit?.Hooks?.useRouteSubscription(pathname) || "";
  const info = window?.Digit?.UserService?.getUser()?.info || null;
  const userType = info?.type || null;

  return (
    <div
      className={`${
        props?.noCardStyle
          ? ""
          : "digit-card-component"
      } ${type ? type : ""} ${variant ? variant : ""} ${
        className ? className : ""
      }`}
      onClick={onClick}
      style={style}
      {...props}
      ref={ReactRef}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  type: PropTypes.string,
  variant: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
};
export default Card;
