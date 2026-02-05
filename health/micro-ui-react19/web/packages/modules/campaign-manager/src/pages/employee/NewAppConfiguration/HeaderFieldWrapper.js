import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCustomT } from "./hooks/useCustomT";
import { useTranslation } from "react-i18next";
import { LabelFieldPair, TextInput, TextArea } from "@egovernments/digit-ui-components";
import { updateLocalizationEntry } from "./redux/localizationSlice";
import { updateHeaderField, updateHeaderProperty } from "./redux/remoteConfigSlice";

const HeaderFieldWrapper = ({ label, type, value, currentCard, index, cardIndex = 0, fieldKey }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentLocale = useSelector((state) => state.localization.currentLocale);
 // Generate fallback localization code using available properties
  const generateLocCode = useCallback(
    () => `${currentCard?.flow || currentCard?.module || ''}_${currentCard?.page || currentCard?.name || ''}_${label}`,
    [currentCard?.flow, currentCard?.module, currentCard?.page, currentCard?.name, label]
  );
  const localizedValue = useCustomT(value ? value : generateLocCode());
  const [localValue, setLocalValue] = useState(localizedValue || "");
  const debounceTimerRef = useRef(null);

  // Sync local value when localizedValue changes
  useEffect(() => {
    setLocalValue(localizedValue || "");
  }, [localizedValue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const dispatchUpdates = useCallback((newValue) => {
    const locCode = value || generateLocCode();
    // Update localization
    dispatch(
      updateLocalizationEntry({
        code: locCode,
        locale: currentLocale || "en_IN",
        message: newValue,
      })
    );

    // Update header property in Redux - use new action if fieldKey is provided
    if (fieldKey) {
      dispatch(updateHeaderProperty({ fieldKey, value: locCode }));
    } else {
      // Fallback to old method for backward compatibility
      dispatch(updateHeaderField({ cardIndex, fieldIndex: index, value: label }));
    }
  }, [value, generateLocCode, currentLocale, cardIndex, index, fieldKey, dispatch]);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the dispatch
    debounceTimerRef.current = setTimeout(() => {
      dispatchUpdates(newValue);
    }, 800);
  }, [dispatchUpdates]);

  const handleBlur = useCallback(() => {
    // Force immediate dispatch on blur
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
      dispatchUpdates(localValue);
    }
  }, [localValue, dispatchUpdates]);

  return (
    <LabelFieldPair className={type === "textarea" ? "appConfigHeaderLabelField desc" : "appConfigHeaderLabelField"} removeMargin={true}>
      <div className="appConfigLabelField-label-container">
        <div className="appConfigLabelField-label">
          <span>{t(label)}</span>
        </div>
        {type === "textarea" ? (
          <TextArea
            type="textarea"
            className="appConfigLabelField-Input"
            name=""
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ) : (
          <TextInput
            className="appConfigLabelField-Input"
            name=""
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}
      </div>
    </LabelFieldPair>
  );
};
export default React.memo(HeaderFieldWrapper);
