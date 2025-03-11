import  React,{ useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ErrorMessage from "./ErrorMessage";

const OTPInput = ({
  length = 6,
  type = "numeric",
  onChange,
  placeholder,
  className,
  style,
  label,
  inline,
  masking = false,
}) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    const isAlphanumeric = /^[a-zA-Z0-9]*$/;

    if (
      (type === "numeric" && !isNaN(value) && value !== " ") ||
      (type === "alphanumeric" && isAlphanumeric.test(value))
    ) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (newOtp.join("").length === length && !newOtp.includes("")) {
        const finalOtp = newOtp.join("");
        const callbackError = onChange(finalOtp);
        setError(callbackError || null);
      }

      if (value && index < length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    const newOtp = [...otp];
    let pasteIndex = 0;
    for (let i = 0; i < newOtp.length && pasteIndex < pastedData.length; i++) {
      const char = pastedData[pasteIndex];

      if (
        (type === "numeric" && !isNaN(char) && char !== " ") ||
        (type === "alphanumeric" && /^[a-zA-Z0-9]*$/.test(char))
      ) {
        newOtp[i] = char;
        pasteIndex++;
      }
    }

    setOtp(newOtp);
    if (newOtp.join("").length === length && !newOtp.includes("")) {
      const finalOtp = newOtp.join("");
      const callbackError = onChange(finalOtp);
      setError(callbackError || null);
    }

    // Focusing on the next input after the last pasted character
    const nextIndex = pasteIndex < length ? pasteIndex : length - 1;
    inputRefs.current[nextIndex].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      // Remove the current value and shift all subsequent values to the left
      for (let i = index; i < newOtp.length - 1; i++) {
        newOtp[i] = newOtp[i + 1];
      }
      newOtp[newOtp.length - 1] = "";

      setOtp(newOtp);
      onChange(newOtp.join(""));
      if (index > 0) {
        inputRefs.current[index - 1].focus(); // Move back to the previous input
      }
    } else if (e.key === "Enter") {
      if (index === length - 1) {
        if (otp.join("").length === length && !otp.includes("")) {
          const finalOtp = otp.join("");
          const callbackError = onChange(finalOtp);
          setError(callbackError || null);
        }
      } else {
        inputRefs.current[index + 1].focus(); // Move to next input on Enter
      }
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1].focus(); // Move to next input with ArrowRight
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus(); // Move to previous input with ArrowLeft
    }
  };

  const handleBlur = (index) => {
    if (index === length - 1) {
      const callbackError = onChange(otp.join("")); // Trigger callback on blur of the last input
      setError(callbackError || null);
    }
  };

  return (
    <div
      className={`digit-label-otp-wrapper ${inline ? "inline" : ""} ${
        className || ""
      }`}
      style={style}
    >
      <div className={`digit-otp-label`}>{label}</div>
      <div className={`otp-error-wrapper`}>
      <div className="otp-input-container" style={{display:"flex"}}>
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={masking && otp[index] ? "●" : otp[index]}
            ref={(el) => (inputRefs.current[index] = el)}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onBlur={() => handleBlur(index)}
            onPaste={handlePaste}
            placeholder={placeholder && placeholder[index]}
            className={`otp-input ${error ? "error" : ""}`}
          />
        ))}
      </div>
      {error && error.length > 0 && (
        <ErrorMessage
          message={t(error)}
          truncateMessage={true}
          maxLength={256}
          showIcon={true}
        />
      )}
      </div>
    </div>
  );
};

export default OTPInput;
