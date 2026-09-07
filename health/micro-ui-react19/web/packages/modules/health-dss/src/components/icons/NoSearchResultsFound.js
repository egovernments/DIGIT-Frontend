import React from "react";
import { useTranslation } from "react-i18next";
import { SVG } from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";

const NoSearchResultsFound = ({ height = 262, width = 336, className, style, text }) => {
  const { t } = useTranslation();
  return (
    <div className={`digit-no-data-found ${className ? className : ""}`} style={style}>
      <SVG.NoResultsFoundIcon height={height} width={width} />
      <span className="digit-error-msg">{text ? t(text) : t(I18N_KEYS.COMMON.COMMON_NO_RESULTS_FOUND)}</span>
    </div>
  );
};

export default NoSearchResultsFound;
