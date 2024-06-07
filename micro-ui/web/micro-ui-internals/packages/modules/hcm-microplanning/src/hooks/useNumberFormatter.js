import { useTranslation } from "react-i18next";

export const useNumberFormatter = ( FormatMapping ) => {
  const { i18n } = useTranslation();

  const formatNumber = (value, options) => {
    try {
      const locale = FormatMapping[i18n.language] || i18n.language;
      return new Intl.NumberFormat(locale, options).format(value);
    } catch (error) {
      console.error("Error formatting number:", error);
      return value;
    }
  };

  return { formatNumber };
};

export default useNumberFormatter;
