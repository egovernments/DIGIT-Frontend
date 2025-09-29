import { useSelector, useDispatch } from "react-redux";
import { addMissingKey } from "../redux/localizationSlice";

export const useCustomT = (code) => {
  const dispatch = useDispatch();
  const { data: locState, currentLocale } = useSelector((state) => state.localization);

  if (!code) {
    return "";
  }

  if (!Array.isArray(locState)) {
    return "";
  }

  const entry = locState?.find((item) => item.code === code);

  if (!entry) {
    // Get enabled modules from session storage
    const enabledModules = Digit?.SessionStorage.get("initData")?.languages || [];

    // Add the missing key to Redux store
    dispatch(addMissingKey({ code, enabledModules }));

    return ""; // Return empty string as placeholder
  }

  // Get current locale from Redux state or session storage as fallback
  const locale = currentLocale || Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;

  return entry[locale] || ""; // Return the message or fallback to empty string
};

// Helper hook to get localization label for field data
export const useFieldDataLabel = (label) => {
  const customT = useCustomT(label || "");
  return label ? customT : "";
};
