import { useAppLocalisationContext } from "../AppLocalisationWrapper";

export const useCustomT = (code) => {
  if (!code) {
    console.warn("useCustomT: code parameter is required");
    return "";
  }
  const { locState, addMissingKey } = useAppLocalisationContext();
  const currentLocale =
    Digit?.SessionStorage.get("locale") ||
    Digit?.SessionStorage.get("initData")?.selectedLanguage;
  if (!Array.isArray(locState)) {
    console.warn("useCustomT: locState is not an array");
    return "";
  }
  const entry = locState?.find((item) => item.code === code);
  if (!entry) {
    addMissingKey(code); // Add the missing key
    return ""; // Return the key as a placeholder
  }
  return entry[currentLocale] || ""; // Return the message or fallback to the key
};
