import { useState, useEffect, useRef } from "react";
import { useWatch } from "react-hook-form";

const useLastUpdatedField = (control, fieldNames) => {
  const [lastUpdatedField, setLastUpdatedField] = useState(null);
  const watchedValues = useWatch({ control, name: fieldNames });
  const prevValuesRef = useRef({});

  useEffect(() => {
    const prevValues = prevValuesRef.current;

    fieldNames.forEach((field, ind) => {
      if (prevValues[ind] !== watchedValues[ind]) {
        setLastUpdatedField(field);
        prevValues[ind] = watchedValues[ind];
      }
    });

    prevValuesRef.current = { ...watchedValues };
  }, [watchedValues, fieldNames]);
  return lastUpdatedField;
};

export default useLastUpdatedField;
