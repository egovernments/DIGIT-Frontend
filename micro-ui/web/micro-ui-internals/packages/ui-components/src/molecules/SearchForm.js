import React from "react";

export const SearchField = ({ children, className }) => {
  // no mission specific code should be written here. for additional define use variant or classname props.
  return <div className={`digit-form-field ${className || ""}`} role="group">{children}</div>;
};

export const SearchForm = ({ children, onSubmit, handleSubmit, id, className = "", variant = "" }) => {
  // define variant unset to unset all styles define by classname
  return (
    <form aria-label="Search Form" className={`digit-search-form-wrapper ${variant} ${className}`} onSubmit={handleSubmit(onSubmit)} {...{ id }}>
      {children}
    </form>
  );
};
