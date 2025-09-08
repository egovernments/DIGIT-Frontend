const roundedValue = (value) => {
    if (Math.floor(value).toString().length > 2) {
      return Math.round(value);
    } else {
      return Number(value.toFixed(2));
    }
  };
  
  export default roundedValue;
  