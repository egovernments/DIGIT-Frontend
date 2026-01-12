import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo } from "react";
import { addMissingKey } from "../redux/localizationSlice";

export const useCustomT = (code) => {
  const dispatch = useDispatch();
  const { data: locState, currentLocale } = useSelector((state) => state.localization);

  const translatedValue = useMemo(() => {
    if (!code) {
      return "";
    }

    if (!locState || !Array.isArray(locState)) {
      return ""; // Return empty string if locState not ready
    }

    const entry = locState?.find((item) => item.code === code);

    if (!entry) {
      // Add the missing key to Redux store with empty message for current locale
      dispatch(addMissingKey({ code }));

      return ""; // Return empty string when entry not found
    }

    // Get current locale from Redux state or session storage as fallback
    const locale = currentLocale || Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;

    return entry[locale] || ""; // Return the message or empty string
  }, [code, locState, currentLocale, dispatch]);

  return translatedValue;
};

// Hook that returns a stable translate function (can be passed as prop)
export const useCustomTranslate = () => {
  const dispatch = useDispatch();
  const { data: locState, currentLocale } = useSelector((state) => state.localization);

  return useCallback(
    (code) => {
      if (!code) {
        return "";
      }

      if (!locState || !Array.isArray(locState)) {
        return ""; // Return empty string if locState not ready
      }

      const entry = locState?.find((item) => item.code === code);

      if (!entry) {
        // Add the missing key to Redux store with empty message for current locale
        dispatch(addMissingKey({ code }));

        return ""; // Return empty string when entry not found
      }

      // Get current locale from Redux state or session storage as fallback
      const locale = currentLocale || Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;

      return entry[locale] || ""; // Return the message or empty string
    },
    [dispatch, locState, currentLocale]
  );
};

// Helper hook to get localization label for field data
export const useFieldDataLabel = (label) => {
  const customT = useCustomT(label || "");
  return label ? customT : "";
};
