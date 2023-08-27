import React, { useState } from "react";

const Input = ({ label }) => {
  const [val, setVal] = useState("");

  return (
    <span>
      <label>{label}</label>
      <input
        type="text"
        style={{ width: "100%", marginBottom: "16px" }}
        onChange={(e) => setVal(e.target.value)}
        value={val}
      ></input>
    </span>
    // <TextField
    //   label={label}
    //   variant="outlined"
    //   style={{ width: "100%", marginBottom: "16px" }}
    //   onChange={(e) => setVal(e.target.value)}
    //   value={val}
    // />
  );
};

export default Input;
