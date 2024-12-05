import React, { useState } from "react";

const PlusMinusInput = (props, customProps) => {
  let quantity = props?.defaultValues || 1;

  function incrementCount() {
    if (quantity >= 1) {
      quantity = quantity + 1;
      props.onSelect(quantity);
    } else {
      quantity = 1;
      props.onSelect(quantity);
    }
  }
  function decrementCount() {
    if (quantity > 1) {
      quantity = quantity - 1;
      props.onSelect(quantity);
    } else {
      quantity = 1;
      props.onSelect(quantity);
    }
  }

  return (
    <React.Fragment>
      <div className="PlusMinus">
        <button type="button" onClick={() => decrementCount(quantity)} className="PlusMinusbutton">
          -
        </button>
        <input
          readOnly={true}
          value={quantity}
          style={{
            textAlign: "center",
            border: "1px solid #505A5F",
          }}
        />
        <button type="button" onClick={() => incrementCount(quantity)} className="PlusMinusbutton">
          +
        </button>
      </div>
    </React.Fragment>
  );
};

export default PlusMinusInput;
