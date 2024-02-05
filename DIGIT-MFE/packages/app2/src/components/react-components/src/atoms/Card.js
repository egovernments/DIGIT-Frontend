import React from "react";
import { useLocation } from "react-router-dom";
import useRouteSubscription from "../../../../../../ui-libraries/src/hooks/useRouteSubscription";
// import useLocation from "../../../../../../ui-libraries/src/hooks/useLocation";
const Card = ({ onClick, style, children, className, ReactRef, ...props }) => {
  // const { pathname } = useLocation();
  const pathname = "";
  const classname = useRouteSubscription(pathname);
  const info = Digit.UserService.getUser()?.info;
  const userType = info?.type;
  const isEmployee = classname === "employee" || userType === "EMPLOYEE";

  console.log("pathname:", pathname);
  console.log("classname:", className);
  console.log("info:", info);
  console.log("userType:", userType);
  return (
    <div
      className={`${
        props.noCardStyle ? "" : isEmployee ? "employeeCard" : "card"
      } ${className ? className : ""}`}
      onClick={onClick}
      style={style}
      {...props}
      ref={ReactRef}
    >
      {children}
    </div>
  );
};

export default Card;
