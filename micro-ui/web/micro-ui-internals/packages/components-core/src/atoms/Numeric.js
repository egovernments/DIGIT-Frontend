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

  return (
    <React.Fragment>
      <div className="Numeric">
        <button type="button" onClick={() => decrementCount()} className="NumericButton">
          -
        </button>
        <input
          readOnly={true}
          value={count}
          style={{
            textAlign: "center",
            border: "1px solid #505A5F",
          }}
        />
        <button type="button" onClick={() => incrementCount()} className="NumericButton">
          +
        </button>
      </div>
    </React.Fragment>
  );
};

export default Numeric;

