import React, { useState } from "react";

const Numeric = (props, customProps) => {

  const [count, setCount] = useState(props?.defaultValues || 0);

  const incrementCount = () => {
    if (count >= 0) {
      setCount(count + 1);
      props.onSelect(count);
    } else {
      setCount(0);
      props.onSelect(0);
    }
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount(count - 1);
      props.onSelect(count);
    } else {
      setCount(0);
      props.onSelect(0);
    }
  };

  const inputClassName = `Numeric ${props.disable ? "disabled" : ""
    }  ${props?.focused ? "focused" : ""} ${props.noneditable ? "noneditable" : ""} ${props?.errors?.errorMessage ? "error" : ""}`

  return (
    <React.Fragment>
      <div className="digit-text-input">
        <div className={inputClassName} role="group" aria-label="Numeric input control">
          <button 
            type="button" 
            onClick={() => decrementCount()} 
            className="NumericButton"
            aria-label="Decrease value"
            disabled={props.disable || count <= 0}
            tabIndex={props.disable ? -1 : 0}
          >
            -
          </button>
          <input
            value={count}
            style={{
              textAlign: "center",
              border: "1px solid #505A5F",
            }}
          />
          <button 
            type="button" 
            onClick={() => incrementCount()} 
            className="NumericButton"
            aria-label="Increase value"
            disabled={props.disable}
            tabIndex={props.disable ? -1 : 0}
          >
            +
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Numeric;

