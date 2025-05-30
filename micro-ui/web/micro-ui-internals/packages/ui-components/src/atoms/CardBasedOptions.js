import React from "react";

const Option = ({ name, Icon, onClick, className }) => {
  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && typeof onClick === "function") {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div className={className || `digit-card-based-options-main-child-option`} onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="digit-child-option-image-wrapper">{Icon}</div>
      <p className="digit-child-option-name">{name}</p>
    </div>
  );
};

const CardBasedOptions = ({ header, sideOption, options, styles = {}, style = {} }) => {
  return (
    <div className="digit-card-based-options" style={style}>
      <div className="digit-head-content">
        <h2>{header}</h2>
        <p onClick={sideOption.onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && typeof sideOption.onClick === "function") {
              e.preventDefault();
              sideOption.onClick(e);
            }
          }}
        >
          {sideOption.name}
        </p>
      </div>
      <div className="digit-main-content">
        {options.map((props, index) => (
          <Option key={index} {...props} />
        ))}
      </div>
    </div>
  );
};

export default CardBasedOptions;
