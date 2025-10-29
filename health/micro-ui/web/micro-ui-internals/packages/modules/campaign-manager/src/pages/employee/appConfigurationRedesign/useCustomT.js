import { useMemo } from "react";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";

/**
 * useCustomT
 *
 * SAFE usage (preferred):
 *   const tt = useCustomT();
 *   const label = tt("SOME_CODE");

 */
export const useCustomT = (maybeCode) => {
  const { locState, addMissingKey } = useAppLocalisationContext();
  const currentLocale =
    Digit?.SessionStorage.get("locale") ||
    Digit?.SessionStorage.get("initData")?.selectedLanguage;

  const translate = useMemo(() => {
    const list = Array.isArray(locState) ? locState : [];
    return (code) => {
      if (!code) {
        console.warn("useCustomT: code parameter is required");
        return "";
      }
      const entry = list.find((item) => item?.code === code);
      if (!entry) {
        addMissingKey(code);
        return "";
      }
      const msg = entry?.[currentLocale];
      return msg || "";
    };
  }, [locState, addMissingKey, currentLocale]);

  // Back-compat: allow direct call useCustomT("KEY")
  if (typeof maybeCode === "string") return translate(maybeCode);

  // Preferred: return a stable translator function
  return translate;
};