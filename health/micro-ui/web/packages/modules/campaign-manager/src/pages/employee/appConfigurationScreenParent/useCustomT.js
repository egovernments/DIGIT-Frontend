import { useAppLocalisationContext } from "./AppLocalisationWrapper";

export const useCustomT = (code) => {
  if (!code) {
    return "";
  }
  const { locState, addMissingKey } = useAppLocalisationContext();
  const currentLocale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  if (!Array.isArray(locState)) {
    return "";
  }
  const entry = locState?.find((item) => item.code === code);
  if (!entry) {
    addMissingKey(code); // Add the missing key
    return ""; // Return the key as a placeholder
  }
  return entry[currentLocale] || ""; // Return the message or fallback to the key
};
