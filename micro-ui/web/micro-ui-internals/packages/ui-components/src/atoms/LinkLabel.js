import React from "react";

const LinkLabel = (props) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      props.onClick?.(e);
    }
  };
  return (
    <label className="link-label" onClick={props.onClick} style={{ ...props.style }} onKeyDown={handleKeyDown} tabIndex={0} role="button"> 
      {props.children}
    </label>
  );
};

export default LinkLabel;
