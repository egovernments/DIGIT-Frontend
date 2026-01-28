import React from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

export const PrivateRoute = ({ element, roles }) => {
  const location = useLocation();
  const user = window?.Digit?.UserService.getUser();
  const userType = window?.Digit?.UserService.getType();

  const getLoginRedirectionLink = () => {
    return userType === "employee"
      ? `/${window?.contextPath}/employee/user/language-selection`
      : `/${window?.contextPath}/citizen/login`;
  };

  if (!user || !user.access_token) {
    return (
      <Navigate
        to={getLoginRedirectionLink()}
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  return element; 
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};
