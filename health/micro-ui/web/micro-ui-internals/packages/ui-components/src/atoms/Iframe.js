import React from "react";

const Iframe = (props) => {
  return (
    <iframe
      src={props?.src}
      width={props?.width || "100%"}
      height={props?.height || "830"}
      style={{ ...props?.style,border: "none" }}
      title={props?.title}
      className={props?.className}
    />
  );
};

export default Iframe;
